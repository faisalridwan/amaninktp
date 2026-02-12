'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Layout, Smartphone, Monitor, Upload, Download, Palette, Layers,
    Maximize, Type, Image as ImageIcon, Check, X, Shield, Tablet, Laptop,
    Smartphone as PhoneIcon, ChevronDown, ChevronUp
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

// --- Device Definitions ---
// Dimensions based on real specs (approximate pixels)
const DEVICES = {
    iphone15: {
        id: 'iphone15',
        name: 'iPhone 15 Pro',
        type: 'phone',
        width: 1179,
        height: 2556,
        cornerRadius: 50,
        bezel: 12,
        frameColor: '#53504C', // Natural Titanium
        features: { dynamicIsland: true, sideButtons: true }
    },
    iphone14: {
        id: 'iphone14',
        name: 'iPhone 14',
        type: 'phone',
        width: 1170,
        height: 2532,
        cornerRadius: 40,
        bezel: 14,
        frameColor: '#1c1c1e',
        features: { notch: true, sideButtons: true }
    },
    pixel8: {
        id: 'pixel8',
        name: 'Pixel 8 Pro',
        type: 'phone',
        width: 1344,
        height: 2992,
        cornerRadius: 28,
        bezel: 10,
        frameColor: '#3c4043',
        features: { punchHole: true, sideButtons: true, squareCorners: true }
    },
    s24ultra: {
        id: 's24ultra',
        name: 'Galaxy S24 Ultra',
        type: 'phone',
        width: 1440,
        height: 3120,
        cornerRadius: 4, // Sharp corners
        bezel: 8,
        frameColor: '#2C2C2C',
        features: { punchHole: true, sideButtons: true }
    },
    ipad: {
        id: 'ipad',
        name: 'iPad Pro',
        type: 'tablet',
        width: 2048,
        height: 2732,
        cornerRadius: 24,
        bezel: 20,
        frameColor: '#282828',
        features: { cameraIndicator: true }
    },
    macbook: {
        id: 'macbook',
        name: 'MacBook Pro',
        type: 'laptop',
        width: 3024,
        height: 1964,
        cornerRadius: 16,
        bezel: 16, // Screen bezel
        frameColor: '#000000', // Screen border is black
        features: { notch: true, keyboardHint: true }
    },
    browser: {
        id: 'browser',
        name: 'Safari Browser',
        type: 'browser',
        // Dynamic stats
        aspectRatio: 16 / 9,
        cornerRadius: 12,
        bezel: 0,
        frameColor: '#1e1e1e', // Dark mode header
        features: { trafficLights: true }
    },
    simple: {
        id: 'simple',
        name: 'Simple Frame',
        type: 'simple',
        // Dynamic
        aspectRatio: null,
        cornerRadius: 12,
        bezel: 0,
        frameColor: 'transparent',
        features: {}
    }
}

