'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Layout, Smartphone, Monitor, Upload, Download, Palette, Layers,
    Maximize, Type, ImageIcon, Check, X, Shield, Tablet, Laptop,
    Smartphone as PhoneIcon, ChevronDown, ChevronUp, GripHorizontal
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'
import PhoneMockup from '@/components/mockups/PhoneMockup'
import AndroidMockup from '@/components/mockups/AndroidMockup'
import TabletMockup from '@/components/mockups/TabletMockup'
import DesktopMockup from '@/components/mockups/DesktopMockup'
import LaptopMockup from '@/components/mockups/LaptopMockup'
import BrowserMockup from '@/components/mockups/BrowserMockup'
import * as htmlToImage from 'html-to-image'

// --- Device Definitions ---
const DEVICES = {
    // --- Phones ---
    iphone15: {
        id: 'iphone15',
        name: 'iPhone 15 Pro',
        type: 'phone',
        category: 'phone',
        color: 'titanium'
    },
    iphone14: {
        id: 'iphone14',
        name: 'iPhone 14',
        type: 'phone',
        category: 'phone',
        color: 'black'
    },
    pixel8: {
        id: 'pixel8',
        name: 'Pixel 8 Pro',
        type: 'android',
        category: 'phone',
        deviceType: 'pixel8',
        frameColor: '#3c4043'
    },
    s24ultra: {
        id: 's24ultra',
        name: 'Galaxy S24 Ultra',
        type: 'android',
        category: 'phone',
        deviceType: 's24ultra',
        frameColor: '#2C2C2C'
    },
    // --- Tablets ---
    ipadPro: {
        id: 'ipadPro',
        name: 'iPad Pro 11"',
        type: 'tablet',
        category: 'tablet',
        frameColor: '#282828'
    },
    // --- Computers ---
    macbook: {
        id: 'macbook',
        name: 'MacBook Pro 16"',
        type: 'laptop',
        category: 'desktop',
        color: 'space-gray'
    },
    winLaptop: {
        id: 'winLaptop',
        name: 'Windows Laptop',
        type: 'desktop-laptop',
        category: 'desktop',
    },
    imac: {
        id: 'imac',
        name: 'iMac 24"',
        type: 'desktop-iMac',
        category: 'desktop',
        deviceType: 'imac'
    },
    browser: {
        id: 'browser',
        name: 'Safari Browser',
        type: 'browser',
        category: 'desktop'
    }
}

const CATEGORIES = [
    { id: 'phone', label: 'Smartphones', icon: Smartphone },
    { id: 'tablet', label: 'Tablets', icon: Tablet },
    { id: 'desktop', label: 'Computers', icon: Monitor },
]

