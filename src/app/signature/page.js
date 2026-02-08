'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PenTool, Upload, Trash2, Download, Plus, Move, Lock, X, RotateCcw, FileText, Image as ImageIcon, ChevronDown } from 'lucide-react'
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
    const [documentPages, setDocumentPages] = useState([]) // Array of page images
    const [documentName, setDocumentName] = useState('')
    const [placedSignatures, setPlacedSignatures] = useState([]) // {id, pageIndex, dataUrl, x, y, width, height}
    const [selectedSigIndex, setSelectedSigIndex] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [resizing, setResizing] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isLoadingPdf, setIsLoadingPdf] = useState(false)

    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const pageCanvasRefs = useRef([])
    const pageContainerRefs = useRef([])
    const fileInputRef = useRef(null)
    const docScrollRef = useRef(null)

    const colors = [
        { value: '#000000', label: 'Hitam' },
        { value: '#1e40af', label: 'Biru' },
        { value: '#dc2626', label: 'Merah' },
    ]

    // Initialize signature canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect()
            const ctx = canvas.getContext('2d')

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            canvas.width = rect.width
            canvas.height = rect.height
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

        return { x: clientX - rect.left, y: clientY - rect.top }
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

    // Load PDF.js from CDN
    const loadPdfJs = () => {
        return new Promise((resolve, reject) => {
            if (window.pdfjsLib) {
                resolve(window.pdfjsLib)
                return
            }

            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
                resolve(window.pdfjsLib)
            }
            script.onerror = reject
            document.head.appendChild(script)
        })
    }

    // DOCUMENT FUNCTIONS
    const handleDocUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setDocumentName(file.name)
        setPlacedSignatures([])

        if (file.type === 'application/pdf') {
            setIsLoadingPdf(true)
            try {
                const pdfjsLib = await loadPdfJs()
                const arrayBuffer = await file.arrayBuffer()
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

                const pages = []
                const scale = 2 // High quality

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i)
                    const viewport = page.getViewport({ scale })

                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = viewport.width
                    canvas.height = viewport.height

                    await page.render({ canvasContext: ctx, viewport }).promise

                    const img = new Image()
                    await new Promise((resolve) => {
                        img.onload = resolve
                        img.src = canvas.toDataURL('image/png')
                    })

                    pages.push(img)
                }

                setDocumentPages(pages)
            } catch (err) {
                console.error('PDF error:', err)
                alert('Gagal membaca PDF. Pastikan file tidak corrupt.')
                if (fileInputRef.current) fileInputRef.current.value = ''
                setDocumentName('')
            } finally {
                setIsLoadingPdf(false)
            }
            return
        }

        // Handle Image
        const reader = new FileReader()
        reader.onload = (ev) => {
            const img = new Image()
            img.onload = () => {
                setDocumentPages([img])
            }
            img.src = ev.target?.result
        }
        reader.readAsDataURL(file)
    }

    const addSignatureToPage = (sig, pageIndex) => {
        const newSig = {
            id: Date.now(),
            pageIndex,
            dataUrl: sig.dataUrl,
            x: 100,
            y: 100,
            width: 200,
            height: 80
        }
        setPlacedSignatures(prev => [...prev, newSig])
    }

    const handleSigMouseDown = (e, sigIndex, pageIndex) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedSigIndex(sigIndex)

        const sig = placedSignatures[sigIndex]
        const canvas = pageCanvasRefs.current[pageIndex]
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

        const handleSize = 30
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

    const handleSigMouseMove = (e, pageIndex) => {
        if (selectedSigIndex === null || (!dragging && !resizing)) return

        const sig = placedSignatures[selectedSigIndex]
        if (sig.pageIndex !== pageIndex) return

        e.preventDefault()

        const canvas = pageCanvasRefs.current[pageIndex]
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
            const updatedSig = { ...updated[selectedSigIndex] }

            if (dragging) {
                updatedSig.x = Math.max(0, Math.min(x - dragOffset.x, canvas.width - updatedSig.width))
                updatedSig.y = Math.max(0, Math.min(y - dragOffset.y, canvas.height - updatedSig.height))
            } else if (resizing) {
                updatedSig.width = Math.max(60, x - updatedSig.x)
                updatedSig.height = Math.max(30, y - updatedSig.y)
            }

            updated[selectedSigIndex] = updatedSig
            return updated
        })
    }

    const handleMouseUp = () => {
        setDragging(false)
        setResizing(false)
    }

    const removePlacedSignature = (index) => {
        setPlacedSignatures(prev => prev.filter((_, i) => i !== index))
        setSelectedSigIndex(null)
    }

    // Draw pages with signatures
    useEffect(() => {
        documentPages.forEach((pageImg, pageIndex) => {
            const canvas = pageCanvasRefs.current[pageIndex]
            const container = pageContainerRefs.current[pageIndex]
            if (!canvas || !container) return

            // Full width display
            const containerWidth = container.clientWidth
            const aspectRatio = pageImg.height / pageImg.width
            const displayWidth = containerWidth
            const displayHeight = containerWidth * aspectRatio

            canvas.width = pageImg.width
            canvas.height = pageImg.height
            canvas.style.width = `${displayWidth}px`
            canvas.style.height = `${displayHeight}px`

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.drawImage(pageImg, 0, 0, pageImg.width, pageImg.height)

            // Draw signatures for this page
            placedSignatures
                .filter(sig => sig.pageIndex === pageIndex)
                .forEach((sig, localIndex) => {
                    const globalIndex = placedSignatures.findIndex(s => s.id === sig.id)
                    const sigImg = new Image()
                    sigImg.src = sig.dataUrl
                    ctx.drawImage(sigImg, sig.x, sig.y, sig.width, sig.height)

                    if (selectedSigIndex === globalIndex) {
                        ctx.strokeStyle = '#4CAF50'
                        ctx.lineWidth = 4
                        ctx.setLineDash([10, 10])
                        ctx.strokeRect(sig.x - 4, sig.y - 4, sig.width + 8, sig.height + 8)
                        ctx.setLineDash([])

                        ctx.fillStyle = '#4CAF50'
                        ctx.fillRect(sig.x + sig.width - 16, sig.y + sig.height - 16, 20, 20)
                    }
                })
        })
    }, [documentPages, placedSignatures, selectedSigIndex])

    const downloadDocumentAsPDF = async () => {
        if (documentPages.length === 0) return

        const { jsPDF } = await import('jspdf')

        let pdf = null

        for (let i = 0; i < documentPages.length; i++) {
            const canvas = pageCanvasRefs.current[i]
            if (!canvas) continue

            const imgData = canvas.toDataURL('image/png')
            const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait'

            if (i === 0) {
                pdf = new jsPDF({
                    orientation,
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                })
            } else {
                pdf.addPage([canvas.width, canvas.height], orientation)
            }

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        }

        if (pdf) {
            pdf.save(`dokumen-bertandatangan-${Date.now()}.pdf`)
        }
    }

    const downloadDocumentAsPNG = () => {
        // Download first page as PNG
        const canvas = pageCanvasRefs.current[0]
        if (!canvas) return

        const link = document.createElement('a')
        link.download = `dokumen-bertandatangan-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const clearDocument = () => {
        setDocumentPages([])
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
                                    <PenTool size={28} />
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
                                <button className={styles.btnSave} onClick={saveSignature} disabled={!hasDrawn}>
                                    <Plus size={16} /> Simpan
                                </button>
                                <button className={styles.btnDownload} onClick={downloadSignature} disabled={!hasDrawn}>
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>

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

                    {documentPages.length === 0 ? (
                        <div
                            className={styles.uploadArea}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isLoadingPdf ? (
                                <div className={styles.loading}>
                                    <div className={styles.spinner}></div>
                                    <p>Memproses PDF...</p>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.uploadIcon}>
                                        <Upload size={32} />
                                    </div>
                                    <div className={styles.uploadText}>
                                        <h3>Upload Dokumen</h3>
                                        <p>PDF (multi-halaman didukung), PNG, JPG</p>
                                    </div>
                                    <div className={styles.uploadFormats}>
                                        <span><FileText size={14} /> PDF</span>
                                        <span><ImageIcon size={14} /> PNG</span>
                                        <span><ImageIcon size={14} /> JPG</span>
                                    </div>
                                </>
                            )}
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
                            <div className={styles.docInfo}>
                                <FileText size={16} />
                                <span>{documentName} ({documentPages.length} halaman)</span>
                                <button onClick={clearDocument}>
                                    <X size={14} /> Ganti
                                </button>
                            </div>

                            {savedSignatures.length > 0 && (
                                <div className={styles.sigPicker}>
                                    <span>Pilih tanda tangan, lalu klik pada halaman:</span>
                                    {savedSignatures.map((sig) => (
                                        <button
                                            key={sig.id}
                                            className={styles.sigPickerItem}
                                            onClick={() => {
                                                // Add to first visible page (page 0 by default)
                                                addSignatureToPage(sig, 0)
                                            }}
                                        >
                                            <img src={sig.dataUrl} alt="Signature" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {savedSignatures.length === 0 && (
                                <div className={styles.noSigsWarning}>
                                    ⚠️ Buat dan simpan tanda tangan terlebih dahulu di langkah 1
                                </div>
                            )}

                            {/* Scrollable Document Pages */}
                            <div ref={docScrollRef} className={styles.docScroll}>
                                {documentPages.map((_, pageIndex) => (
                                    <div
                                        key={pageIndex}
                                        className={styles.pageWrapper}
                                        ref={el => pageContainerRefs.current[pageIndex] = el}
                                    >
                                        <div className={styles.pageNumber}>Halaman {pageIndex + 1}</div>
                                        <div
                                            className={styles.pageContainer}
                                            onMouseMove={(e) => handleSigMouseMove(e, pageIndex)}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseUp}
                                            onTouchMove={(e) => handleSigMouseMove(e, pageIndex)}
                                            onTouchEnd={handleMouseUp}
                                            onClick={() => {
                                                // Add signature to this page if one is saved
                                                if (savedSignatures.length > 0 && placedSignatures.filter(s => s.pageIndex === pageIndex).length === 0) {
                                                    // Show hint that user can add signature
                                                }
                                            }}
                                        >
                                            <canvas
                                                ref={el => pageCanvasRefs.current[pageIndex] = el}
                                                className={styles.pageCanvas}
                                            />

                                            {/* Signature overlays for this page */}
                                            {placedSignatures
                                                .map((sig, globalIndex) => ({ sig, globalIndex }))
                                                .filter(({ sig }) => sig.pageIndex === pageIndex)
                                                .map(({ sig, globalIndex }) => {
                                                    const canvas = pageCanvasRefs.current[pageIndex]
                                                    if (!canvas) return null

                                                    const rect = canvas.getBoundingClientRect?.() || { width: canvas.offsetWidth, height: canvas.offsetHeight }
                                                    const scaleX = rect.width / canvas.width
                                                    const scaleY = rect.height / canvas.height

                                                    return (
                                                        <div
                                                            key={sig.id}
                                                            className={`${styles.sigOverlay} ${selectedSigIndex === globalIndex ? styles.selected : ''}`}
                                                            style={{
                                                                left: sig.x * scaleX,
                                                                top: sig.y * scaleY,
                                                                width: sig.width * scaleX,
                                                                height: sig.height * scaleY
                                                            }}
                                                            onMouseDown={(e) => handleSigMouseDown(e, globalIndex, pageIndex)}
                                                            onTouchStart={(e) => handleSigMouseDown(e, globalIndex, pageIndex)}
                                                        >
                                                            <button
                                                                className={styles.removeSig}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    removePlacedSignature(globalIndex)
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

                                            {/* Add signature button for this page */}
                                            {savedSignatures.length > 0 && (
                                                <div className={styles.addSigToPage}>
                                                    <button
                                                        onClick={() => addSignatureToPage(savedSignatures[0], pageIndex)}
                                                        title="Tambah tanda tangan ke halaman ini"
                                                    >
                                                        <Plus size={14} /> Tambah TTD
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {placedSignatures.length > 0 && (
                                <div className={styles.docTip}>
                                    💡 Drag untuk pindahkan, tarik sudut kanan bawah untuk resize
                                </div>
                            )}

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
                                    <Download size={18} /> Download PNG (Halaman 1)
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
