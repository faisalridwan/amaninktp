'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PenTool, Upload, FileImage, Trash2, Download, Plus, Move, Lock, Shield, X, Check, RotateCcw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function SignaturePage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)
    const [mode, setMode] = useState('create') // 'create' or 'sign'

    // Signature Canvas States
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
    const [penColor, setPenColor] = useState('#000000')
    const [lineWidth, setLineWidth] = useState(3)
    const [hasDrawn, setHasDrawn] = useState(false)

    // Saved Signatures
    const [savedSignatures, setSavedSignatures] = useState([])

    // Document States
    const [document, setDocument] = useState(null)
    const [documentImg, setDocumentImg] = useState(null)
    const [placedSignatures, setPlacedSignatures] = useState([])
    const [selectedSigIndex, setSelectedSigIndex] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [resizing, setResizing] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const docCanvasRef = useRef(null)
    const docContainerRef = useRef(null)
    const fileInputRef = useRef(null)

    const colors = [
        { value: '#000000', label: 'Hitam' },
        { value: '#1e40af', label: 'Biru' },
        { value: '#dc2626', label: 'Merah' },
    ]

    // SIGNATURE CANVAS FUNCTIONS
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

    const getCoords = (e, canvasEl) => {
        if (!canvasEl) return { x: 0, y: 0 }
        const rect = canvasEl.getBoundingClientRect()
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY
        return { x: clientX - rect.left, y: clientY - rect.top }
    }

    const startDrawing = (e) => {
        e.preventDefault()
        const coords = getCoords(e, canvasRef.current)
        setIsDrawing(true)
        setLastPos(coords)
    }

    const draw = (e) => {
        if (!isDrawing) return
        e.preventDefault()

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        const coords = getCoords(e, canvas)

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

    const stopDrawing = () => setIsDrawing(false)

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasDrawn(false)
    }

    const saveSignature = () => {
        const canvas = canvasRef.current
        if (!canvas || !hasDrawn) return

        const dataUrl = canvas.toDataURL('image/png')
        setSavedSignatures(prev => [...prev, { id: Date.now(), dataUrl }])
        clearCanvas()
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

    const deleteSignature = (id) => {
        setSavedSignatures(prev => prev.filter(s => s.id !== id))
    }

    // DOCUMENT FUNCTIONS
    const handleDocUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (ev) => {
            const img = new Image()
            img.onload = () => {
                setDocumentImg(img)
                setDocument(ev.target?.result)
                setPlacedSignatures([])
            }
            img.src = ev.target?.result
        }
        reader.readAsDataURL(file)
    }

    const addSignatureToDoc = (sig) => {
        const newSig = {
            id: Date.now(),
            dataUrl: sig.dataUrl,
            x: 50,
            y: 50,
            width: 150,
            height: 60
        }
        setPlacedSignatures(prev => [...prev, newSig])
    }

    const handleDocMouseDown = (e, sigIndex) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedSigIndex(sigIndex)

        const sig = placedSignatures[sigIndex]
        const coords = getCoords(e, docCanvasRef.current)

        // Check if click is on resize handle (bottom-right corner)
        const handleSize = 20
        const isOnHandle =
            coords.x >= sig.x + sig.width - handleSize &&
            coords.y >= sig.y + sig.height - handleSize

        if (isOnHandle) {
            setResizing(true)
        } else {
            setDragging(true)
            setDragOffset({ x: coords.x - sig.x, y: coords.y - sig.y })
        }
    }

    const handleDocMouseMove = (e) => {
        if (selectedSigIndex === null) return
        e.preventDefault()

        const coords = getCoords(e, docCanvasRef.current)
        const canvas = docCanvasRef.current
        if (!canvas) return

        setPlacedSignatures(prev => {
            const updated = [...prev]
            const sig = updated[selectedSigIndex]

            if (dragging) {
                sig.x = Math.max(0, Math.min(coords.x - dragOffset.x, canvas.width - sig.width))
                sig.y = Math.max(0, Math.min(coords.y - dragOffset.y, canvas.height - sig.height))
            } else if (resizing) {
                sig.width = Math.max(50, coords.x - sig.x)
                sig.height = Math.max(20, coords.y - sig.y)
            }

            return updated
        })
    }

    const handleDocMouseUp = () => {
        setDragging(false)
        setResizing(false)
    }

    const removePlacedSignature = (index) => {
        setPlacedSignatures(prev => prev.filter((_, i) => i !== index))
        setSelectedSigIndex(null)
    }

    // Draw document with signatures
    useEffect(() => {
        const canvas = docCanvasRef.current
        const container = docContainerRef.current
        if (!canvas || !container || !documentImg) return

        // Scale to fit container
        const maxWidth = container.clientWidth
        const maxHeight = 500
        let width = documentImg.width
        let height = documentImg.height

        if (width > maxWidth) {
            height = (maxWidth / width) * height
            width = maxWidth
        }
        if (height > maxHeight) {
            width = (maxHeight / height) * width
            height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Draw document
        ctx.drawImage(documentImg, 0, 0, width, height)

        // Draw placed signatures
        placedSignatures.forEach((sig, index) => {
            const sigImg = new Image()
            sigImg.src = sig.dataUrl
            ctx.drawImage(sigImg, sig.x, sig.y, sig.width, sig.height)

            // Draw selection border if selected
            if (selectedSigIndex === index) {
                ctx.strokeStyle = '#4CAF50'
                ctx.lineWidth = 2
                ctx.setLineDash([5, 5])
                ctx.strokeRect(sig.x - 2, sig.y - 2, sig.width + 4, sig.height + 4)
                ctx.setLineDash([])

                // Draw resize handle
                ctx.fillStyle = '#4CAF50'
                ctx.fillRect(sig.x + sig.width - 8, sig.y + sig.height - 8, 10, 10)
            }
        })
    }, [documentImg, placedSignatures, selectedSigIndex])

    const downloadDocument = () => {
        const canvas = docCanvasRef.current
        if (!canvas) return

        const link = document.createElement('a')
        link.download = `dokumen-bertanda-tangan-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const clearDocument = () => {
        setDocument(null)
        setDocumentImg(null)
        setPlacedSignatures([])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                {/* Security Badge */}
                <div className={styles.securityBadge}>
                    <Lock size={16} />
                    <span>100% Aman & Lokal — Data Anda tidak pernah meninggalkan perangkat ini</span>
                    <Shield size={16} />
                </div>

                <div className={styles.pageHeader}>
                    <h1>✍️ Tanda Tangan Digital</h1>
                    <p>Buat tanda tangan atau tanda tangani dokumen langsung. Semua proses 100% di browser Anda.</p>
                </div>

                {/* Mode Selector */}
                <div className={styles.modeSelector}>
                    <button
                        className={`${styles.modeBtn} ${mode === 'create' ? styles.active : ''}`}
                        onClick={() => setMode('create')}
                    >
                        <PenTool size={18} /> Buat Tanda Tangan
                    </button>
                    <button
                        className={`${styles.modeBtn} ${mode === 'sign' ? styles.active : ''}`}
                        onClick={() => setMode('sign')}
                    >
                        <FileImage size={18} /> Tanda Tangani Dokumen
                    </button>
                </div>

                {mode === 'create' ? (
                    /* CREATE SIGNATURE MODE */
                    <div className={styles.createMode}>
                        <div className={`neu-card no-hover ${styles.workspace}`}>
                            {/* Canvas */}
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
                                <div className={styles.controlRow}>
                                    <div className={styles.controlGroup}>
                                        <label>Warna</label>
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

                                    <div className={styles.controlGroup}>
                                        <label>Ketebalan <span>{lineWidth}px</span></label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="8"
                                            value={lineWidth}
                                            onChange={(e) => setLineWidth(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className={styles.buttonRow}>
                                    <button className={styles.btnSecondary} onClick={clearCanvas}>
                                        <RotateCcw size={16} /> Hapus
                                    </button>
                                    <button
                                        className={styles.btnPrimary}
                                        onClick={saveSignature}
                                        disabled={!hasDrawn}
                                    >
                                        <Plus size={16} /> Simpan
                                    </button>
                                    <button
                                        className={styles.btnPrimary}
                                        onClick={downloadSignature}
                                        disabled={!hasDrawn}
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Saved Signatures */}
                        {savedSignatures.length > 0 && (
                            <div className={styles.savedSection}>
                                <h3>Tanda Tangan Tersimpan ({savedSignatures.length})</h3>
                                <p className={styles.savedHint}>Klik untuk gunakan di mode "Tanda Tangani Dokumen"</p>
                                <div className={styles.savedGrid}>
                                    {savedSignatures.map((sig) => (
                                        <div key={sig.id} className={styles.savedItem}>
                                            <img src={sig.dataUrl} alt="Signature" />
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => deleteSignature(sig.id)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* SIGN DOCUMENT MODE */
                    <div className={styles.signMode}>
                        {!document ? (
                            <div
                                className={styles.uploadArea}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={48} />
                                <h3>Upload Dokumen</h3>
                                <p>Klik atau drag & drop file gambar (PNG, JPG)</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDocUpload}
                                    hidden
                                />
                            </div>
                        ) : (
                            <div className={styles.signWorkspace}>
                                {/* Signature Picker */}
                                <div className={styles.sigPicker}>
                                    <h4>Pilih Tanda Tangan</h4>
                                    {savedSignatures.length === 0 ? (
                                        <div className={styles.noSigs}>
                                            <p>Belum ada tanda tangan tersimpan</p>
                                            <button
                                                className={styles.btnSmall}
                                                onClick={() => setMode('create')}
                                            >
                                                <Plus size={14} /> Buat Dulu
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.sigList}>
                                            {savedSignatures.map((sig) => (
                                                <button
                                                    key={sig.id}
                                                    className={styles.sigItem}
                                                    onClick={() => addSignatureToDoc(sig)}
                                                    title="Klik untuk tambahkan"
                                                >
                                                    <img src={sig.dataUrl} alt="Signature" />
                                                    <span><Plus size={12} /></span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Document Canvas */}
                                <div className={styles.docArea}>
                                    <div
                                        ref={docContainerRef}
                                        className={styles.docContainer}
                                        onMouseMove={handleDocMouseMove}
                                        onMouseUp={handleDocMouseUp}
                                        onMouseLeave={handleDocMouseUp}
                                        onTouchMove={handleDocMouseMove}
                                        onTouchEnd={handleDocMouseUp}
                                    >
                                        <canvas
                                            ref={docCanvasRef}
                                            className={styles.docCanvas}
                                        />

                                        {/* Interactive signature overlays */}
                                        {placedSignatures.map((sig, index) => (
                                            <div
                                                key={sig.id}
                                                className={`${styles.sigOverlay} ${selectedSigIndex === index ? styles.selected : ''}`}
                                                style={{
                                                    left: sig.x,
                                                    top: sig.y,
                                                    width: sig.width,
                                                    height: sig.height
                                                }}
                                                onMouseDown={(e) => handleDocMouseDown(e, index)}
                                                onTouchStart={(e) => handleDocMouseDown(e, index)}
                                            >
                                                <button
                                                    className={styles.removeSig}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        removePlacedSignature(index)
                                                    }}
                                                >
                                                    <X size={12} />
                                                </button>
                                                <div className={styles.resizeHandle}>
                                                    <Move size={10} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.docActions}>
                                        <button className={styles.btnSecondary} onClick={clearDocument}>
                                            <Trash2 size={16} /> Ganti Dokumen
                                        </button>
                                        <button
                                            className={styles.btnPrimary}
                                            onClick={downloadDocument}
                                            disabled={placedSignatures.length === 0}
                                        >
                                            <Download size={16} /> Download Hasil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.tips}>
                    <p>
                        💡 <strong>Tip:</strong> {mode === 'create'
                            ? 'Simpan beberapa tanda tangan untuk digunakan di mode "Tanda Tangani Dokumen".'
                            : 'Drag untuk memindahkan, tarik sudut kanan bawah untuk resize. Tambahkan beberapa tanda tangan sesuai kebutuhan.'}
                    </p>
                </div>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
