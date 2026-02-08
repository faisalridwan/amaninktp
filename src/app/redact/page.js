'use client';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Download, Upload, ArrowRight, Eraser, MousePointer2, Square, EyeOff, RotateCcw, Image as ImageIcon } from 'lucide-react';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RedactionTool() {
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [mode, setMode] = useState('block'); // 'block' | 'blur' (future) | 'select'
    const [history, setHistory] = useState([]); // Array of {x, y, w, h, type}
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentRect, setCurrentRect] = useState(null);

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Load image onto canvas
    useEffect(() => {
        if (file && canvasRef.current && containerRef.current) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                setImage(img);
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                // Calculate aspect ratio fit
                const containerWidth = containerRef.current.clientWidth;
                const scale = Math.min(containerWidth / img.width, 1);

                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setHistory([]); // Reset history
            };
        }
    }, [file]);

    // Redraw canvas with history
    const redraw = () => {
        if (!canvasRef.current || !image) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear and draw text
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw history
        [...history, currentRect].forEach(rect => {
            if (!rect) return;
            ctx.fillStyle = 'black';
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        });
    };

    useEffect(() => {
        redraw();
    }, [history, currentRect]);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    };

    const handleMouseDown = (e) => {
        if (!image) return;
        setIsDrawing(true);
        setStartPos(getPos(e));
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !image) return;
        const currentPos = getPos(e);

        setCurrentRect({
            x: Math.min(startPos.x, currentPos.x),
            y: Math.min(startPos.y, currentPos.y),
            w: Math.abs(currentPos.x - startPos.x),
            h: Math.abs(currentPos.y - startPos.y),
            type: 'block'
        });
    };

    const handleMouseUp = () => {
        if (!isDrawing || !image) return;
        setIsDrawing(false);
        if (currentRect) {
            setHistory([...history, currentRect]);
            setCurrentRect(null);
        }
    };

    const handleUndo = () => {
        setHistory(history.slice(0, -1));
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `protected-${file.name}`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Head>
                    <title>Sensor Data Dokumen - AmaninKTP</title>
                    <meta name="description" content="Tutup data sensitif pada dokumen KTP/SIM dengan mudah dan aman." />
                </Head>

                <div className={styles.header}>
                    <h1>Sensor Data</h1>
                    <p>Tutupi data sensitif (NIK, Nama Ibu, dll) sebelum dibagikan.</p>
                </div>

                {!file ? (
                    <div
                        className={styles.uploadArea}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => setFile(e.target.files[0])}
                            accept="image/*"
                            hidden
                        />
                        <div className={styles.uploadContent}>
                            <div className={styles.iconCircle}>
                                <EyeOff size={32} />
                            </div>
                            <h3>Upload Dokumen</h3>
                            <p>Klik untuk memilih foto (JPG, PNG)</p>
                        </div>
                    </div>
                ) : (
                    <div className={styles.workspace}>
                        {/* Toolbar */}
                        <div className={styles.toolbar}>
                            <div className={styles.toolGroup}>
                                <button
                                    className={`${styles.toolBtn} ${mode === 'block' ? styles.active : ''}`}
                                    onClick={() => setMode('block')}
                                >
                                    <Square size={20} /> Block Hitam
                                </button>
                                {/* Future: Blur Tool */}
                            </div>

                            <div className={styles.actionGroup}>
                                <button className={styles.iconBtn} onClick={handleUndo} disabled={history.length === 0}>
                                    <RotateCcw size={20} /> Undo
                                </button>
                                <button className={styles.downloadBtn} onClick={handleDownload}>
                                    <Download size={20} /> Download
                                </button>
                            </div>
                        </div>

                        {/* Canvas Area */}
                        <div className={styles.canvasWrapper} ref={containerRef}>
                            <canvas
                                ref={canvasRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                className={styles.canvas}
                            />
                            {history.length === 0 && !isDrawing && (
                                <div className={styles.overlayHint}>
                                    <MousePointer2 size={24} />
                                    <p>Drag untuk membuat kotak sensor</p>
                                </div>
                            )}
                        </div>

                        <button className={styles.resetLink} onClick={() => setFile(null)}>
                            Ganti Gambar
                        </button>
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
