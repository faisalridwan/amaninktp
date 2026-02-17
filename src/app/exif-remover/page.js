'use client'

import { useState } from 'react'
import {
    Image as ImageIcon, Upload, Trash2, Download, FileImage, Shield
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function ExifRemoverPage() {
    const [file, setFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [processedUrl, setProcessedUrl] = useState(null)

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
            setFile(e.dataTransfer.files[0])
            setProcessedUrl(null)
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setProcessedUrl(null)
        }
    }

    const removeMetadata = async () => {
        if (!file) return
        setIsProcessing(true)

        try {
            const img = new Image()
            img.src = URL.createObjectURL(file)

            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)

            // Export to blob (metadata is lost in this process)
            // Default to jpeg if original is jpeg, else png to be safe (or keep original mime)
            // But to be sure EXIF is gone, re-encoding is key.
            const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob)
                    setProcessedUrl(url)

                    // Auto download
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `clean_${file.name}`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                }
                setIsProcessing(false)
            }, mimeType, 0.95) // High quality

        } catch (error) {
            console.error(error)
            alert('Gagal memproses gambar.')
            setIsProcessing(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        📷 Hapus Data <span>EXIF</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Hapus informasi lokasi (GPS), jenis kamera, dan tanggal dari foto Anda.
                        <br />Privasi Anda aman sebelum upload ke sosmed.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Processing
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
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <Upload size={48} className={styles.dropIcon} />
                                <h3 className={styles.dropText}>Klik atau Drag foto ke sini</h3>
                                <p className={styles.dropSubtext}>JPG, PNG, WebP</p>
                                <input type="file" id="file-upload" accept="image/*" onChange={handleFileSelect} hidden />
                            </div>
                        ) : (
                            <>
                                <div className={styles.fileInfo}>
                                    <div className={styles.fileName}>
                                        <FileImage size={24} color="var(--primary-dark)" />
                                        <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                    <button className={styles.removeBtn} onClick={() => { setFile(null); setProcessedUrl(null); }} title="Ganti Foto">
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <button
                                    className={styles.processBtn}
                                    onClick={removeMetadata}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Memproses...' : (
                                        <> <Download size={20} /> Hapus Metadata & Download </>
                                    )}
                                </button>

                                {processedUrl && (
                                    <div className={styles.successMessage}>
                                        <Shield size={20} />
                                        Foto berhasil dibersihkan dan diunduh!
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <TrustSection />
                <GuideSection toolId="exif-remover" />
            </main>
            <Footer />
        </>
    )
}
