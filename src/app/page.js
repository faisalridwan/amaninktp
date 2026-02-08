'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, Crop, Type, Palette, Download, RotateCcw, FileImage, CreditCard, Users, FileText, Building, File, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

import WatermarkControls from '@/components/WatermarkControls'

export default function Home() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    // Image states
    const [uploadedImage, setUploadedImage] = useState(null)
    const [originalFileName, setOriginalFileName] = useState('')
    const [imageLoaded, setImageLoaded] = useState(false)

    // Crop states
    const [isCropping, setIsCropping] = useState(false)
    const [cropStart, setCropStart] = useState(null)
    const [cropEnd, setCropEnd] = useState(null)
    const [isCropDragging, setIsCropDragging] = useState(false)
    const [croppedImage, setCroppedImage] = useState(null)

    // Watermark states
    const [watermarkType, setWatermarkType] = useState('tiled')
    const [watermarkText, setWatermarkText] = useState('')
    const [fontSize, setFontSize] = useState(30)
    const [fontFamily, setFontFamily] = useState('Arial')
    const [rotation, setRotation] = useState(-15)
    const [opacity, setOpacity] = useState(0.3)
    const [color, setColor] = useState('#080808')

    // Single text states
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
    const [textScale, setTextScale] = useState(1)
    const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 })
    const [canvasMetrics, setCanvasMetrics] = useState({ width: 0, height: 0, scale: 1 })

    // Removed old interactive states (isDragging etc) since handled by overlay

    const canvasRef = useRef(null)
    const cropCanvasRef = useRef(null)
    const cropWrapperRef = useRef(null)
    const fileInputRef = useRef(null)

    const fonts = [
        { value: 'Arial', label: 'Arial' },
        { value: 'Times New Roman', label: 'Times New Roman' },
        { value: 'PT Sans', label: 'PT Sans' },
        { value: 'Poppins', label: 'Poppins' },
        { value: 'Georgia', label: 'Georgia' },
    ]

    const documentTypes = [
        { icon: CreditCard, label: 'KTP' },
        { icon: CreditCard, label: 'SIM' },
        { icon: Users, label: 'Kartu Keluarga' },
        { icon: FileText, label: 'Paspor' },
        { icon: Building, label: 'NPWP' },
        { icon: File, label: 'Dokumen Lain' },
    ]

    // Generate auto watermark text
    const getAutoText = useCallback(() => {
        const today = new Date()
        const day = today.getDate().toString().padStart(2, '0')
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const year = today.getFullYear()
        return `Verifikasi ${day}/${month}/${year}`
    }, [])

    // Handle checkbox - insert text into textarea
    const handleAutoTextToggle = (checked) => {
        if (checked) {
            const autoText = getAutoText()
            setWatermarkText(prev => prev.trim() ? `${prev.trim()}\n${autoText}` : autoText)
        }
    }

    // Get final watermark text - all from textarea
    const getFinalWatermarkText = useCallback(() => {
        return watermarkText.trim() || 'WATERMARK'
    }, [watermarkText])

    // Main draw function
    const draw = useCallback(() => {
        const canvas = canvasRef.current
        const sourceImage = croppedImage || uploadedImage
        if (!canvas || !sourceImage) return

        const ctx = canvas.getContext('2d')
        canvas.width = sourceImage.width
        canvas.height = sourceImage.height

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(sourceImage, 0, 0)

        const text = getFinalWatermarkText()
        const lines = text.split('\n')
        const actualFontSize = fontSize * textScale
        const lineHeight = actualFontSize * 1.3

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.font = `bold ${actualFontSize}px "${fontFamily}", sans-serif`
        ctx.fillStyle = color
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        if (watermarkType === 'tiled') {
            const spacing = actualFontSize * 4
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
            const posX = textPosition.x || canvas.width / 2
            const posY = textPosition.y || canvas.height / 2

            ctx.translate(posX, posY)
            ctx.rotate((rotation * Math.PI) / 180)

            lines.forEach((line, index) => {
                const yOffset = index * lineHeight - ((lines.length - 1) * lineHeight) / 2
                ctx.fillText(line, 0, yOffset)
            })


        }

        ctx.restore()
    }, [uploadedImage, croppedImage, watermarkType, fontSize, fontFamily, rotation, opacity, color, textPosition, textScale, getFinalWatermarkText])

    useEffect(() => {
        if (imageLoaded && !isCropping) draw()
    }, [draw, imageLoaded, isCropping])

    useEffect(() => {
        const sourceImage = croppedImage || uploadedImage
        if (sourceImage && watermarkType === 'single') {
            setTextPosition({ x: sourceImage.width / 2, y: sourceImage.height / 2 })
        }
    }, [uploadedImage, croppedImage, watermarkType])

    const loadImage = (file) => {
        setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''))
        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                setUploadedImage(img)
                setCroppedImage(null)
                setImageLoaded(true)
                setTextPosition({ x: img.width / 2, y: img.height / 2 })
                setTextScale(1)
            }
            img.src = event.target?.result
        }
        reader.readAsDataURL(file)
    }

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) loadImage(file)
    }

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation() }
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer?.files?.[0]
        if (file?.type.startsWith('image/')) loadImage(file)
    }

    useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData?.items
            if (!items) return
            for (let item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile()
                    if (file) loadImage(file)
                    break
                }
            }
        }
        document.addEventListener('paste', handlePaste)
        return () => document.removeEventListener('paste', handlePaste)
    }, [])

    // Crop functions
    const startCrop = () => { setIsCropping(true); setCropStart(null); setCropEnd(null) }

    const getCropCoords = (e) => {
        const canvas = cropCanvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY
        return {
            x: Math.max(0, Math.min(canvas.width, (clientX - rect.left) * (canvas.width / rect.width))),
            y: Math.max(0, Math.min(canvas.height, (clientY - rect.top) * (canvas.height / rect.height)))
        }
    }

    const handleCropMouseDown = (e) => { if (!isCropping) return; const coords = getCropCoords(e); setCropStart(coords); setCropEnd(coords); setIsCropDragging(true) }
    const handleCropMouseMove = (e) => { if (!isCropping || !isCropDragging) return; setCropEnd(getCropCoords(e)) }
    const handleCropMouseUp = () => { setIsCropDragging(false) }

    const applyCrop = () => {
        if (!uploadedImage || !cropStart || !cropEnd) return
        const x = Math.min(cropStart.x, cropEnd.x), y = Math.min(cropStart.y, cropEnd.y)
        const width = Math.abs(cropEnd.x - cropStart.x), height = Math.abs(cropEnd.y - cropStart.y)
        if (width < 20 || height < 20) { alert('Area too small'); return }

        const cropCanvas = document.createElement('canvas')
        cropCanvas.width = width; cropCanvas.height = height
        cropCanvas.getContext('2d').drawImage(uploadedImage, x, y, width, height, 0, 0, width, height)

        const croppedImg = new Image()
        croppedImg.onload = () => { setCroppedImage(croppedImg); setTextPosition({ x: width / 2, y: height / 2 }); setIsCropping(false) }
        croppedImg.src = cropCanvas.toDataURL()
    }

    const cancelCrop = () => { setIsCropping(false); setCropStart(null); setCropEnd(null) }

    // Measure text dimensions
    useEffect(() => {
        if (watermarkType !== 'single') return

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const text = getFinalWatermarkText()
        const lines = text.split('\n')
        const actualFontSize = fontSize // Base font size, scale handled by component

        ctx.font = `bold ${actualFontSize}px "${fontFamily}", sans-serif`

        const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width))
        const lineHeight = actualFontSize * 1.3
        const totalHeight = lines.length * lineHeight

        setTextDimensions({ width: maxWidth, height: totalHeight })
    }, [watermarkText, fontSize, fontFamily, watermarkType, getFinalWatermarkText])

    // Measure canvas display size
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !imageLoaded) return

        const updateMetrics = () => {
            const rect = canvas.getBoundingClientRect()
            if (rect.width > 0 && canvas.width > 0) {
                setCanvasMetrics({
                    width: rect.width,
                    height: rect.height,
                    scale: rect.width / canvas.width
                })
            }
        }

        // Create ResizeObserver to track canvas size changes accurately
        const observer = new ResizeObserver(() => {
            updateMetrics()
        })

        observer.observe(canvas)

        // Initial check with a small delay to ensure canvas is painted
        const timer = setTimeout(updateMetrics, 50)

        window.addEventListener('resize', updateMetrics)
        return () => {
            observer.disconnect()
            clearTimeout(timer)
            window.removeEventListener('resize', updateMetrics)
        }
    }, [imageLoaded, croppedImage, uploadedImage])

    const handleWatermarkUpdate = (updates) => {
        if (updates.x !== undefined) setTextPosition(prev => ({ ...prev, x: updates.x, y: updates.y }))
        if (updates.rotation !== undefined) setRotation(Math.round(updates.rotation))
        if (updates.scale !== undefined) setTextScale(updates.scale)
    }

    // Download
    const getFileName = (ext) => `${originalFileName || 'ktp'}-watermark by amaninktp.qreatip.com.${ext}`

    const handleDownloadPNG = () => {
        if (!canvasRef.current || !imageLoaded) return
        const link = document.createElement('a')
        link.download = getFileName('png')
        link.href = canvasRef.current.toDataURL('image/png')
        link.click()
    }

    const handleDownloadPDF = async () => {
        if (!canvasRef.current || !imageLoaded) return
        const { jsPDF } = await import('jspdf')
        const canvas = canvasRef.current
        const pdfW = canvas.width * 0.264583, pdfH = canvas.height * 0.264583
        const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'mm', format: [pdfW, pdfH] })
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)
        pdf.save(getFileName('pdf'))
    }

    const handleReset = () => {
        setUploadedImage(null); setCroppedImage(null); setOriginalFileName(''); setImageLoaded(false)
        setWatermarkText(''); setFontSize(30); setFontFamily('Arial')
        setRotation(-15); setOpacity(0.3); setColor('#080808'); setWatermarkType('tiled'); setTextScale(1)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Crop overlay - draw with proper sizing
    useEffect(() => {
        if (!isCropping || !uploadedImage) return
        const canvas = cropCanvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        // Set canvas to image dimensions (internal size)
        canvas.width = uploadedImage.width
        canvas.height = uploadedImage.height

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(uploadedImage, 0, 0)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (cropStart && cropEnd) {
            const x = Math.min(cropStart.x, cropEnd.x), y = Math.min(cropStart.y, cropEnd.y)
            const w = Math.abs(cropEnd.x - cropStart.x), h = Math.abs(cropEnd.y - cropStart.y)
            ctx.clearRect(x, y, w, h)
            ctx.drawImage(uploadedImage, x, y, w, h, x, y, w, h)
            ctx.strokeStyle = '#5B8DEF'; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h)
            ctx.fillStyle = '#5B8DEF'
            const hs = 10
            ctx.fillRect(x - hs / 2, y - hs / 2, hs, hs); ctx.fillRect(x + w - hs / 2, y - hs / 2, hs, hs)
            ctx.fillRect(x - hs / 2, y + h - hs / 2, hs, hs); ctx.fillRect(x + w - hs / 2, y + h - hs / 2, hs, hs)
            ctx.font = '14px Arial'; ctx.textAlign = 'center'
            ctx.fillText(`${Math.round(w)} × ${Math.round(h)}`, x + w / 2, y + h + 20)
        }
    }, [isCropping, uploadedImage, cropStart, cropEnd])

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                {/* Hero */}
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>📄 Watermark KTP <span>Online</span></h1>
                    <p className={styles.heroSubtitle}>Lindungi dokumen identitas dengan watermark. 100% di browser.</p>
                </header>

                {/* Document Types */}
                <section className={styles.docSection}>
                    <p className={styles.docTitle}>Melindungi Berbagai Dokumen Anda</p>
                    <div className={styles.docGrid}>
                        {documentTypes.map((doc, i) => (
                            <div key={i} className={styles.docItem}>
                                <doc.icon size={20} />
                                <span>{doc.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Workspace */}
                <div className={`neu-card no-hover ${styles.workspace}`}>
                    {/* Controls */}
                    <div className={styles.controls}>
                        {/* Upload */}
                        <div className={styles.section}>
                            <label className={styles.label}><Upload size={14} /> Upload Gambar</label>
                            <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                                <FileImage size={24} />
                                <span>{imageLoaded ? originalFileName : 'Pilih / Drag / Paste'}</span>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} hidden />
                            </div>
                            {imageLoaded && !isCropping && (
                                <button className={styles.cropBtn} onClick={startCrop}>
                                    <Crop size={14} /> Crop
                                </button>
                            )}
                        </div>

                        {/* Type */}
                        <div className={styles.section}>
                            <label className={styles.label}><Type size={14} /> Jenis Watermark</label>
                            <div className={styles.typeRow}>
                                <button className={`${styles.typeBtn} ${watermarkType === 'tiled' ? styles.active : ''}`} onClick={() => setWatermarkType('tiled')}>
                                    Menyeluruh
                                </button>
                                <button className={`${styles.typeBtn} ${watermarkType === 'single' ? styles.active : ''}`} onClick={() => setWatermarkType('single')}>
                                    Satu Teks
                                </button>
                            </div>
                        </div>

                        {/* Text */}
                        <div className={styles.section}>
                            <label className={styles.label}><Type size={14} /> Teks Watermark</label>
                            <button
                                className={styles.autoBtn}
                                onClick={() => handleAutoTextToggle(true)}
                            >
                                <Check size={14} /> Tambah Verifikasi & Tanggal
                            </button>
                            <textarea
                                className={styles.textarea}
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                placeholder="Tulis teks watermark disini..."
                                rows={3}
                            />
                        </div>

                        {/* Font */}
                        <div className={styles.section}>
                            <label className={styles.label}>Font</label>
                            <select className={styles.select} value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                                {fonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                        </div>

                        {/* Sliders */}
                        <div className={styles.section}>
                            <div className={styles.sliderRow}>
                                <span>Ukuran</span><span className={styles.val}>{fontSize}px</span>
                            </div>
                            <input type="range" min="10" max="100" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className={styles.slider} />

                            <div className={styles.sliderRow}>
                                <span>Rotasi</span><span className={styles.val}>{rotation}°</span>
                            </div>
                            <input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(+e.target.value)} className={styles.slider} />

                            <div className={styles.sliderRow}>
                                <span>Transparansi</span><span className={styles.val}>{Math.round(opacity * 100)}%</span>
                            </div>
                            <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(+e.target.value)} className={styles.slider} />

                            {watermarkType === 'single' && (uploadedImage || croppedImage) && (
                                <>
                                    <div className={styles.sliderRow}>
                                        <span>Posisi X</span><span className={styles.val}>{Math.round(textPosition.x)}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={(croppedImage || uploadedImage).width}
                                        value={textPosition.x}
                                        onChange={(e) => setTextPosition(prev => ({ ...prev, x: +e.target.value }))}
                                        className={styles.slider}
                                    />

                                    <div className={styles.sliderRow}>
                                        <span>Posisi Y</span><span className={styles.val}>{Math.round(textPosition.y)}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={(croppedImage || uploadedImage).height}
                                        value={textPosition.y}
                                        onChange={(e) => setTextPosition(prev => ({ ...prev, y: +e.target.value }))}
                                        className={styles.slider}
                                    />
                                </>
                            )}
                        </div>
                        {/* Color */}
                        <div className={styles.section}>
                            <label className={styles.label}><Palette size={14} /> Warna</label>
                            <div className={styles.colorRow}>
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className={styles.colorPicker} />
                                <span className={styles.colorVal}>{color}</span>
                            </div>
                        </div>

                        {/* Download */}
                        <div className={styles.section}>
                            <label className={styles.label}><Download size={14} /> Download</label>
                            <div className={styles.downloadRow}>
                                <button className={styles.pngBtn} onClick={handleDownloadPNG} disabled={!imageLoaded}>PNG</button>
                                <button className={styles.pdfBtn} onClick={handleDownloadPDF} disabled={!imageLoaded}>PDF</button>
                            </div>
                            <button className={styles.resetBtn} onClick={handleReset}><RotateCcw size={14} /> Reset</button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className={styles.preview} onDragOver={handleDragOver} onDrop={handleDrop}>
                        {isCropping && uploadedImage ? (
                            <div className={styles.cropArea}>
                                <p className={styles.cropHint}>Drag untuk memilih area</p>
                                <div className={styles.cropWrapper} ref={cropWrapperRef}>
                                    <canvas ref={cropCanvasRef} className={styles.cropCanvas}
                                        onMouseDown={handleCropMouseDown} onMouseMove={handleCropMouseMove} onMouseUp={handleCropMouseUp} onMouseLeave={handleCropMouseUp}
                                        onTouchStart={handleCropMouseDown} onTouchMove={handleCropMouseMove} onTouchEnd={handleCropMouseUp}
                                    />
                                </div>
                                <div className={styles.cropBtns}>
                                    <button className={styles.applyBtn} onClick={applyCrop}><Check size={14} /> Apply</button>
                                    <button className={styles.cancelBtn} onClick={cancelCrop}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.canvasWrap} ref={cropWrapperRef}>
                                <div className={styles.canvasContainer} style={canvasMetrics.width > 0 ? { width: canvasMetrics.width, height: canvasMetrics.height } : {}}>
                                    <canvas ref={canvasRef} className={styles.canvas} style={{ display: imageLoaded ? 'block' : 'none' }} />

                                    {imageLoaded && watermarkType === 'single' && canvasMetrics.width > 0 && (
                                        <WatermarkControls
                                            position={textPosition}
                                            dimensions={textDimensions}
                                            rotation={rotation}
                                            scale={textScale}
                                            displayScale={canvasMetrics.scale}
                                            onUpdate={handleWatermarkUpdate}
                                            isActive={true}
                                        />
                                    )}
                                </div>

                                {!imageLoaded && (
                                    <div className={styles.placeholder}>
                                        <FileImage size={48} strokeWidth={1} />
                                        <p>Drag & Drop gambar di sini</p>
                                        <span>atau klik Upload / Ctrl+V</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Trust */}
                <section className={styles.trust}>
                    <div className={styles.trustItem}>🔒 100% Client-Side</div>
                    <div className={styles.trustItem}>🚫 Tanpa Upload Server</div>
                    <div className={styles.trustItem}>⚡ Tanpa Login</div>
                    <div className={styles.trustItem}>🇮🇩 Karya Lokal</div>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
