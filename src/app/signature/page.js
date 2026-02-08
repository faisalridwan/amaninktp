'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PenTool, Upload, Trash2, Download, Plus, Move, Lock, X, RotateCcw, FileText, Image as ImageIcon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function SignaturePage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    // Signature Canvas States
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
    const [penColor, setPenColor] = useState('#000000')
    const [lineWidth, setLineWidth] = useState(3)
    const [hasDrawn, setHasDrawn] = useState(false)

    // Saved Signatures
    const [savedSignatures, setSavedSignatures] = useState([])

    // Document States
    const [documentImg, setDocumentImg] = useState(null)
    const [documentName, setDocumentName] = useState('')
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

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect()
            const ctx = canvas.getContext('2d')

            // Save current drawing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            canvas.width = rect.width
            canvas.height = rect.height

            // Restore drawing
            ctx.putImageData(imageData, 0, 0)
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    // SIGNATURE CANVAS FUNCTIONS
    const getCoords = useCallback((e, canvasEl) => {
        if (!canvasEl) return { x: 0, y: 0 }
        const rect = canvasEl.getBoundingClientRect()
        let clientX, clientY

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX
            clientY = e.changedTouches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        }
    }, [])

    const startDrawing = useCallback((e) => {
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return

        const coords = getCoords(e, canvas)
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)

        setIsDrawing(true)
        setLastPos(coords)
    }, [getCoords])

    const draw = useCallback((e) => {
        if (!isDrawing) return
        e.preventDefault()

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        const coords = getCoords(e, canvas)

        ctx.strokeStyle = penColor
        ctx.lineWidth = lineWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)

        setLastPos(coords)
        setHasDrawn(true)
    }, [isDrawing, penColor, lineWidth, getCoords])

    const stopDrawing = useCallback(() => {
        if (isDrawing) {
            const canvas = canvasRef.current
            const ctx = canvas?.getContext('2d')
            if (ctx) ctx.beginPath()
        }
        setIsDrawing(false)
    }, [isDrawing])

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
        if (!canvas || !hasDrawn) return

        const link = document.createElement('a')
        link.download = `ttd-amaninktp-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const deleteSignature = (id) => {
        setSavedSignatures(prev => prev.filter(s => s.id !== id))
    }

    // DOCUMENT FUNCTIONS
    const handleDocUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setDocumentName(file.name)

        if (file.type === 'application/pdf') {
            // For PDF we'll show a message - full PDF support would require server-side processing
            alert('PDF detected! Untuk hasil terbaik, silahkan convert PDF ke gambar (PNG/JPG) terlebih dahulu menggunakan tools online, lalu upload gambar tersebut.')
            if (fileInputRef.current) fileInputRef.current.value = ''
            setDocumentName('')
            return
        }

        // Handle Image
        const reader = new FileReader()
        reader.onload = (ev) => {
            const img = new Image()
            img.onload = () => {
                setDocumentImg(img)
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
        const canvas = docCanvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        let clientX, clientY
        if (e.touches) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        const x = (clientX - rect.left) * scaleX
        const y = (clientY - rect.top) * scaleY

        const handleSize = 20
        const isOnHandle =
            x >= sig.x + sig.width - handleSize &&
            y >= sig.y + sig.height - handleSize

        if (isOnHandle) {
            setResizing(true)
        } else {
            setDragging(true)
            setDragOffset({ x: x - sig.x, y: y - sig.y })
        }
    }

    const handleDocMouseMove = (e) => {
        if (selectedSigIndex === null || (!dragging && !resizing)) return
        e.preventDefault()

        const canvas = docCanvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        let clientX, clientY
        if (e.touches) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        const x = (clientX - rect.left) * scaleX
        const y = (clientY - rect.top) * scaleY

        setPlacedSignatures(prev => {
            const updated = [...prev]
            const sig = { ...updated[selectedSigIndex] }

            if (dragging) {
                sig.x = Math.max(0, Math.min(x - dragOffset.x, canvas.width - sig.width))
                sig.y = Math.max(0, Math.min(y - dragOffset.y, canvas.height - sig.height))
            } else if (resizing) {
                sig.width = Math.max(50, x - sig.x)
                sig.height = Math.max(20, y - sig.y)
            }

            updated[selectedSigIndex] = sig
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

        const maxWidth = container.clientWidth
        const maxHeight = 600
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

        canvas.width = documentImg.width
        canvas.height = documentImg.height
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(documentImg, 0, 0, documentImg.width, documentImg.height)

        placedSignatures.forEach((sig, index) => {
            const sigImg = new Image()
            sigImg.src = sig.dataUrl
            ctx.drawImage(sigImg, sig.x, sig.y, sig.width, sig.height)

            if (selectedSigIndex === index) {
                ctx.strokeStyle = '#4CAF50'
                ctx.lineWidth = 3
                ctx.setLineDash([8, 8])
                ctx.strokeRect(sig.x - 3, sig.y - 3, sig.width + 6, sig.height + 6)
                ctx.setLineDash([])

                ctx.fillStyle = '#4CAF50'
                ctx.fillRect(sig.x + sig.width - 12, sig.y + sig.height - 12, 16, 16)
            }
        })
    }, [documentImg, placedSignatures, selectedSigIndex])

    const downloadDocumentAsPDF = async () => {
        const canvas = docCanvasRef.current
        if (!canvas) return

        const { jsPDF } = await import('jspdf')

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        })

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.save(`dokumen-bertandatangan-${Date.now()}.pdf`)
    }

    const downloadDocumentAsPNG = () => {
        const canvas = docCanvasRef.current
        if (!canvas) return

        const link = document.createElement('a')
        link.download = `dokumen-bertandatangan-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const clearDocument = () => {
        setDocumentImg(null)
        setDocumentName('')
        setPlacedSignatures([])
        setSelectedSigIndex(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <div className={styles.pageHeader}>
                    <h1>✍️ Tanda Tangan Digital</h1>
                    <p>Buat tanda tangan dan tambahkan langsung ke dokumen Anda</p>
                    <div className={styles.securityBadge}>
                        <Lock size={14} />
                        <span>100% Aman & Lokal — Data Anda tidak pernah meninggalkan perangkat ini</span>
                    </div>
                </div>

                {/* SECTION 1: Create Signature */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.stepNum}>1</span>
                        <div>
                            <h2>Buat Tanda Tangan</h2>
                            <p>Gambar tanda tangan Anda di bawah ini</p>
                        </div>
                    </div>

                    <div className={styles.signatureCard}>
                        <div
                            ref={containerRef}
                            className={styles.signatureCanvas}
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
                                    <PenTool size={24} />
                                    <span>Gambar tanda tangan di sini</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.signatureControls}>
                            <div className={styles.controlsLeft}>
                                <div className={styles.colorPicker}>
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
                                <div className={styles.widthControl}>
                                    <span>{lineWidth}px</span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        value={lineWidth}
                                        onChange={(e) => setLineWidth(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className={styles.controlsRight}>
                                <button className={styles.btnIcon} onClick={clearCanvas} title="Hapus">
                                    <RotateCcw size={18} />
                                </button>
                                <button
                                    className={styles.btnSave}
                                    onClick={saveSignature}
                                    disabled={!hasDrawn}
                                >
                                    <Plus size={16} /> Simpan
                                </button>
                                <button
                                    className={styles.btnDownload}
                                    onClick={downloadSignature}
                                    disabled={!hasDrawn}
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Saved Signatures */}
                        {savedSignatures.length > 0 && (
                            <div className={styles.savedSignatures}>
                                <span className={styles.savedLabel}>Tersimpan:</span>
                                <div className={styles.savedList}>
                                    {savedSignatures.map((sig) => (
                                        <div key={sig.id} className={styles.savedItem}>
                                            <img src={sig.dataUrl} alt="Signature" />
                                            <button onClick={() => deleteSignature(sig.id)}>
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 2: Add to Document */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.stepNum}>2</span>
                        <div>
                            <h2>Tambahkan ke Dokumen</h2>
                            <p>Upload dokumen (PDF/Gambar) dan letakkan tanda tangan</p>
                        </div>
                    </div>

                    {!documentImg ? (
                        <div
                            className={styles.uploadArea}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className={styles.uploadIcon}>
                                <Upload size={32} />
                            </div>
                            <div className={styles.uploadText}>
                                <h3>Upload Dokumen</h3>
                                <p>PDF, PNG, JPG (maks. 10MB)</p>
                            </div>
                            <div className={styles.uploadFormats}>
                                <span><FileText size={14} /> PDF</span>
                                <span><ImageIcon size={14} /> PNG</span>
                                <span><ImageIcon size={14} /> JPG</span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleDocUpload}
                                hidden
                            />
                        </div>
                    ) : (
                        <div className={styles.documentWorkspace}>
                            {/* Document Info */}
                            <div className={styles.docInfo}>
                                <FileText size={16} />
                                <span>{documentName}</span>
                                <button onClick={clearDocument}>
                                    <X size={14} /> Ganti
                                </button>
                            </div>

                            {/* Signature Picker */}
                            {savedSignatures.length > 0 && (
                                <div className={styles.sigPicker}>
                                    <span>Klik untuk tambah:</span>
                                    {savedSignatures.map((sig) => (
                                        <button
                                            key={sig.id}
                                            className={styles.sigPickerItem}
                                            onClick={() => addSignatureToDoc(sig)}
                                        >
                                            <img src={sig.dataUrl} alt="Signature" />
                                            <Plus size={12} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {savedSignatures.length === 0 && (
                                <div className={styles.noSigsWarning}>
                                    ⚠️ Buat dan simpan tanda tangan terlebih dahulu di langkah 1
                                </div>
                            )}

                            {/* Document Canvas */}
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
                                    onMouseDown={(e) => {
                                        if (selectedSigIndex !== null) {
                                            setSelectedSigIndex(null)
                                        }
                                    }}
                                />

                                {/* Interactive overlays for signatures */}
                                {placedSignatures.map((sig, index) => {
                                    const canvas = docCanvasRef.current
                                    if (!canvas) return null

                                    const rect = canvas.getBoundingClientRect()
                                    const scaleX = rect.width / canvas.width
                                    const scaleY = rect.height / canvas.height

                                    return (
                                        <div
                                            key={sig.id}
                                            className={`${styles.sigOverlay} ${selectedSigIndex === index ? styles.selected : ''}`}
                                            style={{
                                                left: sig.x * scaleX,
                                                top: sig.y * scaleY,
                                                width: sig.width * scaleX,
                                                height: sig.height * scaleY
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
                                                <X size={10} />
                                            </button>
                                            <div className={styles.resizeHandle}>
                                                <Move size={8} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {placedSignatures.length > 0 && (
                                <div className={styles.docTip}>
                                    💡 Drag untuk pindahkan, tarik sudut kanan bawah untuk resize
                                </div>
                            )}

                            {/* Download Buttons */}
                            <div className={styles.downloadActions}>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={downloadDocumentAsPDF}
                                    disabled={placedSignatures.length === 0}
                                >
                                    <Download size={18} /> Download PDF
                                </button>
                                <button
                                    className={styles.btnSecondary}
                                    onClick={downloadDocumentAsPNG}
                                    disabled={placedSignatures.length === 0}
                                >
                                    <Download size={18} /> Download PNG
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
