'use client';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Upload, Image as ImageIcon, ArrowRight, RefreshCw, FileImage, Settings, Check } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ImageCompressor() {
    const [file, setFile] = useState(null);
    const [previewOriginal, setPreviewOriginal] = useState(null);
    const [previewCompressed, setPreviewCompressed] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [targetSize, setTargetSize] = useState(0.5); // MB
    const [quality, setQuality] = useState(0.8);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);

    const fileInputRef = useRef(null);

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Only process images
        if (!selectedFile.type.startsWith('image/')) {
            alert('Mohon upload file gambar (JPG/PNG)');
            return;
        }

        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setPreviewOriginal(URL.createObjectURL(selectedFile));

        // Initial compression
        await compressImage(selectedFile);
    };

    const compressImage = async (imageFile) => {
        if (!imageFile) return;

        setIsCompressing(true);

        const options = {
            maxSizeMB: targetSize,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: quality,
        };

        try {
            const compressed = await imageCompression(imageFile, options);
            setCompressedFile(compressed);
            setCompressedSize(compressed.size);
            setPreviewCompressed(URL.createObjectURL(compressed));
        } catch (error) {
            console.error('Compression error:', error);
            alert('Gagal mengompres gambar.');
        } finally {
            setIsCompressing(false);
        }
    };

    // Re-compress when settings change
    useEffect(() => {
        if (file) {
            const timer = setTimeout(() => {
                compressImage(file);
            }, 500); // Debounce
            return () => clearTimeout(timer);
        }
    }, [targetSize, quality]);

    const handleDownload = () => {
        if (!compressedFile) return;
        const url = URL.createObjectURL(compressedFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed-${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setFile(null);
        setPreviewOriginal(null);
        setPreviewCompressed(null);
        setCompressedFile(null);
        setOriginalSize(0);
        setCompressedSize(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Head>
                    <title>Kompres Foto Online - AmaninKTP</title>
                    <meta name="description" content="Kecilkan ukuran foto KTP dan dokumen secara online, cepat, dan aman tanpa upload ke server." />
                </Head>

                <div className={styles.header}>
                    <h1>Kompres Foto</h1>
                    <p>Kecilkan ukuran dokumen untuk syarat upload CPNS/BUMN.</p>
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
                            accept="image/*"
                            hidden
                        />
                        <div className={styles.uploadContent}>
                            <div className={styles.iconCircle}>
                                <Upload size={32} />
                            </div>
                            <h3>Upload Gambar</h3>
                            <p>Klik untuk memilih foto (JPG, PNG)</p>
                        </div>
                    </div>
                ) : (
                    <div className={styles.workspace}>
                        {/* Controls Sidebar */}
                        <div className={styles.sidebar}>
                            <div className={styles.controlGroup}>
                                <div className={styles.groupHeader}>
                                    <Settings size={18} />
                                    <span>Pengaturan Kompresi</span>
                                </div>

                                <div className={styles.controlItem}>
                                    <label>Target Ukuran (MB)</label>
                                    <div className={styles.sliderContainer}>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="2"
                                            step="0.1"
                                            value={targetSize}
                                            onChange={(e) => setTargetSize(parseFloat(e.target.value))}
                                            className={styles.slider}
                                        />
                                        <span className={styles.valueDisplay}>{targetSize} MB</span>
                                    </div>
                                    <p className={styles.hint}>Usahakan di bawah 0.5 MB untuk dokumen resmi.</p>
                                </div>

                                <div className={styles.controlItem}>
                                    <label>Kualitas Gambar</label>
                                    <div className={styles.sliderContainer}>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.1"
                                            value={quality}
                                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                                            className={styles.slider}
                                        />
                                        <span className={styles.valueDisplay}>{Math.round(quality * 100)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.statsCard}>
                                <div className={styles.statRow}>
                                    <span>Asli:</span>
                                    <strong>{formatSize(originalSize)}</strong>
                                </div>
                                <div className={styles.statRow}>
                                    <span>Hasil:</span>
                                    <strong className={styles.successText}>
                                        {isCompressing ? '...' : formatSize(compressedSize)}
                                    </strong>
                                </div>
                                <div className={styles.statRow}>
                                    <span>Hemat:</span>
                                    <span className={styles.saveText}>
                                        {isCompressing ? '...' : Math.round((1 - compressedSize / originalSize) * 100) + '%'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.downloadBtn}
                                    onClick={handleDownload}
                                    disabled={isCompressing || !compressedFile}
                                >
                                    {isCompressing ? (
                                        <RefreshCw className="animate-spin" size={20} />
                                    ) : (
                                        <Download size={20} />
                                    )}
                                    Download Hasil
                                </button>
                                <button className={styles.resetBtn} onClick={handleReset}>
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className={styles.previewArea}>
                            <div className={styles.previewCard}>
                                <div className={styles.previewHeader}>
                                    <FileImage size={16} /> Preview Hasil
                                </div>
                                <div className={styles.imageWrapper}>
                                    {previewCompressed ? (
                                        <img src={previewCompressed} alt="Compressed" />
                                    ) : (
                                        <div className={styles.loadingPreview}>
                                            <RefreshCw className="animate-spin" /> Memproses...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trust Section */}
                <section className={styles.trust}>
                    <div className={styles.trustItem}>🔒 100% Client-Side</div>
                    <div className={styles.trustItem}>🚫 Tanpa Upload Server</div>
                    <div className={styles.trustItem}>⚡ Tanpa Login</div>
                    <div className={styles.trustItem}>🇮🇩 Karya Lokal</div>
                </section>
            </div>
            <Footer />
        </>
    );
}
