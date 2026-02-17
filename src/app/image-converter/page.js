'use client'

import { useState, useRef } from 'react'
import {
    Image as ImageIcon, Upload, Download, X, Settings, RefreshCw, FileImage
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function ImageConverterPage() {
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [format, setFormat] = useState('image/jpeg')
    const [quality, setQuality] = useState(0.8)
    const [isConverting, setIsConverting] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const canvasRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0])
        }
    }

    const processFile = (selectedFile) => {
        setFile(selectedFile)
        setPreviewUrl(URL.createObjectURL(selectedFile))
    }

    const convertImage = async () => {
        if (!file) return
        setIsConverting(true)

        try {
            let imageSource = file

            // Handle HEIC
            if (file.name.toLowerCase().endsWith('.heic')) {
                const heic2any = (await import('heic2any')).default
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: 'image/jpeg', // Intermediate conversion
                    quality: 1
                })
                imageSource = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
            }

            // Create Image Bitmap
            const img = new Image()
            img.src = URL.createObjectURL(imageSource)

            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            // Draw to Canvas
            const canvas = canvasRef.current
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)

            // Convert to Target Format
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    // Determine extension
                    let ext = 'jpg'
                    if (format === 'image/png') ext = 'png'
                    if (format === 'image/webp') ext = 'webp'

                    a.download = `converted-amanin-${Date.now()}.${ext}`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                }
                setIsConverting(false)
            }, format, parseFloat(quality))

        } catch (error) {
            console.error(error)
            alert('Gagal mengonversi gambar. Pastikan format didukung.')
            setIsConverting(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                         🖼️ Image <span>Converter</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Ubah format gambar (HEIC, WebP, PNG, JPG) dengan mudah & cepat.
                    </p>
                    <div className={styles.trustBadge}>
                        <FileImage size={16} /> 100% Client-Side Processing
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>
                        {!file ? (
                            <div
                                className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('image-upload').click()}
                            >
                                <Upload size={48} className={styles.dropIcon} />
                                <h3 className={styles.dropText}>Klik atau Drag gambar ke sini</h3>
                                <p className={styles.dropSubtext}>JPG, PNG, WebP, HEIC (iPhone)</p>
                                <input type="file" id="image-upload" accept="image/*,.heic" onChange={handleFileSelect} hidden />
                            </div>
                        ) : (
                            <div className={styles.previewContainer}>
                                <div className={styles.imageCard}>
                                    <img src={previewUrl} alt="Preview" className={styles.imagePreview} style={{ height: '300px', objectFit: 'contain' }} />
                                    <button className={styles.removeBtn} onClick={() => { setFile(null); setPreviewUrl(null); }}>
                                        <X size={16} />
                                    </button>
                                    <div className={styles.imageInfo}>
                                        <span>{file.name}</span>
                                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.controls}>
                            <div className={styles.controlGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Format Tujuan</label>
                                    <select
                                        className={styles.select}
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                    >
                                        <option value="image/jpeg">JPG / JPEG</option>
                                        <option value="image/png">PNG (Transparan)</option>
                                        <option value="image/webp">WebP (Modern)</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Kualitas: {Math.round(quality * 100)}%</label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={quality}
                                        onChange={(e) => setQuality(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <button
                                    className={styles.convertBtn}
                                    onClick={convertImage}
                                    disabled={!file || isConverting}
                                >
                                    {isConverting ? (
                                        <>Memproses... <RefreshCw className="spin" size={20} /></>
                                    ) : (
                                        <> <Download size={20} /> Convert & Download</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                <TrustSection />
                <GuideSection toolId="image-converter" />
            </main>
            <Footer />
        </>
    )
}
