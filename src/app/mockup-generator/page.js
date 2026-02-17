'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Layout, Smartphone, Monitor, Upload, Download, Palette, Layers,
    Maximize, Type, ImageIcon, Check, X, Shield, Tablet, Laptop,
    Smartphone as PhoneIcon, ChevronDown, ChevronUp, GripHorizontal, Info
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'
import PhoneMockup from '@/components/mockups/PhoneMockup'
import TabletMockup from '@/components/mockups/TabletMockup'
import DesktopMockup from '@/components/mockups/DesktopMockup'
import LaptopMockup from '@/components/mockups/LaptopMockup'
import BrowserMockup from '@/components/mockups/BrowserMockup'
import * as htmlToImage from 'html-to-image'

import { ALL_DEVICES as DEVICES, CATEGORIES } from './registry'

const ControlSection = ({ title, tooltip, children, className }) => (
    <div className={`${styles.controlSection} ${className || ''}`}>
        <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{title}</span>
            {tooltip && (
                <div className={styles.tooltipContainer} title={tooltip}>
                    <Info size={14} className={styles.tooltipIcon} />
                </div>
            )}
        </div>
        {children}
    </div>
)

export default function MockupGeneratorPage() {
    const [image, setImage] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState('iphone14ProMax')
    const [selectedCategory, setSelectedCategory] = useState('phone')
    const [customUrl, setCustomUrl] = useState('amanindata.com')

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

    // New Controls
    const [isSidebarHidden, setIsSidebarHidden] = useState(false)
    const [imagePos, setImagePos] = useState({ x: 50, y: 50 }) // Center by default (50% 50%)

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
            // Force higher resolution export
            const dataUrl = await htmlToImage.toPng(containerRef.current, {
                pixelRatio: scale, // Multiply the REAL resolution if needed (usually 1x is enough now)
                backgroundColor: bgColor === 'transparent' ? null : bgColor,
                style: {
                    transform: 'scale(1)', // Reset preview scale to full size
                    transformOrigin: 'top center'
                },
                width: containerRef.current.offsetWidth, // Ensure full width captured
                height: containerRef.current.offsetHeight
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

    const currentDevice = DEVICES[selectedDevice] || Object.values(DEVICES)[0] || {}

    // STABLE PREVIEW LOGIC
    // We calculate the scale to fit the mockup within a fixed visual box (e.g. 500x600)
    // This ensures adding padding 'zooms out' the preview instead of expanding the layout (which causes jitter)
    const MAX_PREVIEW_WIDTH = 550
    const MAX_PREVIEW_HEIGHT = 650

    const deviceWidth = currentDevice?.w || currentDevice?.width || 400
    const deviceHeight = currentDevice?.h || currentDevice?.height || 800

    const rawWidth = (deviceWidth * scale) + (padding * 2)
    const rawHeight = (deviceHeight * scale) + (padding * 2)

    // Check which dimension is the bottleneck
    const scaleX = MAX_PREVIEW_WIDTH / rawWidth
    const scaleY = MAX_PREVIEW_HEIGHT / rawHeight

    // Choose the smaller scale to ensure it fits both dimensions
    const previewScale = Math.min(scaleX, scaleY, 1) // Never scale UP for preview quality

    // Wrapper dimensions follow the visual size
    const previewWrapperWidth = rawWidth * previewScale
    const previewWrapperHeight = rawHeight * previewScale

    const renderMockup = () => {
        const props = {
            deviceType: selectedDevice, // Pass the ID string
            image,
            fitMode,
            scale,
            imageScale,
            imageOffset, // Keeping for backward compatibility or pan
            imagePos, // New prop for position
            isPanning,
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            // device object is no longer passed as 'device', but we use it for type checking below
        }

        const type = currentDevice?.type

        switch (type) {
            case 'phone': return <PhoneMockup {...props} />
            case 'tablet': return <TabletMockup {...props} />
            case 'laptop': return <LaptopMockup {...props} />
            case 'desktop': return <DesktopMockup {...props} />
            case 'browser': return <BrowserMockup {...props} browserType={selectedDevice} url={customUrl} />
            default: return null
        }
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        📱 Mockup Generator <span>Instant</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Buat mockup profesional dengan frame premium.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Processing
                    </div>
                </header>

                <div className={styles.workspace}>
                    {/* Toolbar for Hide Sidebar */}
                    <div className={styles.toolbar}>
                        <button
                            className={styles.toolbarBtn}
                            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                        >
                            {isSidebarHidden ? <Maximize size={20} /> : <Maximize size={20} />}
                            <span>{isSidebarHidden ? 'Show Sidebar' : 'Hide Sidebar'}</span>
                        </button>
                    </div>

                    <div className={styles.grid} style={{
                        gridTemplateColumns: isSidebarHidden ? '1fr' : 'minmax(0, 1fr) 380px'
                    }}>
                        {/* Preview Area */}
                        <div className={styles.previewContainer}>
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
                                <div
                                    className={styles.previewStage}
                                    style={{
                                        // Explicit dimensions to match the SCALED content, removing ghost margin
                                        width: previewWrapperWidth,
                                        height: previewWrapperHeight,
                                        transition: 'width 0.2s ease-out, height 0.2s ease-out' // Smooth out jitter
                                    }}
                                >
                                    <div
                                        id="capture-container"
                                        ref={containerRef}
                                        className={styles.captureArea}
                                        style={{
                                            padding: `${padding}px`,
                                            background: bgColor === 'transparent' ? 'transparent' : bgColor,
                                            /* Dynamic Preview Scale: Consistent size regardless of resolution */
                                            transform: `scale(${previewScale})`,
                                            transformOrigin: 'top left', // Changed to top left to align with wrapper
                                            width: 'fit-content'
                                        }}
                                    >
                                        {renderMockup()}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Controls Sidebar */}
                        {!isSidebarHidden && (
                            <div className={styles.sidebar}>
                                <div className={styles.sidebarScroll}>

                                    {/* Card 1: Device Selection */}
                                    <div className={styles.controlsCard}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>Pilih Device</h3>
                                        </div>

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

                                    {/* Card 2: Customization */}
                                    <div className={styles.controlsCard}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>Kustomisasi</h3>
                                        </div>

                                        {/* Browser URL Input */}
                                        {currentDevice?.type === 'browser' && (
                                            <ControlSection title="Website URL" tooltip="Ganti alamat website di address bar">
                                                <input
                                                    type="text"
                                                    value={customUrl}
                                                    onChange={(e) => setCustomUrl(e.target.value)}
                                                    className={styles.input}
                                                    placeholder="example.com"
                                                />
                                            </ControlSection>
                                        )}

                                        {/* Padding Control */}
                                        <ControlSection title="Layout" tooltip="Atur jarak (padding) antara frame dan tepi gambar">
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
                                        </ControlSection>

                                        {/* Image Controls */}
                                        {image && (
                                            <ControlSection title="Posisi Gambar" tooltip="Sesuaikan posisi, zoom, dan cropping gambar">
                                                <div className={styles.scaleButtons} style={{ marginBottom: '16px' }}>
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

                                                <div className={styles.sliderGroup}>
                                                    <div className={styles.sliderHeader}>
                                                        <span className={styles.sliderLabel}>Posisi Horizontal (X)</span>
                                                        <span className={styles.sliderValue}>{imagePos.x}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0" max="100"
                                                        value={imagePos.x}
                                                        onChange={(e) => setImagePos(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                                                        className={styles.slider}
                                                    />
                                                </div>

                                                <div className={styles.sliderGroup}>
                                                    <div className={styles.sliderHeader}>
                                                        <span className={styles.sliderLabel}>Posisi Vertikal (Y)</span>
                                                        <span className={styles.sliderValue}>{imagePos.y}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0" max="100"
                                                        value={imagePos.y}
                                                        onChange={(e) => setImagePos(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                                                        className={styles.slider}
                                                    />
                                                </div>

                                                <div className={styles.sliderGroup}>
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
                                                </div>
                                                <p className={styles.dropSubtext}>*Gunakan slider untuk mengatur posisi gambar</p>
                                            </ControlSection>
                                        )}

                                        {/* Background Control */}
                                        <ControlSection title="Background" tooltip="Ganti warna latar belakang mockup">
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
                                        </ControlSection>

                                        {/* Export / Quality */}
                                        <ControlSection title="Kualitas (Output)" tooltip="Resolusi gambar hasil download">
                                            <div className={styles.sliderHeader}>
                                                <span className={styles.sliderLabel}>Multiplier</span>
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
                                            <div className={styles.resolutionHint}>
                                                {(currentDevice?.w * scale) || 0} x {(currentDevice?.h * scale) || 0} px
                                            </div>
                                        </ControlSection>

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
                        )}
                    </div>
                </div>
                <TrustSection />
                <GuideSection toolId="mockup-generator" />
            </main>
            <Footer />
        </>
    )
}
