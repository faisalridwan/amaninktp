'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function SignaturePage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
    const [penColor, setPenColor] = useState('#000000')
    const [lineWidth, setLineWidth] = useState(3)
    const [hasDrawn, setHasDrawn] = useState(false)

    const canvasRef = useRef(null)
    const containerRef = useRef(null)

    const colors = [
        { value: '#000000', label: 'Hitam' },
        { value: '#0000FF', label: 'Biru' },
        { value: '#FF0000', label: 'Merah' },
        { value: '#006400', label: 'Hijau' },
        { value: '#800080', label: 'Ungu' },
    ]

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const rect = container.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
    }, [])

    useEffect(() => {
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        return () => window.removeEventListener('resize', resizeCanvas)
    }, [resizeCanvas])

    const getCoords = (e) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        }
    }

    const startDrawing = (e) => {
        e.preventDefault()
        const coords = getCoords(e)
        setIsDrawing(true)
        setLastPos(coords)
    }

    const draw = (e) => {
        if (!isDrawing) return
        e.preventDefault()

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        const coords = getCoords(e)

        ctx.beginPath()
        ctx.moveTo(lastPos.x, lastPos.y)
        ctx.lineTo(coords.x, coords.y)
        ctx.strokeStyle = penColor
        ctx.lineWidth = lineWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

        setLastPos(coords)
        setHasDrawn(true)
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasDrawn(false)
    }

    const downloadSignature = () => {
        const canvas = canvasRef.current
        if (!canvas || !hasDrawn) {
            alert('Area tanda tangan masih kosong!')
            return
        }

        const link = document.createElement('a')
        link.download = `ttd-amaninktp-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <div className={styles.pageHeader}>
                    <h1>✍️ Tanda Tangan Online</h1>
                    <p>Buat tanda tangan digital transparan dengan mudah. Goreskan tanda tangan Anda di area bawah ini.</p>
                </div>

                <div className={`neu-card no-hover ${styles.workspace}`}>
                    {/* Canvas Area */}
                    <div
                        ref={containerRef}
                        className={styles.signatureContainer}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    >
                        <canvas ref={canvasRef} />
                        {!hasDrawn && (
                            <div className={styles.canvasHint}>
                                <p>Gambar tanda tangan Anda di sini</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className={styles.controls}>
                        {/* Color Selection */}
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>Warna Pena</label>
                            <div className={styles.colorOptions}>
                                {colors.map((c) => (
                                    <button
                                        key={c.value}
                                        className={`${styles.colorBtn} ${penColor === c.value ? styles.active : ''}`}
                                        style={{ backgroundColor: c.value }}
                                        onClick={() => setPenColor(c.value)}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Line Width */}
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>
                                Ketebalan
                                <span className={styles.controlValue}>{lineWidth}px</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={lineWidth}
                                onChange={(e) => setLineWidth(Number(e.target.value))}
                            />
                        </div>

                        {/* Buttons */}
                        <div className={styles.buttonGroup}>
                            <button className="neu-btn" onClick={clearCanvas}>
                                🗑️ Hapus
                            </button>
                            <button
                                className="neu-btn primary"
                                onClick={downloadSignature}
                                disabled={!hasDrawn}
                            >
                                💾 Download PNG
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.tips}>
                    <p>💡 <strong>Tip:</strong> Hasil tanda tangan akan memiliki background transparan (PNG), cocok untuk dokumen digital.</p>
                </div>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
