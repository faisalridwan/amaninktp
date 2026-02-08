'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import {
    Download,
    Upload,
    Image as ImageIcon,
    ArrowRight,
    RefreshCw,
    FileImage,
    Settings,
    Check,
    FileText,
    Zap,
    ShieldCheck,
    Gauge,
    X,
    ChevronRight,
    Layout
} from 'lucide-react';

import imageCompression from 'browser-image-compression';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    const [progress, setProgress] = useState(0);

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
            } else {
                // PDF Compression (Rerender -> Compress Images -> Package PDF)
                const { jsPDF } = await import('jspdf');
                const pdfjsLib = await loadPdfJs();
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                let outPdf = null;
                const totalPages = pdf.numPages;

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
                            format: [canvas.width, canvas.height]
                        });
                    } else {
                        outPdf.addPage([canvas.width, canvas.height], orientation);
                    }
                    outPdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
                    setProgress(10 + (i / totalPages * 85));
                }

                const pdfOutput = outPdf.output('blob');
                setCompressedBlob(pdfOutput);
                setCompressedSize(pdfOutput.size);
            }
            setProgress(100);
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

    const handleDownload = () => {
        if (!compressedBlob) return;
        const url = URL.createObjectURL(compressedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed-${documentName}`;
        link.click();
    };

    const handleReset = () => {
        setFile(null);
        setDocumentName('');
        setDocumentType(null);
        setPreviews([]);
        setCompressedBlob(null);
        setCompressedSize(0);
        setAdvancedMode(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Head>
                    <title>Kompres Foto & PDF - AmaninKTP</title>
                    <meta name="description" content="Kecilkan ukuran file KTP, dokumen, dan PDF secara offline dan aman." />
                </Head>

                <div className={styles.header}>
                    <h1>⚡ Kompres <span>File</span></h1>
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
                            <p>Tarik file atau klik untuk memilih (Gambar/PDF)</p>
                            <div className={styles.supportedTypes}>
                                <span>JPG</span> <span>PNG</span> <span>PDF</span>
                            </div>
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
                                            onClick={() => setQualityPreset('high')}
                                        >
                                            <div className={styles.presetTop}>
                                                <div className={styles.presetLabel}>High</div>
                                                <div className={styles.presetPercent}>80% Size</div>
                                            </div>
                                            <div className={styles.presetDesc}>Maksimum Kualitas</div>
                                        </button>
                                        <button
                                            className={`${styles.presetBtn} ${qualityPreset === 'medium' ? styles.active : ''}`}
                                            onClick={() => setQualityPreset('medium')}
                                        >
                                            <div className={styles.presetTop}>
                                                <div className={styles.presetLabel}>Medium</div>
                                                <div className={styles.presetPercent}>50% Size</div>
                                            </div>
                                            <div className={styles.presetDesc}>Seimbang & Cepat</div>
                                        </button>
                                        <button
                                            className={`${styles.presetBtn} ${qualityPreset === 'low' ? styles.active : ''}`}
                                            onClick={() => setQualityPreset('low')}
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
                                                onChange={(e) => setCustomSettings({ ...customSettings, quality: parseFloat(e.target.value) })}
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
                                                onChange={(e) => setCustomSettings({ ...customSettings, maxWidth: parseInt(e.target.value) })}
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
                                                onChange={(e) => setCustomSettings({ ...customSettings, maxSizeMB: parseFloat(e.target.value) })}
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
                                {!compressedBlob ? (
                                    <button
                                        className={styles.mainActionBtn}
                                        onClick={runCompression}
                                        disabled={isCompressing}
                                    >
                                        {isCompressing ? `Memproses ${Math.round(progress)}%` : 'Kompres Sekarang'}
                                    </button>
                                ) : (
                                    <button className={styles.downloadBtn} onClick={handleDownload}>
                                        <Download size={20} /> Download Hasil
                                    </button>
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

                {/* Features Detail */}
                <section className={styles.featuresSection}>
                    <h2>Keunggulan AmaninKTP</h2>
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
                            <p>Mendukung kompresi dokumen Gambar dan PDF untuk syarat pendaftaran CPNS/BUMN.</p>
                        </div>
                    </div>
                </section>

                <section className={styles.trust}>
                    <div className={styles.trustItem}>🔒 100% Client-Side</div>
                    <div className={styles.trustItem}>🚫 Tanpa Upload Server</div>
                    <div className={styles.trustItem}>🇮🇩 Karya Lokal</div>
                </section>
            </div>
            <Footer />
        </>
    );
}
