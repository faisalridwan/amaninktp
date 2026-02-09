'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Download,
    Square,
    EyeOff,
    RotateCcw,
    Image as ImageIcon,
    ZoomIn,
    ZoomOut,
    X,
    Zap,
    Maximize,
    Layout,
    ShieldCheck
} from 'lucide-react';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GuideSection from '@/components/GuideSection';
import TrustSection from '@/components/TrustSection';

export default function RedactionTool() {
    const [file, setFile] = useState(null);
    const [documentPages, setDocumentPages] = useState([]); // Array of Image objects
    const [documentName, setDocumentName] = useState('');
    const [mode, setMode] = useState('block'); // 'block' | 'blur'
    const [redactions, setRedactions] = useState([]); // {pageIndex, x, y, w, h, type, color}
    const [blockColor, setBlockColor] = useState('#000000');
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentRect, setCurrentRect] = useState(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const pageCanvasRefs = useRef([]);
    const docScrollRef = useRef(null);
    const containerRef = useRef(null);

    // Load PDF.js from CDN (same as signature)
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

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFile(file);
        setDocumentName(file.name);
        setRedactions([]);
        setZoomLevel(1);
        setIsLoading(true);

        if (file.type === 'application/pdf') {
            try {
                const pdfjsLib = await loadPdfJs();
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                const pages = [];
                const scale = 2; // High quality render

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: ctx, viewport }).promise;

                    const img = new Image();
                    await new Promise((resolve) => {
                        img.onload = resolve;
                        img.src = canvas.toDataURL('image/png');
                    });
                    pages.push(img);
                }
                setDocumentPages(pages);
            } catch (err) {
                console.error('PDF error:', err);
                alert('Gagal membaca PDF. Pastikan file tidak corrupt.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Handle Image
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    setDocumentPages([img]);
                    setIsLoading(false);
                };
                img.src = ev.target?.result;
            };
            reader.readAsDataURL(file);
        }

        // Auto-scroll to workspace
        setTimeout(() => {
            const workspace = document.querySelector(`.${styles.workspace}`);
            if (workspace) workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // Rendering Logic
    useEffect(() => {
        if (documentPages.length === 0) return;

        let baseWidth = 800;
        if (docScrollRef.current) {
            baseWidth = docScrollRef.current.clientWidth - 40;
        }

        documentPages.forEach((pageImg, pageIndex) => {
            const canvas = pageCanvasRefs.current[pageIndex];
            if (!canvas) return;

            const containerWidth = baseWidth * zoomLevel;
            const aspectRatio = pageImg.height / pageImg.width;
            const displayWidth = containerWidth;
            const displayHeight = containerWidth * aspectRatio;

            // Sync internal resolution with image resolution if needed
            // But we already rendered PDF at scale 2, let's keep it clean
            if (canvas.width !== pageImg.width || canvas.height !== pageImg.height) {
                canvas.width = pageImg.width;
                canvas.height = pageImg.height;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // 1. Draw base image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(pageImg, 0, 0);

            // 2. Draw historical redactions
            const pageRedactions = redactions.filter(r => r.pageIndex === pageIndex);

            // Current drawing rect (preview)
            const allToDraw = isDrawing && currentRect && currentRect.pageIndex === pageIndex
                ? [...pageRedactions, currentRect]
                : pageRedactions;

            allToDraw.forEach(rect => {
                if (rect.type === 'block') {
                    ctx.fillStyle = rect.color || 'black';
                    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
                } else if (rect.type === 'blur') {
                    // Optimized Blur: Use filter
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(rect.x, rect.y, rect.w, rect.h);
                    ctx.clip();
                    ctx.filter = 'blur(15px)';
                    ctx.drawImage(pageImg, 0, 0);
                    ctx.restore();
                    ctx.filter = 'none'; // reset
                }
            });

            // Update style display
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
        });
    }, [documentPages, zoomLevel, redactions, isDrawing, currentRect]);

    const getPos = (e, pageIndex) => {
        const canvas = pageCanvasRefs.current[pageIndex];
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        // Map client coordinates to canvas internal resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e, pageIndex) => {
        setIsDrawing(true);
        setActivePageIndex(pageIndex);
        const pos = getPos(e, pageIndex);
        setStartPos(pos);
    };

    const handleMouseMove = (e, pageIndex) => {
        if (!isDrawing) return;
        const currentPos = getPos(e, pageIndex);

        setCurrentRect({
            pageIndex,
            x: Math.min(startPos.x, currentPos.x),
            y: Math.min(startPos.y, currentPos.y),
            w: Math.abs(currentPos.x - startPos.x),
            h: Math.abs(currentPos.y - startPos.y),
            type: mode,
            color: mode === 'block' ? blockColor : null
        });
    };

    const handleMouseUp = () => {
        if (isDrawing && currentRect) {
            setRedactions([...redactions, currentRect]);
            setCurrentRect(null);
        }
        setIsDrawing(false);
    };

    const handleUndo = () => {
        setRedactions(redactions.slice(0, -1));
    };

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));

    const handleDownload = async (format = 'pdf') => {
        if (documentPages.length === 0) return;
        setIsLoading(true);

        try {
            if (format === 'pdf') {
                const { jsPDF } = await import('jspdf');
                let pdf = null;

                for (let i = 0; i < documentPages.length; i++) {
                    const canvas = pageCanvasRefs.current[i];
                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';

                    if (i === 0) {
                        pdf = new jsPDF({
                            orientation,
                            unit: 'px',
                            format: [canvas.width, canvas.height],
                            hotfixes: ["px_scaling"]
                        });
                    } else {
                        pdf.addPage([canvas.width, canvas.height], orientation);
                    }
                    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
                }
                pdf.save(`sensor-${documentName.split('.')[0]}.pdf`);
            } else {
                // Download as PNG
                // If single page, download normally. If multi-page, download as ZIP or just the current/all?
                // User said "variasi menjadi pdf atau png". For now let's download all as individual files if PNG.
                for (let i = 0; i < documentPages.length; i++) {
                    const canvas = pageCanvasRefs.current[i];
                    const link = document.createElement('a');
                    link.download = `sensor-${documentName.split('.')[0]}-page${i + 1}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    // Small delay to avoid browser blocking multiple downloads
                    if (documentPages.length > 1) await new Promise(r => setTimeout(r, 200));
                }
            }
        } catch (err) {
            console.error('Download error:', err);
            alert('Gagal mengunduh file.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setDocumentPages([]);
        setRedactions([]);
        setDocumentName('');
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>

                <div className={styles.header}>
                    <h1>🙈 Sensor <span>Data</span></h1>
                    <p>Tutupi data sensitif (NIK, Nama, Foto) dengan Black-out atau Blur.</p>

                </div>

                {!file ? (
                    <div
                        className={styles.uploadArea}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*,application/pdf"
                            hidden
                        />
                        <div className={styles.uploadContent}>
                            <div className={styles.iconCircle}>
                                <EyeOff size={32} />
                            </div>
                            <h3>Upload Dokumen</h3>
                            <p>Tarik file atau klik untuk memilih (Gambar/PDF)</p>
                            <div className={styles.supportedTypes}>
                                <span>JPG</span> <span>PNG</span> <span>PDF</span>
                            </div>
                            <span className={styles.safeTag}>🔒 100% Client-Side</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.workspace}>
                        {/* Control Panel */}
                        <div className={styles.controlPanel}>
                            <div className={styles.toolGroup}>
                                <button
                                    className={`${styles.toolBtn} ${mode === 'block' ? styles.active : ''}`}
                                    onClick={() => setMode('block')}
                                    title="Block Hitam"
                                >
                                    <Square size={20} />
                                    <span>Block</span>
                                </button>
                                <button
                                    className={`${styles.toolBtn} ${mode === 'blur' ? styles.active : ''}`}
                                    onClick={() => setMode('blur')}
                                    title="Blur"
                                >
                                    <Maximize size={20} className={styles.blurIcon} />
                                    <span>Blur</span>
                                </button>
                            </div>

                            {mode === 'block' && (
                                <>
                                    <div className={styles.divider} />
                                    <div className={styles.colorGroup}>
                                        {['#000000', '#FFFFFF', '#EF4444', '#22C55E', '#3B82F6'].map(color => (
                                            <div
                                                key={color}
                                                className={`${styles.colorSwatch} ${blockColor === color ? styles.active : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setBlockColor(color)}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={blockColor}
                                            onChange={(e) => setBlockColor(e.target.value)}
                                            className={styles.customColorInput}
                                            title="Custom Color"
                                        />
                                    </div>
                                </>
                            )}

                            <div className={styles.divider} />

                            <div className={styles.zoomGroup}>
                                <button onClick={handleZoomOut} className={styles.iconBtn} title="Zoom Out">
                                    <ZoomOut size={20} />
                                </button>
                                <span className={styles.zoomValue}>{Math.round(zoomLevel * 100)}%</span>
                                <button onClick={handleZoomIn} className={styles.iconBtn} title="Zoom In">
                                    <ZoomIn size={20} />
                                </button>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.actionGroup}>
                                <button
                                    className={styles.iconBtn}
                                    onClick={handleUndo}
                                    disabled={redactions.length === 0}
                                    title="Undo"
                                >
                                    <RotateCcw size={20} />
                                </button>

                                <div className={styles.downloadGroup}>
                                    <button
                                        className={styles.downloadBtnSplit}
                                        onClick={() => handleDownload(window.document.getElementById('redactFormat').value)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? '...' : <><Download size={18} /> Simpan</>}
                                    </button>
                                    <select
                                        id="redactFormat"
                                        className={styles.formatSelect}
                                        defaultValue="pdf"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="png">PNG</option>
                                    </select>
                                </div>

                                <button className={styles.resetBtn} onClick={handleReset} title="Mulai Ulang">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Document Viewer */}
                        <div className={styles.viewerContainer} ref={docScrollRef}>
                            {isLoading && documentPages.length === 0 ? (
                                <div className={styles.loadingOverlay}>Memproses Dokumen...</div>
                            ) : (
                                <div className={styles.pagesList}>
                                    {documentPages.map((page, index) => (
                                        <div key={index} className={styles.pageWrapper}>
                                            <div className={styles.pageLabel}>Halaman {index + 1}</div>
                                            <div className={styles.canvasContainer}>
                                                <canvas
                                                    ref={el => pageCanvasRefs.current[index] = el}
                                                    onMouseDown={(e) => handleMouseDown(e, index)}
                                                    onMouseMove={(e) => handleMouseMove(e, index)}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseLeave={handleMouseUp}
                                                    className={styles.pageCanvas}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <TrustSection />

                {/* Cara Pakai / How To Use */}
                <GuideSection
                    linkHref="/guide#redact"
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
