'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Pipette, Upload, Copy, Check, MousePointer2, Palette, Shield, Trash2
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function ColorPickerPage() {
    const [image, setImage] = useState(null)
    const [color, setColor] = useState({ r: 255, g: 255, b: 255, a: 1 })
    const [hex, setHex] = useState('#FFFFFF')
    const [hsl, setHsl] = useState('hsl(0, 0%, 100%)')
    const [copied, setCopied] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    const canvasRef = useRef(null)
    const magnifierRef = useRef(null)
    const containerRef = useRef(null)

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
            loadImage(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            loadImage(e.target.files[0])
        }
    }

    const loadImage = (file) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            setImage(img)
            drawToCanvas(img)
        }
        img.src = url
    }

    const drawToCanvas = (img) => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!canvas || !ctx) return

        // Responsive resizing
        const containerWidth = containerRef.current.clientWidth - 40 // padding
        const scale = Math.min(1, containerWidth / img.width)

        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    // Effect to handle window resize
    useEffect(() => {
        if (image) {
            window.addEventListener('resize', () => drawToCanvas(image))
            return () => window.removeEventListener('resize', () => drawToCanvas(image))
        }
    }, [image])


    const pickColor = (e) => {
        if (!image) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { willReadFrequently: true })

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Ensure within bounds
        if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) return

        const pixel = ctx.getImageData(x, y, 1, 1).data
        const r = pixel[0]
        const g = pixel[1]
        const b = pixel[2]

        updateColor(r, g, b)
    }

    const updateColor = (r, g, b) => {
        setColor({ r, g, b, a: 1 })

        // HEX
        const toHex = (c) => {
            const hex = c.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }
        const hexVal = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
        setHex(hexVal)

        // HSL
        let r1 = r / 255
        let g1 = g / 255
        let b1 = b / 255
        let cmin = Math.min(r1, g1, b1),
            cmax = Math.max(r1, g1, b1),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0

        if (delta === 0) h = 0
        else if (cmax === r1) h = ((g1 - b1) / delta) % 6
        else if (cmax === g1) h = (b1 - r1) / delta + 2
        else h = (r1 - g1) / delta + 4
        h = Math.round(h * 60)
        if (h < 0) h += 360
        l = (cmax + cmin) / 2
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
        s = +(s * 100).toFixed(1)
        l = +(l * 100).toFixed(1)

        setHsl(`hsl(${h}, ${s}%, ${l}%)`)
    }

    const handleMouseMove = (e) => {
        if (!image) return
        pickColor(e)
    }

    const useEyeDropper = async () => {
        if (!window.EyeDropper) {
            alert('Browser Anda tidak mendukung EyeDropper API. Gunakan fitur klik pada gambar.')
            return
        }

        try {
            const eyeDropper = new EyeDropper()
            const result = await eyeDropper.open()
            // result.sRGBHex
            // Convert Hex back to RGB
            const hex = result.sRGBHex
            const r = parseInt(hex.slice(1, 3), 16)
            const g = parseInt(hex.slice(3, 5), 16)
            const b = parseInt(hex.slice(5, 7), 16)
            updateColor(r, g, b)
        } catch (e) {
            console.log('EyeDropper cancelled')
        }
    }

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        🎨 Color Picker <span>Advanced</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Ambil warna dari gambar atau layar dengan presisi.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Processing
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.grid}>
                        <div className={styles.canvasContainer} ref={containerRef}>
                            {!image ? (
                                <div
                                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <Upload size={48} className={styles.dropIcon} />
                                    <h3 className={styles.dropText}>Klik atau Drag gambar ke sini</h3>
                                    <p className={styles.dropSubtext}>JPG, PNG, WebP</p>
                                    <input type="file" id="file-upload" accept="image/*" onChange={handleFileSelect} hidden />
                                </div>
                            ) : (
                                <div className={styles.canvasWrapper} onMouseMove={handleMouseMove} onClick={pickColor}>
                                    <canvas ref={canvasRef} className={styles.canvas}></canvas>
                                    {/* Magnifier logic is complex to implement perfectly in React without lag, skipping for lightweight MVP.
                                        Cursor crosshair is sufficient along with real-time preview updating. */}
                                </div>
                            )}
                        </div>

                        <div className={styles.sidebar}>
                            <div className={styles.colorCard}>
                                <div
                                    className={styles.previewBox}
                                    style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                                ></div>

                                <div className={styles.colorValues}>
                                    <div className={styles.valueRow}>
                                        <div className={styles.valueLabel}>HEX</div>
                                        <div className={styles.valueText}>{hex}</div>
                                        <button className={styles.copyBtn} onClick={() => copyToClipboard(hex, 'hex')}>
                                            {copied === 'hex' ? <Check size={16} color="green" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <div className={styles.valueRow}>
                                        <div className={styles.valueLabel}>RGB</div>
                                        <div className={styles.valueText}>{color.r}, {color.g}, {color.b}</div>
                                        <button className={styles.copyBtn} onClick={() => copyToClipboard(`${color.r}, ${color.g}, ${color.b}`, 'rgb')}>
                                            {copied === 'rgb' ? <Check size={16} color="green" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <div className={styles.valueRow}>
                                        <div className={styles.valueLabel}>HSL</div>
                                        <div className={styles.valueText}>{hsl}</div>
                                        <button className={styles.copyBtn} onClick={() => copyToClipboard(hsl, 'hsl')}>
                                            {copied === 'hsl' ? <Check size={16} color="green" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button className={styles.resetBtn} onClick={useEyeDropper}>
                                    <Pipette size={18} /> Ambil dari Layar (EyeDropper)
                                </button>

                                {image && (
                                    <button className={styles.resetBtn} onClick={() => setImage(null)} style={{ marginTop: '10px', color: '#ef4444' }}>
                                        <Trash2 size={18} /> Ganti Gambar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <TrustSection />
                <GuideSection toolId="color-picker" />
            </main>
            <Footer />
        </>
    )
}
