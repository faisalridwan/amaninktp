
'use client'

import { useState, useRef } from 'react'
import { Upload, Download, Check, AlertCircle, Image as ImageIcon, Scissors, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'
import { removeBackground } from '@imgly/background-removal'

export default function RemoveBackgroundPage() {
    const [image, setImage] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0])
        }
    }

    const processFile = async (file) => {
        if (!file.type.match('image.*')) {
            setError('Mohon upload file gambar (JPG/PNG).')
            return
        }

        setError(null)
        setImage(URL.createObjectURL(file))
        setResultImage(null)
        setIsProcessing(true)

        try {
            // Remove background
            const blob = await removeBackground(file)
            const url = URL.createObjectURL(blob)
            setResultImage(url)
        } catch (err) {
            console.error(err)
            setError('Gagal memproses gambar. Silakan coba gambar lain.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!resultImage) return
        const link = document.createElement('a')
        link.href = resultImage
        link.download = 'amanindata-nobg.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const reset = () => {
        setImage(null)
        setResultImage(null)
        setError(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <>
            <Navbar />

            <main className={styles.container}>
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>✂️ Hapus <span>Background</span></h1>
                    <p className={styles.heroSubtitle}>Hapus latar belakang foto otomatis dengan AI. 100% Gratis & Client-Side.</p>
                </header>

                {!image ? (
                    <div
                        className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <div className={styles.iconCircle}>
                            <ImageIcon size={40} />
                        </div>
                        <div className={styles.uploadContent}>
                            <h3>Upload Foto</h3>
                            <p>Klik atau drag & drop foto di sini</p>
                            <div className={styles.supportedTypes} style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>JPG</span>
                                <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>PNG</span>
                                <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>WEBP</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.workspace}>
                        <div className={styles.resultCard}>
                            {error ? (
                                <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px' }}>
                                    <AlertCircle size={48} style={{ marginBottom: '10px' }} />
                                    <p>{error}</p>
                                    <button className={styles.btnSecondary} onClick={reset} style={{ marginTop: '20px' }}>Coba Lagi</button>
                                </div>
                            ) : isProcessing ? (
                                <div className={styles.loadingContainer}>
                                    <div className={styles.spinner}></div>
                                    <p>Sedang menghapus background...</p>
                                    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Proses pertama kali mungkin butuh waktu untuk download AI model (~10MB).</p>
                                </div>
                            ) : (
                                <>
                                    <img src={resultImage} alt="Result" className={styles.imagePreview} />
                                    <div className={styles.controls}>
                                        <button className={styles.btnSecondary} onClick={reset}>
                                            <RefreshCw size={18} /> Ganti Foto
                                        </button>
                                        <button className={styles.btnPrimary} onClick={handleDownload}>
                                            <Download size={18} /> Download PNG
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <TrustSection />
                <GuideSection linkHref="/guide#remove-background" />
            </main>
            <Footer />
        </>
    )
}
