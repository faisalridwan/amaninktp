'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function WatermarkPage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [watermarkText, setWatermarkText] = useState('UNTUK VERIFIKASI SAJA')
    const [fontSize, setFontSize] = useState(30)
    const [rotation, setRotation] = useState(-30)
    const [opacity, setOpacity] = useState(0.5)
    const [color, setColor] = useState('#FF0000')
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [isTiled, setIsTiled] = useState(true)

    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !uploadedImage) return

        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height)

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.font = `bold ${fontSize}px Poppins, sans-serif`
        ctx.fillStyle = color
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        const lines = watermarkText.split('\n')
        const lineHeight = fontSize * 1.3

        if (isTiled) {
            const spacing = fontSize * 4
            const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2)

            for (let x = -diagonal; x < diagonal * 2; x += spacing) {
                for (let y = -diagonal; y < diagonal * 2; y += spacing) {
                    ctx.save()
                    ctx.translate(x, y)
                    ctx.rotate((rotation * Math.PI) / 180)
                    lines.forEach((line, index) => {
                        const yOffset = index * lineHeight - ((lines.length - 1) * lineHeight) / 2
                        ctx.fillText(line, 0, yOffset)
                    })
                    ctx.restore()
                }
            }
        } else {
            ctx.translate(textPosition.x, textPosition.y)
            ctx.rotate((rotation * Math.PI) / 180)
            lines.forEach((line, index) => {
                const yOffset = index * lineHeight - ((lines.length - 1) * lineHeight) / 2
                ctx.fillText(line, 0, yOffset)
            })
        }

        ctx.restore()
    }, [uploadedImage, watermarkText, fontSize, rotation, opacity, color, textPosition, isTiled])

    useEffect(() => {
        draw()
    }, [draw])

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const img = new Image()
                img.onload = () => {
                    setUploadedImage(img)
                    const canvas = canvasRef.current
                    if (canvas) {
                        canvas.width = img.width
                        canvas.height = img.height
                        setTextPosition({ x: img.width / 2, y: img.height / 2 })
                    }
                }
                img.src = event.target?.result
            }
            reader.readAsDataURL(file)
        }
    }

    const getCanvasCoords = (e) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        }
    }

    const handleMouseDown = (e) => {
        if (!uploadedImage || isTiled) return
        e.preventDefault()
        const coords = getCanvasCoords(e)
        setIsDragging(true)
        setDragStart(coords)
    }

    const handleMouseMove = (e) => {
        if (!isDragging || isTiled) return
        e.preventDefault()
        const coords = getCanvasCoords(e)
        setTextPosition(prev => ({
            x: prev.x + (coords.x - dragStart.x),
            y: prev.y + (coords.y - dragStart.y)
        }))
        setDragStart(coords)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleDownload = () => {
        const canvas = canvasRef.current
        if (!canvas || !uploadedImage) return

        const link = document.createElement('a')
        link.download = `watermark-ktp-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const handleReset = () => {
        setUploadedImage(null)
        setWatermarkText('UNTUK VERIFIKASI SAJA')
        setFontSize(30)
        setRotation(-30)
        setOpacity(0.5)
        setColor('#FF0000')
        setIsTiled(true)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <div className={styles.pageHeader}>
                    <h1>🛡️ Watermark KTP</h1>
                    <p>Upload gambar KTP Anda, tambahkan teks watermark, dan unduh hasilnya. Semua proses dilakukan di browser Anda.</p>
                </div>

                <div className={`neu-card no-hover ${styles.workspace}`}>
                    <div className={styles.workspaceMain}>
                        <div
                            className={styles.canvasContainer}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleMouseDown}
                            onTouchMove={handleMouseMove}
                            onTouchEnd={handleMouseUp}
                        >
                            <canvas ref={canvasRef} style={{ display: uploadedImage ? 'block' : 'none' }} />
                            {!uploadedImage && (
                                <div className={styles.canvasPlaceholder}>
                                    <span className={styles.placeholderIcon}>🖼️</span>
                                    <p>Upload gambar KTP untuk memulai</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.workspaceSidebar}>
                        {/* Step 1: Upload */}
                        <div className={styles.step}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNumber}>1</span>
                                <span className={styles.stepTitle}>Upload Gambar</span>
                            </div>
                            <div
                                className={styles.fileInputWrapper}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className={styles.fileIcon}>📁</span>
                                <span className={styles.fileText}>
                                    {uploadedImage ? 'Klik untuk ganti gambar' : 'Pilih file gambar KTP'}
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                            </div>
                        </div>

                        {/* Step 2: Text */}
                        <div className={styles.step}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNumber}>2</span>
                                <span className={styles.stepTitle}>Teks Watermark</span>
                            </div>
                            <textarea
                                className="neu-input"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                placeholder="Contoh: UNTUK VERIFIKASI SHOPEE 2026"
                                rows={3}
                            />
                        </div>

                        {/* Step 3: Settings */}
                        <div className={styles.step}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNumber}>3</span>
                                <span className={styles.stepTitle}>Pengaturan</span>
                            </div>

                            <div className={styles.settingsGrid}>
                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}>
                                        Pola Tiled
                                        <input
                                            type="checkbox"
                                            checked={isTiled}
                                            onChange={(e) => setIsTiled(e.target.checked)}
                                            className={styles.checkbox}
                                        />
                                    </label>
                                </div>

                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}>
                                        Ukuran Font
                                        <span className={styles.controlValue}>{fontSize}px</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                    />
                                </div>

                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}>
                                        Rotasi
                                        <span className={styles.controlValue}>{rotation}°</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={rotation}
                                        onChange={(e) => setRotation(Number(e.target.value))}
                                    />
                                </div>

                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}>
                                        Transparansi
                                        <span className={styles.controlValue}>{Math.round(opacity * 100)}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={opacity}
                                        onChange={(e) => setOpacity(Number(e.target.value))}
                                    />
                                </div>

                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}>Warna Teks</label>
                                    <div className={styles.colorRow}>
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                        />
                                        <span className={styles.colorValue}>{color}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Download */}
                        <div className={styles.step}>
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNumber}>4</span>
                                <span className={styles.stepTitle}>Download</span>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button
                                    className="neu-btn primary"
                                    onClick={handleDownload}
                                    disabled={!uploadedImage}
                                >
                                    💾 Download Hasil
                                </button>
                                <button
                                    className="neu-btn"
                                    onClick={handleReset}
                                >
                                    🔄 Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