export default function MockupGeneratorPage() {
    const [image, setImage] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState('iphone15')
    const [selectedCategory, setSelectedCategory] = useState('phone')

    // Customization State
    const [bgColor, setBgColor] = useState('#f3f4f6')
    const [frameColor, setFrameColor] = useState('#1c1c1e')
    const [padding, setPadding] = useState(50)

    // Scale for Export (Quality)
    const [scale, setScale] = useState(2)

    // Fit Mode: 'cover' (Crop to fill) or 'contain' (Fit whole image)
    const [fitMode, setFitMode] = useState('cover')

    // Image Positioning & Scaling
    const [imageScale, setImageScale] = useState(1) // Zoom inside frame
    const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })
    const [isPanning, setIsPanning] = useState(false)
    const [startPan, setStartPan] = useState({ x: 0, y: 0 })

    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef(null)

    // Reset panning/zooming when image or device changes
    useEffect(() => {
        setImageScale(1)
        setImageOffset({ x: 0, y: 0 })
    }, [image, selectedDevice, fitMode])

    // Update selected category if device changes externally (fallback)
    useEffect(() => {
        const device = DEVICES[selectedDevice]
        if (device && device.category !== selectedCategory) {
            setSelectedCategory(device.category)
        }
    }, [selectedDevice])

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0])
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) loadImage(e.target.files[0])
    }

    const loadImage = (file) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => setImage(img)
        img.src = url
    }

    // --- Panning Handlers ---
    const handleMouseDown = (e) => {
        if (!image) return
        setIsPanning(true)
        setStartPan({ x: e.clientX, y: e.clientY })
    }

    const handleMouseMove = (e) => {
        if (!isPanning) return
        const dx = e.clientX - startPan.x
        const dy = e.clientY - startPan.y
        setStartPan({ x: e.clientX, y: e.clientY })

        setImageOffset(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
        }))
    }

    const handleMouseUp = () => setIsPanning(false)

    // Download action
    const downloadMockup = async () => {
        if (!containerRef.current) return

        try {
            // Force higher resolution
            const dataUrl = await htmlToImage.toPng(containerRef.current, {
                pixelRatio: scale,
                backgroundColor: bgColor === 'transparent' ? null : bgColor,
            })
            const link = document.createElement('a')
            link.download = `mockup-${selectedDevice}-${Date.now()}.png`
            link.href = dataUrl
            link.click()
        } catch (error) {
            console.error('Download failed', error)
        }
    }

    const getCategoryIcon = (id) => {
        const cat = CATEGORIES.find(c => c.id === id)
        const Icon = cat ? cat.icon : Smartphone
        return <Icon size={18} />
    }

    const currentDevice = DEVICES[selectedDevice]

    const renderMockup = () => {
        const props = {
            image,
            fitMode,
            scale,
            imageScale,
            imageOffset,
            isPanning,
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            device: currentDevice
        }

        switch (currentDevice.type) {
            case 'phone': return <PhoneMockup {...props} />
            case 'android': return <AndroidMockup {...props} />
            case 'tablet': return <TabletMockup {...props} />
            case 'laptop': return <LaptopMockup {...props} />
            case 'desktop-laptop': return <DesktopMockup {...props} />
            case 'desktop-iMac': return <DesktopMockup {...props} />
            case 'browser': return <BrowserMockup {...props} />
            default: return null
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
                        Buat mockup profesional dengan frame premium.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Processing
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.grid}>
                        {/* Preview Area */}
                        <div className={styles.previewContainer}>
                            <div
                                id="capture-container"
                                ref={containerRef}
                                className={styles.captureArea}
                                style={{
                                    padding: `${padding}px`,
                                    background: bgColor === 'transparent' ? 'transparent' : bgColor,
                                    transform: `scale(${1 / scale})`,
                                    zoom: 0.6
                                }}
                            >
                                {!image ? (
                                    <div
                                        className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaActive : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('image-upload').click()}
                                    >
                                        <div className={styles.iconCircle}>
                                            <ImageIcon size={40} strokeWidth={1.5} />
                                        </div>
                                        <h3 className={styles.uploadTitle}>Upload Screenshot</h3>
                                        <p className={styles.uploadSubtitle}>Drag & drop atau klik untuk memilih</p>
                                        <div className={styles.supportedTypes}>
                                            <span>JPG</span><span>PNG</span><span>WEBP</span>
                                        </div>
                                        <input type="file" id="image-upload" accept="image/*" onChange={handleFileSelect} hidden />
                                    </div>
                                ) : (
                                    renderMockup()
                                )}
                            </div>
                        </div>

                        {/* Controls Sidebar */}
                        <div className={styles.sidebar}>
                            <div className={styles.controlsCard}>

                                {/* 1. Category Tabs */}
                                <div className={styles.categoryTabs}>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.categoryTabActive : ''}`}
                                            onClick={() => setSelectedCategory(cat.id)}
                                        >
                                            {getCategoryIcon(cat.id)}
                                            <span>{cat.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* 2. Device Selection (Filtered) */}
                                <div className={styles.controlGroup}>
                                    <div className={styles.deviceGrid}>
                                        {Object.values(DEVICES)
                                            .filter(d => d.category === selectedCategory)
                                            .map(device => (
                                                <div
                                                    key={device.id}
                                                    className={`${styles.deviceCard} ${selectedDevice === device.id ? styles.deviceCardActive : ''}`}
                                                    onClick={() => setSelectedDevice(device.id)}
                                                    title={device.name}
                                                >
                                                    <span className={styles.deviceName}>{device.name}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* 3. Layout Controls */}
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

                                    {image && (
                                        <div className={styles.controlGroup}>
                                            <label className={styles.label}>Posisi Gambar</label>

                                            <div className={styles.scaleButtons} style={{ marginBottom: '12px' }}>
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

                                            <div className={styles.sliderHeader}>
                                                <span className={styles.sliderLabel}>Zoom Gambar</span>
                                                <span className={styles.sliderValue}>{Math.round(imageScale * 100)}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5" max="3" step="0.1"
                                                value={imageScale}
                                                onChange={(e) => setImageScale(parseFloat(e.target.value))}
                                                className={styles.slider}
                                            />
                                            <p className={styles.dropSubtext} style={{ marginTop: '8px' }}>*Geser gambar di preview untuk mengatur posisi</p>
                                        </div>
                                    )}

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

                                    {/* 4. Export Settings */}
                                    <div className={styles.controlGroup}>
                                        <div className={styles.sliderHeader}>
                                            <span className={styles.sliderLabel}>Kualitas (Output)</span>
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
                                            backgroundColor: 'var(--primary-dark)',
                                            color: 'white',
                                        }}
                                    >
                                        <Download size={20} /> Download PNG
                                    </button>

                                    {image && (
                                        <button
                                            className={styles.resetBtn}
                                            onClick={() => {
                                                setImage(null)
                                                // Reset file input
                                                const fileInput = document.getElementById('image-upload')
                                                if (fileInput) fileInput.value = ''
                                            }}
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
