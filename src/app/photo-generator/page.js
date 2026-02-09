'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Download, Check, RefreshCw, Scissors, Image as ImageIcon, Camera } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'

export default function PhotoGeneratorPage() {
    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState('')
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(3 / 4) // Default 3x4
    const [bgColor, setBgColor] = useState('#ff0000') // Default Red

    // Canvas Refs
    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)

    // Crop State
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [cropRect, setCropRect] = useState(null) // { x, y, w, h } relative to image

    // Load Image
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFileName(file.name.replace(/\.[^/.]+$/, ''))
            const reader = new FileReader()
            reader.onload = (event) => {
                const img = new Image()
                img.onload = () => {
                    setImage(img)
                    // Initial center crop
                    const viewportRatio = aspect
                    const imageRatio = img.width / img.height
                    let w, h
                    if (imageRatio > viewportRatio) {
                        h = img.height
                        w = h * viewportRatio
                    } else {
                        w = img.width
                        h = w / viewportRatio
                    }
                    setCropRect({
                        x: (img.width - w) / 2,
                        y: (img.height - h) / 2,
                        w: w,
                        h: h
                    })
                }
                img.src = event.target.result
            }
            reader.readAsDataURL(file)
        }
    }

    // Update Crop Rect when aspect changes
    useEffect(() => {
        if (!image || !cropRect) return
        // Maintain center, update W/H based on new aspect
        // Try to keep height constant if possible, else width
        let h = cropRect.h
        let w = h * aspect

        if (w > image.width) {
            w = image.width
            h = w / aspect
        }
        if (h > image.height) {
            h = image.height
            w = h * aspect
        }

        // Sender
        const cx = cropRect.x + cropRect.w / 2
        const cy = cropRect.y + cropRect.h / 2

        setCropRect({
            x: Math.max(0, Math.min(image.width - w, cx - w / 2)),
            y: Math.max(0, Math.min(image.height - h, cy - h / 2)),
            w: w,
            h: h
        })
    }, [aspect])

    // Draw Canvas (Preview)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !image || !cropRect) return

        const ctx = canvas.getContext('2d')

        // We want to show the whole image, but darken the area outside crop
        // Display size
        const maxWidth = 500
        const scale = Math.min(1, maxWidth / image.width)

        canvas.width = image.width * scale
        canvas.height = image.height * scale

        ctx.scale(scale, scale)

        // Draw Bg Color (visible if transparent)
        ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
        ctx.fillRect(0, 0, image.width, image.height)

        // Draw Image
        ctx.drawImage(image, 0, 0)

        // Draw Overlay (Darken outside)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, image.width, cropRect.y) // Top
        ctx.fillRect(0, cropRect.y + cropRect.h, image.width, image.height - (cropRect.y + cropRect.h)) // Bottom
        ctx.fillRect(0, cropRect.y, cropRect.x, cropRect.h) // Left
        ctx.fillRect(cropRect.x + cropRect.w, cropRect.y, image.width - (cropRect.x + cropRect.w), cropRect.h) // Right

        // Draw Crop Border
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2 / scale
        ctx.setLineDash([10, 10])
        ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h)

        // Reset dash
        ctx.setLineDash([])
    }, [image, cropRect, bgColor])

    // Interaction Handlers (Simple Drag to Move)
    const handleMouseDown = (e) => {
        if (!cropRect) return
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        // Convert screen to canvas coords (scaled)
        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        // Convert to image coords
        const scale = image.width / canvas.width // Image / Canvas
        const imgX = x * scale
        const imgY = y * scale

        // Check if inside crop rect
        if (imgX >= cropRect.x && imgX <= cropRect.x + cropRect.w &&
            imgY >= cropRect.y && imgY <= cropRect.y + cropRect.h) {
            setIsDragging(true)
            setDragStart({ x: imgX, y: imgY })
        }
    }

    const handleMouseMove = (e) => {
        if (!isDragging || !cropRect) return
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        const scale = image.width / canvas.width
        const imgX = x * scale
        const imgY = y * scale

        const dx = imgX - dragStart.x
        const dy = imgY - dragStart.y

        let newX = cropRect.x + dx
        let newY = cropRect.y + dy

        // Constrain
        newX = Math.max(0, Math.min(image.width - cropRect.w, newX))
        newY = Math.max(0, Math.min(image.height - cropRect.h, newY))

        setCropRect(prev => ({ ...prev, x: newX, y: newY }))
        setDragStart({ x: imgX, y: imgY }) // Update drag start to avoid jitter
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Download
    const handleDownload = (sizeLabel) => {
        if (!image || !cropRect) return

        const canvas = document.createElement('canvas')
        const w = cropRect.w
        const h = cropRect.h

        // Set high resolution for print (e.g. 300 DPI approx)
        // 3x4 cm at 300 DPI is approx 354x472 pixels
        // Let's just use the source image resolution cropped
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')

        // Fill bg first
        if (bgColor !== 'transparent') {
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, w, h)
        }

        ctx.drawImage(image, cropRect.x, cropRect.y, w, h, 0, 0, w, h)

        const link = document.createElement('a')
        link.download = `${fileName || 'foto'}-${sizeLabel}-amanindata.jpg`
        link.href = canvas.toDataURL('image/jpeg', 0.95)
        link.click()
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>📸 Photo <span>Generator</span></h1>
                        <p className={styles.heroSubtitle}>Buat pas foto ukuran 2x3, 3x4, dan 4x6 secara instan. Crop presisi dan ganti background warna.</p>
                        <TrustSection />
                    </div>

                    {!image ? (
                        <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                            <div className={styles.iconCircle}>
                                <Camera size={40} />
                            </div>
                            <div className={styles.uploadContent}>
                                <h3>Upload Foto Anda</h3>
                                <p>Klik untuk memilih atau drag & drop foto di sini</p>
                                <div className={styles.supportedTypes}>
                                    <span>JPG</span>
                                    <span>PNG</span>
                                    <span>WEBP</span>
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
                        </div>
                    ) : (
                        <div className={styles.workspace}>
                            <div className={styles.previewSection}>
                                <div className={styles.canvasWrap}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    <canvas ref={canvasRef} style={{ maxWidth: '100%', cursor: isDragging ? 'grabbing' : 'grab' }} />
                                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                        💡 Geser kotak untuk mengatur posisi wajah
                                    </p>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
                            </div>

                            <div className={styles.controlsSection}>
                                {/* Size Selection */}
                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}><Scissors size={18} /> Pilih Ukuran</label>
                                    <div className={styles.ratioGrid}>
                                        <button
                                            className={`${styles.ratioBtn} ${aspect === 2 / 3 ? styles.active : ''}`}
                                            onClick={() => setAspect(2 / 3)}
                                        >2x3</button>
                                        <button
                                            className={`${styles.ratioBtn} ${aspect === 3 / 4 ? styles.active : ''}`}
                                            onClick={() => setAspect(3 / 4)}
                                        >3x4</button>
                                        <button
                                            className={`${styles.ratioBtn} ${aspect === 4 / 6 ? styles.active : ''}`}
                                            onClick={() => setAspect(4 / 6)}
                                        >4x6</button>
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}><RefreshCw size={18} /> Warna Background</label>
                                    <div className={styles.colorGrid}>
                                        <button
                                            className={`${styles.colorBtn} ${bgColor === '#ff0000' ? styles.active : ''}`}
                                            style={{ background: '#ff0000' }}
                                            onClick={() => setBgColor('#ff0000')}
                                            title="Merah (Tahun Ganjil)"
                                        />
                                        <button
                                            className={`${styles.colorBtn} ${bgColor === '#0000ff' ? styles.active : ''}`}
                                            style={{ background: '#0000ff' }}
                                            onClick={() => setBgColor('#0000ff')}
                                            title="Biru (Tahun Genap)"
                                        />
                                        <button
                                            className={`${styles.colorBtn} ${bgColor === '#ffffff' ? styles.active : ''}`}
                                            style={{ background: '#ffffff', border: '1px solid #ccc' }}
                                            onClick={() => setBgColor('#ffffff')}
                                            title="Putih"
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>
                                        *Warna background hanya efektif jika foto asli transparan.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className={styles.controlGroup} style={{ marginTop: 'auto' }}>
                                    <button className={styles.downloadBtn} onClick={() => handleDownload(`${aspect === 3 / 4 ? '3x4' : aspect === 2 / 3 ? '2x3' : '4x6'}`)}>
                                        <Download size={20} /> Download Pas Foto
                                    </button>
                                    <button
                                        className={styles.uploadBtn}
                                        onClick={() => { setImage(null); fileInputRef.current.value = '' }}
                                        style={{ marginTop: '1rem', width: '100%' }}
                                    >
                                        Upload Foto Lain
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cara Pakai / How To Use */}
                    <GuideSection
                        linkHref="/guide#photo-generator"
                    />
                </div>
            </main>
            <Footer />
        </>
    )
}
