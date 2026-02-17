'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Upload, Download, Check, RefreshCw, Scissors, Image as ImageIcon, Camera, Settings, Maximize, Minimize, Grid, Layout, Monitor, Instagram, Facebook, Share2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'

// Helper: Unit Conversions
const UNITS = {
    px: { label: 'px', scale: 1 },
    cm: { label: 'cm', scale: 37.795 }, // 1cm = 37.795px at 96 DPI (default screen)
    mm: { label: 'mm', scale: 3.7795 },
    inch: { label: 'inch', scale: 96 }
}

const PRESETS = {
    pasfoto: [
        { label: '2x3', w: 2, h: 3, unit: 'cm' },
        { label: '3x4', w: 3, h: 4, unit: 'cm' },
        { label: '4x6', w: 4, h: 6, unit: 'cm' },
        { label: '3.5x4.5', w: 35, h: 45, unit: 'mm', desc: 'Visa Standard' }
    ],
    social: [
        { label: 'Instagram Post', w: 1080, h: 1080, unit: 'px', icon: Instagram },
        { label: 'Instagram Story', w: 1080, h: 1920, unit: 'px', icon: Instagram },
        { label: 'Facebook Post', w: 1200, h: 630, unit: 'px', icon: Facebook },
        { label: 'Twitter Post', w: 1200, h: 675, unit: 'px', icon: Share2 }
    ],
    device: [
        { label: 'FHD Wallpaper', w: 1920, h: 1080, unit: 'px', icon: Monitor },
        { label: '4K Wallpaper', w: 3840, h: 2160, unit: 'px', icon: Monitor },
        { label: 'iPhone Wallpaper', w: 1170, h: 2532, unit: 'px', icon: Monitor }
    ]
}