export default function MockupGeneratorPage() {
    const [image, setImage] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState('iphone15')

    // Customization State
    const [bgColor, setBgColor] = useState('#f3f4f6')
    const [frameColor, setFrameColor] = useState('') // Overrides device default if set
    const [padding, setPadding] = useState(50)
    const [borderRadius, setBorderRadius] = useState(12) // For simple frame

    // Scale / Resolution
    const [scale, setScale] = useState(2) // 1x, 2x, 3x, 4x

    // Fit Mode: 'cover' (Crop to fill) or 'contain' (Fit whole image)
    const [fitMode, setFitMode] = useState('cover')

    // Shadow
    const [shadowBlur, setShadowBlur] = useState(40)
    const [shadowOpacity, setShadowOpacity] = useState(0.3)
    const [shadowOffsetY, setShadowOffsetY] = useState(20)

    const [isDragging, setIsDragging] = useState(false)
    const canvasRef = useRef(null)

    // Set initial frame color when device changes
    useEffect(() => {
        setFrameColor(DEVICES[selectedDevice].frameColor)
    }, [selectedDevice])

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
        }
        img.src = url
    }

    useEffect(() => {
        if (image) {
            drawMockup()
        }
    }, [image, selectedDevice, bgColor, padding, borderRadius, shadowBlur, shadowOpacity, shadowOffsetY, frameColor, scale, fitMode])

    const drawMockup = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!canvas || !ctx || !image) return

        const device = DEVICES[selectedDevice]
        // Use user selected scale. For retina devices like iPhone, 1x here means their logical resolution? 
        // Actually typical approach: Base dimensions are high res (e.g. 1179px width), so scale=1 is already high res.
        // User scale adds multiplier on top of that. 
        // Let's treat DEVICES dimensions as the "Base 1x" canvas units.
        const pixelRatio = scale

        // 1. Calculate Content Size & Canvas Size
        let screenW, screenH
        let frameW, frameH, screenX, screenY

        if (device.width && device.height) {
            // FIXED Dimensions (Phone/Tablet/Laptop)
            screenW = device.width * pixelRatio
            screenH = device.height * pixelRatio
        } else if (device.type === 'browser') {
            const BASE_WIDTH = 1920 // Full HD Base
            screenW = BASE_WIDTH * pixelRatio
            screenH = (BASE_WIDTH / device.aspectRatio) * pixelRatio
        } else {
            // Simple / Dynamic based on Image
            const BASE_WIDTH = 1200
            let contentW = image.width
            let contentH = image.height
            if (contentW > BASE_WIDTH) {
                contentH = contentH * (BASE_WIDTH / contentW)
                contentW = BASE_WIDTH
            }
            screenW = contentW * pixelRatio
            screenH = contentH * pixelRatio
        }

        // Calculate Frame Dimensions
        if (device.type === 'phone' || device.type === 'tablet') {
            frameW = screenW + (device.bezel * pixelRatio * 2)
            frameH = screenH + (device.bezel * pixelRatio * 2)
            screenX = device.bezel * pixelRatio
            screenY = device.bezel * pixelRatio
        } else if (device.type === 'laptop') {
            const topBezel = device.bezel * pixelRatio
            const sideBezel = device.bezel * pixelRatio
            const bottomBezel = device.bezel * 1.5 * pixelRatio

            frameW = screenW + (sideBezel * 2)
            frameH = screenH + topBezel + bottomBezel
            screenX = sideBezel
            screenY = topBezel
        } else if (device.type === 'browser') {
            const headerH = 40 * pixelRatio
            frameW = screenW
            frameH = screenH + headerH
            screenX = 0
            screenY = headerH
        } else { // simple
            frameW = screenW
            frameH = screenH
            screenX = 0
            screenY = 0
        }

        const viewPadding = parseInt(padding) * pixelRatio
        const totalW = frameW + (viewPadding * 2)
        const totalH = frameH + (viewPadding * 2)

        let baseH = 0
        if (device.type === 'laptop') {
            baseH = 16 * pixelRatio
        }

        canvas.width = totalW
        canvas.height = totalH + (baseH * 2)

        // 2. Background
        if (bgColor === 'transparent') {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        } else {
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // Translate to Frame Start
        ctx.translate(viewPadding, viewPadding)

        // 3. Draw Shadow
        const cornerRadius = device.cornerRadius * pixelRatio

        ctx.save()
        if (device.type !== 'simple' || shadowOpacity > 0) {
            ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`
            ctx.shadowBlur = parseInt(shadowBlur) * pixelRatio
            ctx.shadowOffsetY = parseInt(shadowOffsetY) * pixelRatio

            ctx.fillStyle = frameColor || device.frameColor
            roundRect(ctx, 0, 0, frameW, frameH, cornerRadius)
            ctx.fill()
        }
        ctx.restore()

        // 4. Draw Device Frame
        ctx.fillStyle = frameColor || device.frameColor
        if (device.type === 'laptop') {
            // Screen Body
            roundRect(ctx, 0, 0, frameW, frameH, cornerRadius)
            ctx.fill()

            // Base
            const baseDepth = 12 * pixelRatio
            const baseX = -20 * pixelRatio
            const baseWNew = frameW + (40 * pixelRatio)
            const hingeH = 10 * pixelRatio

            ctx.fillStyle = adjustColor(frameColor || device.frameColor, -20)

            ctx.beginPath()
            ctx.moveTo(0, frameH - hingeH)
            ctx.lineTo(frameW, frameH - hingeH)
            ctx.lineTo(baseX + baseWNew, frameH + baseDepth)
            ctx.lineTo(baseX, frameH + baseDepth)
            ctx.fill()

            ctx.fillStyle = adjustColor(frameColor || device.frameColor, -40)
            ctx.fillRect(baseX, frameH + baseDepth, baseWNew, 4 * pixelRatio)
            ctx.fillStyle = frameColor || device.frameColor

        } else {
            roundRect(ctx, 0, 0, frameW, frameH, cornerRadius)
            ctx.fill()
        }

        // 5. Side Buttons
        if (device.features.sideButtons) {
            // Simplified side buttons logic if needed
        }

        // 6. Draw Content (Screen)
        ctx.save()
        ctx.beginPath()

        if (device.type === 'browser') {
            const headerH = 40 * pixelRatio
            ctx.fillStyle = '#1e1e1e'
            roundRect(ctx, 0, 0, frameW, headerH, cornerRadius, true, false)
            ctx.fill()
            drawTrafficLights(ctx, 20 * pixelRatio, 20 * pixelRatio, pixelRatio)
            roundRect(ctx, 0, headerH, screenW, screenH, cornerRadius, false, true)
            ctx.clip()
        } else if (device.type === 'simple') {
            const r = parseInt(borderRadius) * pixelRatio
            roundRect(ctx, 0, 0, screenW, screenH, r)
            ctx.clip()
        } else {
            const innerRadius = Math.max(0, cornerRadius - (device.bezel * pixelRatio) + 2)
            roundRect(ctx, screenX, screenY, screenW, screenH, innerRadius)
            ctx.clip()
        }

        // Draw Image - Object Fit Logic
        // Destination Rect: screenX, screenY, screenW, screenH
        // Source Image: image.width, image.height

        let sX = 0, sY = 0, sW = image.width, sH = image.height

        if (fitMode === 'cover') {
            // Scale crop
            const scaleW = screenW / image.width
            const scaleH = screenH / image.height
            const scale = Math.max(scaleW, scaleH)

            const w = screenW / scale
            const h = screenH / scale

            sX = (image.width - w) / 2
            sY = (image.height - h) / 2
            sW = w
            sH = h

            ctx.drawImage(image, sX, sY, sW, sH, screenX, screenY, screenW, screenH)
        } else {
            // Contain
            // Fill background black for letterboxing
            ctx.fillStyle = '#000'
            ctx.fillRect(screenX, screenY, screenW, screenH)

            const scaleW = screenW / image.width
            const scaleH = screenH / image.height
            const scale = Math.min(scaleW, scaleH)

            const dW = image.width * scale
            const dH = image.height * scale
            const dX = screenX + (screenW - dW) / 2
            const dY = screenY + (screenH - dH) / 2

            ctx.drawImage(image, 0, 0, image.width, image.height, dX, dY, dW, dH)
        }

        ctx.restore()

        // 7. Post-Pro Features
        const cx = frameW / 2
        if (device.features.dynamicIsland) {
            drawDynamicIsland(ctx, cx, (device.bezel * pixelRatio) + (10 * pixelRatio), pixelRatio)
        } else if (device.features.notch) {
            drawNotch(ctx, cx, device.bezel * pixelRatio, pixelRatio)
        } else if (device.features.punchHole) {
            drawPunchHole(ctx, cx, (device.bezel * pixelRatio) + (15 * pixelRatio), pixelRatio)
        }

        // 8. Gloss
        if (device.type === 'phone' || device.type === 'tablet') {
            const grad = ctx.createLinearGradient(0, 0, frameW, frameH)
            grad.addColorStop(0, 'rgba(255,255,255,0.05)')
            grad.addColorStop(0.5, 'rgba(255,255,255,0)')
            grad.addColorStop(1, 'rgba(255,255,255,0.02)')
            ctx.fillStyle = grad
            ctx.beginPath()
            roundRect(ctx, 0, 0, frameW, frameH, cornerRadius)
            ctx.fill()
        }
    }

    // --- Helpers ---
    const roundRect = (ctx, x, y, w, h, r, top = true, bottom = true) => {
        if (r < 0) r = 0
        const tl = top ? r : 0
        const tr = top ? r : 0
        const br = bottom ? r : 0
        const bl = bottom ? r : 0

        ctx.beginPath()
        ctx.moveTo(x + tl, y)
        ctx.lineTo(x + w - tr, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
        ctx.lineTo(x + w, y + h - br)
        ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
        ctx.lineTo(x + bl, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
        ctx.lineTo(x, y + tl)
        ctx.quadraticCurveTo(x, y, x + tl, y)
        ctx.closePath()
    }

    const drawTrafficLights = (ctx, x, y, scale = 1) => {
        const colors = ['#ff5f56', '#ffbd2e', '#27c93f']
        const r = 6 * scale
        const gap = 20 * scale
        colors.forEach((c, i) => {
            ctx.beginPath()
            ctx.fillStyle = c
            ctx.arc(x + (i * gap), y, r, 0, Math.PI * 2)
            ctx.fill()
        })
    }

    const drawDynamicIsland = (ctx, x, y, scale = 1) => {
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.roundRect(x - (60 * scale), y, 120 * scale, 36 * scale, 18 * scale)
        ctx.fill()
    }

    const drawNotch = (ctx, x, y, scale = 1) => {
        ctx.fillStyle = '#000'
        ctx.beginPath()
        const w = 60 * scale
        const h = 25 * scale

        ctx.moveTo(x - w, 0)
        ctx.lineTo(x - (w - 10 * scale), y + h)
        ctx.lineTo(x + (w - 10 * scale), y + h)
        ctx.lineTo(x + w, 0)
        ctx.fill()
    }

    const drawPunchHole = (ctx, x, y, scale = 1) => {
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(x, y, 10 * scale, 0, Math.PI * 2)
        ctx.fill()
    }

    const adjustColor = (color, amount) => {
        // Simple Hex Darken/Lighten
        // For production, use utility lib.
        // Hacky implementation for "darker version":
        return color === '#53504C' ? '#3e3c39' : '#111'
    }

    const downloadMockup = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const link = document.createElement('a')
        link.download = `mockup-${selectedDevice}-${scale}x-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()
    }

    // Helper to get device icon
    const getDeviceIcon = (type) => {
        switch (type) {
            case 'phone': return <Smartphone size={20} />
            case 'tablet': return <Tablet size={20} />
            case 'laptop': return <Laptop size={20} />
            case 'browser': return <Monitor size={20} />
            default: return <Maximize size={20} />
        }
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        <Layers size={32} /> Device <span>Mockup</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Buat mockup profesional dengan frame iPhone, Android, Macbook, dan Browser.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Processing
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.grid}>
                        {/* Preview Area */}
                        <div className={styles.previewContainer}>
                            {!image ? (
                                <div
                                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    <Upload size={48} className={styles.dropIcon} />
                                    <h3 className={styles.dropText}>Klik atau Drag screenshot</h3>
                                    <p className={styles.dropSubtext}>JPG, PNG, WebP</p>
                                    <input type="file" id="image-upload" accept="image/*" onChange={handleFileSelect} hidden />
                                </div>
                            ) : (
                                <canvas ref={canvasRef} className={styles.previewCanvas} />
                            )}
                        </div>

                        {/* Controls Sidebar */}
                        <div className={styles.sidebar}>
                            <div className={styles.controlsCard}>

                                {/* 1. Visual Device Selector */}
                                <div className={styles.controlGroup}>
                                    <label className={styles.label}>Pilih Perangkat</label>
                                    <div className={styles.deviceGrid}>
                                        {Object.values(DEVICES).map(device => (
                                            <div
                                                key={device.id}
                                                className={`${styles.deviceCard} ${selectedDevice === device.id ? styles.deviceCardActive : ''}`}
                                                onClick={() => setSelectedDevice(device.id)}
                                                title={device.name}
                                            >
                                                <div className={styles.deviceIcon}>
                                                    {getDeviceIcon(device.type)}
                                                </div>
                                                <span className={styles.deviceName}>{device.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Layout Controls */}
                                <div className={styles.accordion}>
                                    <div className={styles.controlGroup}>
                                        <div className={styles.sliderHeader}>
                                            <span className={styles.sliderLabel}>Padding (Jarak)</span>
                                            <span className={styles.sliderValue}>{padding}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="200"
                                            value={padding}
                                            onChange={(e) => setPadding(e.target.value)}
                                            className={styles.slider}
                                        />
                                    </div>

                                    {(DEVICES[selectedDevice].width) && (
                                        <div className={styles.controlGroup}>
                                            <label className={styles.label}>Mode Gambar</label>
                                            <div className={styles.scaleButtons}>
                                                <button
                                                    className={`${styles.scaleBtn} ${fitMode === 'cover' ? styles.scaleBtnActive : ''}`}
                                                    onClick={() => setFitMode('cover')}
                                                >
                                                    Penuh (Crop)
                                                </button>
                                                <button
                                                    className={`${styles.scaleBtn} ${fitMode === 'contain' ? styles.scaleBtnActive : ''}`}
                                                    onClick={() => setFitMode('contain')}
                                                >
                                                    Fit (Utuh)
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedDevice === 'simple' && (
                                        <div className={styles.controlGroup}>
                                            <div className={styles.sliderHeader}>
                                                <span className={styles.sliderLabel}>Radius Sudut</span>
                                                <span className={styles.sliderValue}>{borderRadius}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0" max="100"
                                                value={borderRadius}
                                                onChange={(e) => setBorderRadius(e.target.value)}
                                                className={styles.slider}
                                            />
                                        </div>
                                    )}

                                    {/* 3. Style Controls */}
                                    <div className={styles.controlGroup}>
                                        <label className={styles.label}>Warna Frame</label>
                                        <div className={styles.colorRow}>
                                            <input
                                                type="color"
                                                value={frameColor || '#000000'}
                                                onChange={(e) => setFrameColor(e.target.value)}
                                                className={styles.colorInput}
                                            />
                                            <span className={styles.colorHex}>{frameColor || 'Default'}</span>
                                        </div>
                                    </div>

                                    <div className={styles.controlGroup}>
                                        <label className={styles.label}>Background</label>
                                        <div className={styles.colorGrid}>
                                            {['#f3f4f6', '#1e293b', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', 'transparent'].map(color => (
                                                <div
                                                    key={color}
                                                    className={`${styles.colorBtn} ${bgColor === color ? styles.colorBtnActive : ''}`}
                                                    style={{
                                                        backgroundColor: color === 'transparent' ? 'white' : color,
                                                        backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%)' : 'none',
                                                        backgroundSize: '10px 10px'
                                                    }}
                                                    onClick={() => setBgColor(color)}
                                                    title={color}
                                                />
                                            ))}
                                            <input
                                                type="color"
                                                value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className={styles.colorBtnInput}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.controlGroup}>
                                        <div className={styles.sliderHeader}>
                                            <span className={styles.sliderLabel}>Bayangan (Blur)</span>
                                            <span className={styles.sliderValue}>{shadowBlur}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={shadowBlur}
                                            onChange={(e) => setShadowBlur(e.target.value)}
                                            className={styles.slider}
                                        />
                                    </div>

                                    <div className={styles.controlGroup}>
                                        <div className={styles.sliderHeader}>
                                            <span className={styles.sliderLabel}>Opacity Bayangan</span>
                                            <span className={styles.sliderValue}>{Math.round(shadowOpacity * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="1" step="0.05"
                                            value={shadowOpacity}
                                            onChange={(e) => setShadowOpacity(e.target.value)}
                                            className={styles.slider}
                                        />
                                    </div>

                                    {/* 4. Export Settings */}
                                    <div className={styles.controlGroup}>
                                        <div className={styles.sliderHeader}>
                                            <span className={styles.sliderLabel}>Kualitas (Scale)</span>
                                            <span className={styles.sliderValue}>{scale}x</span>
                                        </div>
                                        <div className={styles.scaleButtons}>
                                            {[1, 2, 3, 4].map(s => (
                                                <button
                                                    key={s}
                                                    className={`${styles.scaleBtn} ${scale === s ? styles.scaleBtnActive : ''}`}
                                                    onClick={() => setScale(s)}
                                                >
                                                    {s}x
                                                </button>
                                            ))}
                                            <span className={styles.resolutionHint}>
                                                {(1200 * scale)}px wide
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={styles.actions}>
                                    <button
                                        className={styles.downloadBtn}
                                        onClick={downloadMockup}
                                        disabled={!image}
                                        style={{
                                            backgroundColor: frameColor && frameColor !== 'transparent' ? frameColor : 'var(--primary-dark)',
                                            color: 'white',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        <Download size={20} /> Download PNG
                                    </button>

                                    {image && (
                                        <button
                                            className={styles.resetBtn}
                                            onClick={() => setImage(null)}
                                        >
                                            Reset Gambar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <TrustSection />
                <GuideSection toolId="mockup-generator" />
            </main>
            <Footer />
        </>
    )
}
