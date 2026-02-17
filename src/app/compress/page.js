'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

import {
    Download,
    Upload,
    Image as ImageIcon,
    Zap,
    ShieldCheck,
    Layout
} from 'lucide-react';

import imageCompression from 'browser-image-compression';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GuideSection from '@/components/GuideSection';
import TrustSection from '@/components/TrustSection';

export default function ImageCompressor() {
    const [file, setFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState(null); // 'image' | 'pdf'
    const [previews, setPreviews] = useState([]); // Array of dataUrls
    const [isCompressing, setIsCompressing] = useState(false);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [qualityPreset, setQualityPreset] = useState('medium'); // 'high' | 'medium' | 'low' | 'custom'
    const [advancedMode, setAdvancedMode] = useState(false);
    const [customSettings, setCustomSettings] = useState({
        quality: 0.7,
        maxWidth: 1920,
        maxSizeMB: 1
    });
    const [compressedBlob, setCompressedBlob] = useState(null);
    const [compressedPages, setCompressedPages] = useState([]); // Array of dataURLs
    const [progress, setProgress] = useState(0);

    const [isSettingsDirty, setIsSettingsDirty] = useState(true);

    const fileInputRef = useRef(null);

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const loadPdfJs = () => {
        return new Promise((resolve, reject) => {
            if (window.pdfjsLib) {
                resolve(window.pdfjsLib);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(window.pdfjsLib);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setDocumentName(selectedFile.name);
        setOriginalSize(selectedFile.size);
        setCompressedBlob(null);
        setPreviews([]);
        setIsSettingsDirty(true);

        // Set default custom target size to 50% of original
        const halfSizeMB = (selectedFile.size / (1024 * 1024)) * 0.5;
        setCustomSettings(prev => ({ ...prev, maxSizeMB: Math.max(0.1, parseFloat(halfSizeMB.toFixed(2))) }));

        if (selectedFile.type === 'application/pdf') {
            setDocumentType('pdf');
            // Initial preview for PDF
            await generatePdfPreviews(selectedFile);
        } else if (selectedFile.type.startsWith('image/')) {
            setDocumentType('image');
            setPreviews([URL.createObjectURL(selectedFile)]);
        } else {
            alert('Format file tidak didukung. Gunakan Gambar atau PDF.');
            setFile(null);
        }

        // Auto-scroll to workspace
        setTimeout(() => {
            const workspace = document.querySelector(`.${styles.workspace}`);
            if (workspace) workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const generatePdfPreviews = async (pdfFile) => {
        try {
            const pdfjsLib = await loadPdfJs();
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const numPages = Math.min(pdf.numPages, 3); // Preview first 3 pages for speed
            const pagePreviews = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport }).promise;
                pagePreviews.push(canvas.toDataURL('image/jpeg', 0.6));
            }
            setPreviews(pagePreviews);
        } catch (err) {
            console.error('PDF Preview error:', err);
        }
    };

    const runCompression = async () => {
        if (!file) return;
        setIsCompressing(true);
        setProgress(10);

        let config;
        const origSizeMB = originalSize / (1024 * 1024);

        if (advancedMode) {
            config = customSettings;
        } else {
            const presets = {
                high: { quality: 0.8, maxWidth: 2500, ratio: 0.8 },
                medium: { quality: 0.6, maxWidth: 1920, ratio: 0.5 },
                low: { quality: 0.4, maxWidth: 1200, ratio: 0.2 },
            };
            const preset = presets[qualityPreset];
            config = {
                quality: preset.quality,
                maxWidth: preset.maxWidth,
                maxSizeMB: origSizeMB * preset.ratio
            };
        }

        try {
            if (documentType === 'image') {
                const options = {
                    maxSizeMB: config.maxSizeMB,
                    maxWidthOrHeight: config.maxWidth,
                    useWebWorker: true,
                    initialQuality: config.quality,
                    onProgress: (p) => setProgress(10 + (p * 80)),
                };
                const compressed = await imageCompression(file, options);
                setCompressedBlob(compressed);
                setCompressedSize(compressed.size);

                const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
                setCompressedPages([dataUrl]);
            } else {
                // PDF Compression (Rerender -> Compress Images -> Package PDF)
                const { jsPDF } = await import('jspdf');
                const pdfjsLib = await loadPdfJs();
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                let outPdf = null;
                const totalPages = pdf.numPages;
                const compressedPagesArr = [];

                for (let i = 1; i <= totalPages; i++) {
                    const page = await pdf.getPage(i);
                    // Dynamically adjust scale based on target width logic if possible,
                    // for now use static maps for presets, and 1.5 for custom
                    const scaleMap = { high: 2, medium: 1.5, low: 1 };
                    const pdfScale = advancedMode ? (config.maxWidth / 1200) : scaleMap[qualityPreset];

                    const viewport = page.getViewport({ scale: pdfScale });

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: ctx, viewport }).promise;

                    // Compress the page image
                    const imgData = canvas.toDataURL('image/jpeg', config.quality);
                    const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';

                    if (i === 1) {
                        outPdf = new jsPDF({
                            orientation,
                            unit: 'px',
                            format: [canvas.width, canvas.height],
                            hotfixes: ["px_scaling"]
                        });
                    } else {
                        outPdf.addPage([canvas.width, canvas.height], orientation);
                    }
                    outPdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
                    compressedPagesArr.push(imgData);
                    setProgress(10 + (i / totalPages * 85));
                }

                setCompressedPages(compressedPagesArr);

                const pdfOutput = outPdf.output('blob');
                setCompressedBlob(pdfOutput);
                setCompressedSize(pdfOutput.size);
                // We don't necessarily update compressedPages here because they are intermediate,
                // but for PNG download we need them. Let's collect them in runCompression.
            }
            setProgress(100);
            setIsSettingsDirty(false); // Mark as clean after compression
        } catch (err) {
            console.error('Compression error:', err);
            alert('Gagal mengompres file.');
        } finally {
            setTimeout(() => {
                setIsCompressing(false);
                setProgress(0);
            }, 500);
        }
    };

    const handleDownload = async (format = 'pdf') => {
        if (!compressedBlob && compressedPages.length === 0) return;
        setIsCompressing(true);

        try {
            if (format === 'pdf') {
                if (documentType === 'pdf') {
                    // Original was PDF, processed as PDF, just download the blob
                    const url = URL.createObjectURL(compressedBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${documentName.split('.')[0]} - compress by amanindata.qreatip.com.pdf`;
                    link.click();
                } else {
                    // Original was Image, convert to PDF
                    const { jsPDF } = await import('jspdf');
                    const img = new Image();
                    await new Promise(resolve => {
                        img.onload = resolve;
                        img.src = compressedPages[0];
                    });
                    const orientation = img.width > img.height ? 'landscape' : 'portrait';
                    const pdf = new jsPDF({
                        orientation,
                        unit: 'px',
                        format: [img.width, img.height],
                        hotfixes: ["px_scaling"]
                    });
                    pdf.addImage(compressedPages[0], 'JPEG', 0, 0, img.width, img.height);
                    pdf.save(`${documentName.split('.')[0]} - compress by amanindata.qreatip.com.pdf`);
                }
            } else {
                // Download as PNG/Images
                for (let i = 0; i < compressedPages.length; i++) {
                    const link = document.createElement('a');
                    link.download = `${documentName.split('.')[0]} - compress by amanindata.qreatip.com${compressedPages.length > 1 ? `-${i + 1}` : ''}.png`;
                    link.href = compressedPages[i];
                    link.click();
                    if (compressedPages.length > 1) await new Promise(r => setTimeout(r, 200));
                }
            }
        } catch (err) {
            console.error('Download error:', err);
            alert('Gagal mengunduh file.');
        } finally {
            setIsCompressing(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setDocumentName('');
        setDocumentType(null);
        setPreviews([]);
        setCompressedBlob(null);
        setCompressedSize(0);
        setCompressedPages([]);
        setAdvancedMode(false);
        setIsSettingsDirty(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Handler helpers to mark dirty
    const updatePreset = (preset) => {
        setQualityPreset(preset);
        setIsSettingsDirty(true);
    };

    const updateCustomSettings = (newSettings) => {
        setCustomSettings(newSettings);
        setIsSettingsDirty(true);
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>

                <div className={styles.header}>
                    <h1 className={styles.heroTitle}>🗜️ Kompres PDF & <span>Foto</span></h1>
                    <p>Kecilkan ukuran Foto atau PDF secara instan tanpa upload ke server.</p>

                </div>

                {!file ? (
                    <div
                        className={styles.uploadArea}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,application/pdf"
                            hidden
                        />
                        <div className={styles.uploadContent}>
                            <div className={styles.iconCircle}>
                                <Upload size={32} />
                            </div>
                            <h3>Pilih File</h3>
                            <p>Tarik file atau klik untuk memilih</p>
                            <div className={styles.supportedTypes}>
                                <span>JPG</span> <span>PNG</span> <span>PDF</span>
                            </div>
                            <span className={styles.safeTag}>🔒 100% Client-Side</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.workspace}>
                        {/* Sidebar */}
                        <div className={styles.sidebar}>
                            <div className={styles.card}>
                                <div className={styles.cardTabHeader}>
                                    <button
                                        className={`${styles.tabBtn} ${!advancedMode ? styles.active : ''}`}
                                        onClick={() => setAdvancedMode(false)}
                                    >
                                        Presets
                                    </button>
                                    <button
                                        className={`${styles.tabBtn} ${advancedMode ? styles.active : ''}`}
                                        onClick={() => setAdvancedMode(true)}
                                    >
                                        Advanced
                                    </button>
                                </div>

                                {!advancedMode ? (
                                    <div className={styles.presetSelection}>
                                        <button
                                            className={`${styles.presetBtn} ${qualityPreset === 'high' ? styles.active : ''}`}
                                            onClick={() => updatePreset('high')}
                                        >
                                            <div className={styles.presetTop}>
                                                <div className={styles.presetLabel}>High</div>
                                                <div className={styles.presetPercent}>80% Size</div>
                                            </div>
                                            <div className={styles.presetDesc}>Maksimum Kualitas</div>
                                        </button>
                                        <button
                                            className={`${styles.presetBtn} ${qualityPreset === 'medium' ? styles.active : ''}`}
                                            onClick={() => updatePreset('medium')}
                                        >
                                            <div className={styles.presetTop}>
                                                <div className={styles.presetLabel}>Medium</div>
                                                <div className={styles.presetPercent}>50% Size</div>
                                            </div>
                                            <div className={styles.presetDesc}>Seimbang & Cepat</div>
                                        </button>
                                        <button
                                            className={`${styles.presetBtn} ${qualityPreset === 'low' ? styles.active : ''}`}
                                            onClick={() => updatePreset('low')}
                                        >
                                            <div className={styles.presetTop}>
                                                <div className={styles.presetLabel}>Low</div>
                                                <div className={styles.presetPercent}>20% Size</div>
                                            </div>
                                            <div className={styles.presetDesc}>Ukuran Sangat Kecil</div>
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.advancedSettings}>
                                        <div className={styles.settingItem}>
                                            <label>Quality: {Math.round(customSettings.quality * 100)}%</label>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1"
                                                step="0.05"
                                                value={customSettings.quality}
                                                onChange={(e) => updateCustomSettings({ ...customSettings, quality: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div className={styles.settingItem}>
                                            <label>Max Width: {customSettings.maxWidth}px</label>
                                            <input
                                                type="range"
                                                min="500"
                                                max="4000"
                                                step="100"
                                                value={customSettings.maxWidth}
                                                onChange={(e) => updateCustomSettings({ ...customSettings, maxWidth: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className={styles.settingItem}>
                                            <label>Max Size: {customSettings.maxSizeMB} MB</label>
                                            <input
                                                type="range"
                                                min="0.01"
                                                max="5"
                                                step="0.05"
                                                value={customSettings.maxSizeMB}
                                                onChange={(e) => updateCustomSettings({ ...customSettings, maxSizeMB: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.card}>
                                <div className={styles.statsList}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Asli</span>
                                        <span className={styles.statValue}>{formatSize(originalSize)}</span>
                                    </div>
                                    {compressedSize > 0 && (
                                        <>
                                            <div className={styles.statItem}>
                                                <span className={styles.statLabel}>Hasil</span>
                                                <span className={`${styles.statValue} ${compressedSize < originalSize ? styles.successText : styles.warningText}`}>
                                                    {formatSize(compressedSize)}
                                                </span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statLabel}>Hemat</span>
                                                <span className={styles.saveBadge}>
                                                    -{Math.round((1 - compressedSize / originalSize) * 100)}%
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={`${styles.mainActionBtn} ${!isSettingsDirty && compressedBlob ? styles.disabledAction : ''}`}
                                    onClick={runCompression}
                                    disabled={isCompressing || (!isSettingsDirty && !!compressedBlob)}
                                    style={{ opacity: (!isSettingsDirty && !!compressedBlob) ? 0.5 : 1 }}
                                >
                                    {isCompressing ? `Memproses ${Math.round(progress)}%` : 'Kompres Sekarang'}
                                </button>

                                {compressedBlob && (
                                    <div className={`${styles.downloadGroup} ${styles.successGroup}`} style={{ marginTop: '10px' }}>
                                        <button
                                            className={styles.downloadBtnSplit}
                                            onClick={() => handleDownload(window.document.getElementById('compressFormat').value)}
                                            disabled={isCompressing}
                                        >
                                            <Download size={18} /> Simpan
                                        </button>
                                        <select
                                            id="compressFormat"
                                            className={styles.formatSelect}
                                            defaultValue={documentType === 'pdf' ? 'pdf' : 'png'}
                                        >
                                            <option value="pdf">PDF</option>
                                            <option value="png">PNG</option>
                                        </select>
                                    </div>
                                )}

                                <button className={styles.resetBtn} onClick={handleReset}>
                                    Ganti File
                                </button>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className={styles.previewContainer}>
                            <div className={styles.previewCard}>
                                <div className={styles.previewHeader}>
                                    <ImageIcon size={16} />
                                    <span>Preview ({documentType?.toUpperCase()})</span>
                                </div>
                                <div className={styles.viewer}>
                                    <div className={styles.previewList}>
                                        {previews.map((src, i) => (
                                            <div key={i} className={styles.previewItem}>
                                                <img src={src} alt="Preview" />
                                                {documentType === 'pdf' && <span className={styles.pageTag}>Halaman {i + 1}</span>}
                                            </div>
                                        ))}
                                        {documentType === 'pdf' && previews.length < 3 && (
                                            <div className={styles.previewMore}>+ Halaman lainnya...</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <TrustSection />

                {/* Cara Pakai / How To Use */}
                <GuideSection
                    linkHref="/guide#compress"
                />

                {/* Features Detail */}
                <section className={styles.featuresSection}>
                    <h2>Keunggulan Amanin Data</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureItem}>
                            <ShieldCheck className={styles.featureIcon} />
                            <h3>100% Privacy</h3>
                            <p>Semua proses terjadi di browser Anda secara lokal. File tidak dikirim ke internet.</p>
                        </div>
                        <div className={styles.featureItem}>
                            <Zap className={styles.featureIcon} />
                            <h3>Instan & Cepat</h3>
                            <p>Kompresi dokumen dalam hitungan detik tanpa perlu antrian server.</p>
                        </div>
                        <div className={styles.featureItem}>
                            <Layout className={styles.featureIcon} />
                            <h3>Multi Format</h3>
                            <p>Mendukung kompresi dokumen Gambar dan PDF untuk syarat pendaftaran Apapun untuk kegiatan anda. di sensor dengan sesuai dan sangat baik</p>
                        </div>
                    </div>
                </section>


            </div>
            <Footer />
        </>
    );
}