export default function PhotoGeneratorPage() {
    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState('')

    // UI State
    const [activeTab, setActiveTab] = useState('presets')
    const [expandedCategory, setExpandedCategory] = useState({ pasfoto: true, social: false, device: false })

    const toggleCategory = (cat) => {
        setExpandedCategory(prev => ({ ...prev, [cat]: !prev[cat] }))
    }

    // Settings
    const [settings, setSettings] = useState({
        width: 3,
        height: 4,
        unit: 'cm',
        dpi: 300,
        mode: 'cover', // cover, contain, stretch
        bg: '#ffffff', // For contain mode
        bgType: 'color', // color, blur
        format: 'image/jpeg',
        quality: 0.9,
        aspectLock: true
    })

    // Output Dimensions (Calculated in PX)
    const outDims = useMemo(() => {
        let wPx, hPx
        if (settings.unit === 'px') {
            wPx = settings.width
            hPx = settings.height
        } else {
            // Convert everything to INCHES first
            const inchW = settings.unit === 'inch' ? settings.width :
                settings.unit === 'cm' ? settings.width / 2.54 :
                    settings.width / 25.4

            const inchH = settings.unit === 'inch' ? settings.height :
                settings.unit === 'cm' ? settings.height / 2.54 :
                    settings.height / 25.4

            // Multiply by DPI
            wPx = Math.round(inchW * settings.dpi)
            hPx = Math.round(inchH * settings.dpi)
        }
        return { w: wPx, h: hPx }
    }, [settings.width, settings.height, settings.unit, settings.dpi])

    // Canvas Refs
    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)

    // Drag State (for move logic in Fill mode)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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
                    setOffset({ x: 0, y: 0 })
                    // Default to 4x6 cm ?
                    setSettings(prev => ({ ...prev, width: 4, height: 6, unit: 'cm' }))
                }
                img.src = event.target.result
            }
            reader.readAsDataURL(file)
        }
    }

    // Update Settings Helper
    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    // Apply Preset
    const applyPreset = (preset) => {
        setSettings(prev => ({
            ...prev,
            width: preset.w,
            height: preset.h,
            unit: preset.unit,
            dpi: preset.unit === 'px' ? 72 : 300, // Default 300 for physical, 72 for digital
            mode: 'cover' // Usually cover for presets
        }))
        setOffset({ x: 0, y: 0 })
    }

    // Draw Preview
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !image) return

        const ctx = canvas.getContext('2d')

        // Preview Canvas Size (Display Purpose)
        // We render at most 800px width/height to be performant
        const maxDisplay = 800
        const { w: rawW, h: rawH } = outDims

        if (rawW === 0 || rawH === 0) return

        const scalePreview = Math.min(1, maxDisplay / rawW, maxDisplay / rawH)

        // Logical size of canvas = scaled output
        canvas.width = rawW * scalePreview
        canvas.height = rawH * scalePreview

        // Use the scale for drawing context
        ctx.scale(scalePreview, scalePreview)

        // Draw Logic based on Mode
        const w = rawW
        const h = rawH

        // Background
        if (settings.bgType === 'color') {
            ctx.fillStyle = settings.bg
            ctx.fillRect(0, 0, w, h)
        } else if (settings.bgType === 'blur') {
            // Draw blurred background (stretch)
            ctx.filter = 'blur(40px)'
            // Draw a slightly larger image to avoid fade at edges
            ctx.drawImage(image, -w * 0.1, -h * 0.1, w * 1.2, h * 1.2)
            ctx.filter = 'none'
            // Darken slightly to make foreground pop
            ctx.fillStyle = 'rgba(0,0,0,0.1)'
            ctx.fillRect(0, 0, w, h)
        }

        if (settings.mode === 'stretch') {
            ctx.drawImage(image, 0, 0, w, h)
        } else if (settings.mode === 'contain') { // Fit
            // Ratio
            const ratio = Math.min(w / image.width, h / image.height)
            const drawW = image.width * ratio
            const drawH = image.height * ratio
            const x = (w - drawW) / 2
            const y = (h - drawH) / 2

            // Draw image
            ctx.drawImage(image, x, y, drawW, drawH)

        } else { // Cover (Fill)
            const ratio = Math.max(w / image.width, h / image.height)
            const drawW = image.width * ratio
            const drawH = image.height * ratio

            // Center + Offset
            // Offset is in PREVIEW PIXELS? No, state offset should be in output pixels?
            // Or better: normalized -1 to 1?
            // Let's keep offset in output pixels for simplicity, but scaled

            let x = (w - drawW) / 2 + offset.x
            let y = (h - drawH) / 2 + offset.y

            ctx.drawImage(image, x, y, drawW, drawH)
        }

    }, [image, outDims, settings, offset])

    // Drag Logic for Preview
    const handleMouseDown = (e) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })
    }

    const handleMouseMove = (e) => {
        if (!isDragging || settings.mode !== 'cover') return
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y

        // Calculate factor to convert screen pixels to canvas logical pixels
        // Canvas is scaled. Input dx/dy are screen pixels.
        // We need to apply this to the underlying offset which is in Output Pixels.
        // Canvas Width (Screen) ~ Canvas Width (Logical) ?
        // CSS max-width: 100%.

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width // Logical / Screen

        // But canvas logical is *Preview Scaled*.
        // And we draw with `ctx.scale(scalePreview)`.
        // So offset needs to be divided by scalePreview?

        // Let's simplify: 
        // We update offset. The effect is `x + offset.x`.
        // If we move mouse 10px right.
        // We want image to move 10px right visually.
        // Visually 10px = 10 * scaleX (logical pixels).
        // Logical pixels = Output Pixels * scalePreview.
        // So Output Delta = (10 * scaleX) / scalePreview.

        // We can just accumulate delta and multiply by a sensitivity factor
        // Sensitivity: 1 screen pixel -> 1 output pixel (approx)
        // If image is huge (4000px) and preview is small (400px), 1px screen move should correspond to 10px output move?
        // Yes, so sensitivity = outDims.w / rect.width

        const sensitivity = outDims.w / rect.width

        setOffset(prev => ({ x: prev.x + dx * sensitivity, y: prev.y + dy * sensitivity }))
        setDragStart({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = () => setIsDragging(false)


    // Download
    const handleDownload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = outDims.w
        canvas.height = outDims.h
        const ctx = canvas.getContext('2d')

        const { w, h } = outDims

        // BG
        if (settings.bgType === 'color') {
            ctx.fillStyle = settings.bg
            ctx.fillRect(0, 0, w, h)
        } else if (settings.bgType === 'blur') {
            ctx.filter = 'blur(40px)'
            ctx.drawImage(image, -w * 0.1, -h * 0.1, w * 1.2, h * 1.2)
            ctx.filter = 'none'
            ctx.fillStyle = 'rgba(0,0,0,0.1)'
            ctx.fillRect(0, 0, w, h)
        }

        // Image
        if (settings.mode === 'stretch') {
            ctx.drawImage(image, 0, 0, w, h)
        } else if (settings.mode === 'contain') {
            const ratio = Math.min(w / image.width, h / image.height)
            const drawW = image.width * ratio
            const drawH = image.height * ratio
            const x = (w - drawW) / 2
            const y = (h - drawH) / 2
            ctx.drawImage(image, x, y, drawW, drawH)
        } else {
            const ratio = Math.max(w / image.width, h / image.height)
            const drawW = image.width * ratio
            const drawH = image.height * ratio
            let x = (w - drawW) / 2 + offset.x
            let y = (h - drawH) / 2 + offset.y
            ctx.drawImage(image, x, y, drawW, drawH)
        }

        // Format
        let mime = settings.format // image/jpeg
        let ext = mime.split('/')[1]

        const link = document.createElement('a')
        link.download = `${fileName}-amanin-${w}x${h}.${ext}`
        link.href = canvas.toDataURL(mime, settings.quality)
        link.click()
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div className={styles.hero} style={{ marginBottom: image ? '2rem' : '3rem', transition: 'all 0.3s' }}>
                        <h1 className={styles.heroTitle} style={{ fontSize: image ? '1.8rem' : '2.5rem' }}>📸 Buat Pas Foto <span>Otomatis</span></h1>
                        <p className={styles.heroSubtitle} style={{ display: image ? 'block' : 'block', fontSize: image ? '0.9rem' : '1.1rem', marginTop: '8px' }}>
                            Ubah ukuran, DPI, dan format foto dengan presisi tinggi.
                        </p>
                    </div>

                    {!image ? (
                        <div
                            className={styles.uploadArea}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className={styles.iconCircle}>
                                <Camera size={40} />
                            </div>
                            <div className={styles.uploadContent}>
                                <h3>Upload Foto</h3>
                                <p>Tarik file atau klik untuk memilih</p>
                                <div className={styles.supportedTypes}>
                                    <span>JPG</span> <span>PNG</span> <span>WEBP</span>
                                </div>
                                <span className={styles.safeTag}>🔒 100% Client-Side</span>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
                        </div>
                    ) : (
                        <div className={styles.workspace}>
                            {/* PREVIEW SECTION */}
                            <div className={styles.previewSection}>
                                <div className={styles.canvasWrap}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    {isDragging && settings.mode === 'cover' && (
                                        <div className={styles.cropOverlay} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 10 }}>
                                            <Maximize size={24} style={{ opacity: 0.8 }} />
                                        </div>
                                    )}
                                    <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '4px', cursor: settings.mode === 'cover' ? (isDragging ? 'grabbing' : 'grab') : 'default', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                </div>
                            </div>

                            {/* CONTROLS SECTION */}
                            <div className={styles.controlsSection}>
                                {/* Output Info moved here */}
                                <div className={styles.outputInfoCard}>
                                    <div className={styles.outputDetails}>
                                        <span className={styles.outputLabel}>Output Size:</span>
                                        <strong>{outDims.w} x {outDims.h} px</strong>
                                        <span className={styles.outputDpi}>@ {settings.dpi} DPI</span>
                                    </div>
                                    <button onClick={() => { setImage(null); setSettings({ ...settings, width: 3, height: 4, unit: 'cm' }) }} className={styles.changeBtn}>
                                        <RefreshCw size={14} /> Ganti Foto
                                    </button>
                                </div>

                                <div className={styles.tabs}>
                                    <button className={`${styles.tab} ${activeTab === 'presets' ? styles.active : ''}`} onClick={() => setActiveTab('presets')}>Presets</button>
                                    <button className={`${styles.tab} ${activeTab === 'custom' ? styles.active : ''}`} onClick={() => setActiveTab('custom')}>Custom</button>
                                </div>

                                {activeTab === 'presets' ? (
                                    <>
                                        {/* Pas Foto Accordion */}
                                        <div className={styles.accordion}>
                                            <button className={styles.accordionHeader} onClick={() => toggleCategory('pasfoto')}>
                                                <span>Pas Foto (Cetak)</span>
                                                {expandedCategory.pasfoto ? <Minimize size={16} /> : <Maximize size={16} />}
                                            </button>
                                            {expandedCategory.pasfoto && (
                                                <div className={`${styles.accordionContent} ${styles.grid3}`}>
                                                    {PRESETS.pasfoto.map((p, i) => (
                                                        <button key={i} className={`${styles.presetBtn} ${settings.width === p.w && settings.height === p.h && settings.unit === p.unit ? styles.active : ''}`} onClick={() => applyPreset(p)}>
                                                            <span className={styles.presetLabel}>{p.label}</span>
                                                            <span className={styles.presetSub}>{p.w}x{p.h} {p.unit}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Social Accordion */}
                                        <div className={styles.accordion}>
                                            <button className={styles.accordionHeader} onClick={() => toggleCategory('social')}>
                                                <span>Social Media</span>
                                                {expandedCategory.social ? <Minimize size={16} /> : <Maximize size={16} />}
                                            </button>
                                            {expandedCategory.social && (
                                                <div className={`${styles.accordionContent} ${styles.grid2}`}>
                                                    {PRESETS.social.map((p, i) => (
                                                        <button key={i} className={`${styles.presetBtn} ${settings.width === p.w && settings.height === p.h && settings.unit === p.unit ? styles.active : ''}`} onClick={() => applyPreset(p)}>
                                                            <p.icon size={20} className={styles.presetIcon} />
                                                            <span className={styles.presetLabel}>{p.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Device Accordion */}
                                        <div className={styles.accordion}>
                                            <button className={styles.accordionHeader} onClick={() => toggleCategory('device')}>
                                                <span>Devices</span>
                                                {expandedCategory.device ? <Minimize size={16} /> : <Maximize size={16} />}
                                            </button>
                                            {expandedCategory.device && (
                                                <div className={`${styles.accordionContent} ${styles.grid2}`}>
                                                    {PRESETS.device.map((p, i) => (
                                                        <button key={i} className={`${styles.presetBtn} ${settings.width === p.w && settings.height === p.h && settings.unit === p.unit ? styles.active : ''}`} onClick={() => applyPreset(p)}>
                                                            <p.icon size={20} className={styles.presetIcon} />
                                                            <span className={styles.presetLabel}>{p.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.controlGroup}>
                                        <label className={styles.controlLabel}>
                                            <Grid size={16} /> Dimensi & Resolusi
                                            <div className={styles.tooltipGroup}>
                                                <span className={styles.infoIcon}>?</span>
                                                <span className={styles.tooltipText}>Atur lebar dan tinggi foto. Gunakan "cm" untuk cetak, "px" untuk digital.</span>
                                            </div>
                                        </label>
                                        <div className={styles.grid2}>
                                            <div className={styles.inputGroup}>
                                                <span className={styles.inputLabel}>Width</span>
                                                <input type="number" className={styles.input} value={settings.width} onChange={(e) => updateSetting('width', Number(e.target.value))} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <span className={styles.inputLabel}>Height</span>
                                                <input type="number" className={styles.input} value={settings.height} onChange={(e) => updateSetting('height', Number(e.target.value))} />
                                            </div>
                                        </div>
                                        <div className={styles.grid2} style={{ marginTop: '12px' }}>
                                            <div className={styles.inputGroup}>
                                                <span className={styles.inputLabel}>Unit</span>
                                                <select className={styles.unitSelect} value={settings.unit} onChange={(e) => updateSetting('unit', e.target.value)} style={{ width: '100%' }}>
                                                    {Object.keys(UNITS).map(u => <option key={u} value={u}>{UNITS[u].label}</option>)}
                                                </select>
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <span className={styles.inputLabel}>DPI</span>
                                                <input type="number" className={styles.input} value={settings.dpi} onChange={(e) => updateSetting('dpi', Number(e.target.value))} />
                                                <div className={styles.tooltipGroup} style={{ marginLeft: 'auto' }}>
                                                    <span className={styles.infoIcon} style={{ fontSize: '10px', width: '14px', height: '14px' }}>?</span>
                                                    <span className={styles.tooltipText}>Dots Per Inch. Standar cetak adalah 300 DPI. Web biasanya 72 DPI.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Common Settings */}
                                <div className={styles.controlGroup} style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <label className={styles.controlLabel}>
                                        <Layout size={16} /> Mode Resize
                                        <div className={styles.tooltipGroup}>
                                            <span className={styles.infoIcon}>?</span>
                                            <span className={styles.tooltipText}>
                                                <b>Cover</b>: Potong gambar agar penuh.<br />
                                                <b>Fit</b>: Masukkan seluruh gambar.<br />
                                                <b>Stretch</b>: Paksa tarik gambar.
                                            </span>
                                        </div>
                                    </label>
                                    <div className={styles.grid3}>
                                        {[
                                            { id: 'cover', label: 'Cover', desc: 'Potong' },
                                            { id: 'contain', label: 'Fit', desc: 'Utuh' },
                                            { id: 'stretch', label: 'Stretch', desc: 'Tarik' }
                                        ].map(m => (
                                            <button key={m.id} className={`${styles.modeBtn} ${settings.mode === m.id ? styles.active : ''}`} onClick={() => updateSetting('mode', m.id)}>
                                                <span className={styles.modeLabel}>{m.label}</span>
                                                <span className={styles.modeDesc}>({m.desc})</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {settings.mode === 'contain' && (
                                    <div className={styles.controlGroup}>
                                        <label className={styles.controlLabel}>Background</label>
                                        <div className={styles.grid3}>
                                            <button className={`${styles.presetBtn} ${settings.bgType === 'color' && settings.bg === '#ffffff' ? styles.active : ''}`} onClick={() => setSettings(p => ({ ...p, bgType: 'color', bg: '#ffffff' }))} style={{ height: '40px', padding: 0 }}>White</button>
                                            <button className={`${styles.presetBtn} ${settings.bgType === 'color' && settings.bg === '#000000' ? styles.active : ''}`} onClick={() => setSettings(p => ({ ...p, bgType: 'color', bg: '#000000' }))} style={{ height: '40px', padding: 0 }}>Black</button>
                                            <button className={`${styles.presetBtn} ${settings.bgType === 'blur' ? styles.active : ''}`} onClick={() => updateSetting('bgType', 'blur')} style={{ height: '40px', padding: 0 }}>Blur</button>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}><Settings size={16} /> Output</label>
                                    <div className={styles.grid2}>
                                        <div className={styles.inputGroup}>
                                            <select className={styles.unitSelect} value={settings.format} onChange={(e) => updateSetting('format', e.target.value)} style={{ width: '100%' }}>
                                                <option value="image/jpeg">JPG</option>
                                                <option value="image/png">PNG</option>
                                                <option value="image/webp">WEBP</option>
                                            </select>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <span className={styles.inputLabel} style={{ minWidth: 'auto' }}>
                                                Kualitas
                                                <div className={styles.tooltipGroup} style={{ marginLeft: '4px', display: 'inline-flex' }}>
                                                    <span className={styles.infoIcon} style={{ fontSize: '10px', width: '14px', height: '14px' }}>?</span>
                                                    <span className={styles.tooltipText}>Semakin tinggi %, semakin bagus gambarnya tapi ukuran file lebih besar.</span>
                                                </div>
                                            </span>
                                            <input
                                                type="number"
                                                min="10"
                                                max="100"
                                                className={styles.input}
                                                value={Math.round(settings.quality * 100)}
                                                onChange={(e) => {
                                                    let val = Number(e.target.value);
                                                    if (val > 100) val = 100;
                                                    if (val < 0) val = 0;
                                                    updateSetting('quality', val / 100);
                                                }}
                                                style={{ textAlign: 'right' }}
                                            />
                                            <span className={styles.unitSelect} style={{ opacity: 0.5, paddingLeft: '2px' }}>%</span>
                                        </div>
                                    </div>
                                </div>

                                <button className={styles.downloadBtn} onClick={handleDownload} style={{ marginTop: 'auto' }}>
                                    <Download size={20} /> Download Image
                                </button>

                            </div>
                        </div>
                    )}
                    <TrustSection />
                    <GuideSection toolId="photo-generator" />
                </div>
            </main>
            <Footer />
        </>
    )
}
