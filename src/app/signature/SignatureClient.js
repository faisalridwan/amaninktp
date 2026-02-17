'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PenTool, Upload, Trash2, Download, Plus, Move, Lock, X, RotateCcw, FileText, Image as ImageIcon, ChevronDown, ZoomIn, ZoomOut, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'

export default function SignaturePage() {
    // Signature Canvas States
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
    const [penColor, setPenColor] = useState('#000000')
    const [lineWidth, setLineWidth] = useState(3)
    const [hasDrawn, setHasDrawn] = useState(false)
    const [canvasHeight, setCanvasHeight] = useState(350)

    // Saved Signatures
    const [savedSignatures, setSavedSignatures] = useState([])
    const [activeSignatureId, setActiveSignatureId] = useState(null)

    // Document States
    const [documentPages, setDocumentPages] = useState([]) // Array of page images
    const [documentName, setDocumentName] = useState('')
    const [placedSignatures, setPlacedSignatures] = useState([]) // {id, pageIndex, dataUrl, x, y, width, height}
    const [selectedSigIndex, setSelectedSigIndex] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [resizing, setResizing] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isLoadingPdf, setIsLoadingPdf] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)

    // Drag Selection State
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectionBox, setSelectionBox] = useState(null) // { pageIndex, startX, startY, x, y, width, height }

    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    // Initialize signature canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect()
            const ctx = canvas.getContext('2d', { willReadFrequently: true })

            // Save current content if needed, but usually clear on resize is safer or just redraw
            // For simple signature, we might lose it on resize, which is acceptable or we could save dataUrl
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            canvas.width = rect.width
            canvas.height = rect.height

            // ctx.putImageData(imageData, 0, 0) 
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    // SIGNATURE CANVAS FUNCTIONS
    const getCoords = useCallback((e, canvasEl) => {
        if (!canvasEl) return { x: 0, y: 0 }
        const rect = canvasEl.getBoundingClientRect()

        const scaleX = canvasEl.width / rect.width
        const scaleY = canvasEl.height / rect.height

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
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        }
    }, [])

    const startDrawing = useCallback((e) => {
        // Prevent default only if inside canvas to avoid blocking scroll elsewhere
        if (e.target === canvasRef.current) {
            e.preventDefault()
        }

        const canvas = canvasRef.current
        if (!canvas) return

        const coords = getCoords(e, canvas)
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)

        setIsDrawing(true)
        setLastPos(coords)
    }, [getCoords])

    const draw = useCallback((e) => {
        if (!isDrawing) return
        if (e.target === canvasRef.current) {
            e.preventDefault()
        }

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d', { willReadFrequently: true })
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
            const ctx = canvas?.getContext('2d', { willReadFrequently: true })
            if (ctx) ctx.beginPath()
        }
        setIsDrawing(false)
    }, [isDrawing])

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasDrawn(false)
    }

    // Handle Height Change - Preserving Content
    const handleHeightChange = (e) => {
        const newHeight = Number(e.target.value)
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d', { willReadFrequently: true })

        if (!canvas || !ctx) {
            setCanvasHeight(newHeight)
            return
        }

        // Save current content
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        setCanvasHeight(newHeight)

        // Restore content after resize (React will update height prop, but we need to redraw)
        // We use setTimeout to ensure React render cycle has updated the canvas DOM element size
        setTimeout(() => {
            const container = containerRef.current
            const rect = container.getBoundingClientRect()

            // Explicitly update canvas attributes to match new container size
            // This prevents CSS stretching
            canvas.width = rect.width
            canvas.height = rect.height // This clears the canvas

            const newCtx = canvas.getContext('2d', { willReadFrequently: true })

            // Put original image back at 0,0 (top-left)
            // Existing signature stays at top, new space is added at bottom
            newCtx.putImageData(imageData, 0, 0)
        }, 0)
    }

    const saveSignature = () => {
        const canvas = canvasRef.current
        if (!canvas || !hasDrawn) return

        const dataUrl = canvas.toDataURL('image/png')
        const newId = Date.now()
        setSavedSignatures(prev => [...prev, { id: newId, dataUrl }])
        setActiveSignatureId(newId) // Auto-select new signature
        clearCanvas()
    }

    const downloadSignature = () => {
        const canvas = canvasRef.current
        if (!canvas || !hasDrawn) return

        const link = document.createElement('a')
        link.download = `ttd-amanindata-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const deleteSignature = (id) => {
        setSavedSignatures(prev => prev.filter(s => s.id !== id))
        if (activeSignatureId === id) {
            setActiveSignatureId(null)
        }
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
        setZoomLevel(1)

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
                    const ctx = canvas.getContext('2d', { willReadFrequently: true })
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
    const getVisiblePageIndex = () => {
        if (!docScrollRef.current) return 0;

        const scrollContainer = docScrollRef.current;
        const scrollCenter = scrollContainer.scrollTop + (scrollContainer.clientHeight / 2);

        let closestIndex = 0;
        let minDiff = Infinity;

        // Find which page container is closest to the center of the scroll view
        pageContainerRefs.current.forEach((container, index) => {
            if (!container) return;
            // Get offset relative to scroll container
            const containerTop = container.offsetTop;
            const containerCenter = containerTop + (container.clientHeight / 2);

            const diff = Math.abs(containerCenter - scrollCenter);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    const addSignatureToPage = (sigId, pageIndex, customRect = null) => {
        // Default to active signature or first saved signature
        let sig;
        if (sigId) {
            sig = savedSignatures.find(s => s.id === sigId);
        } else if (activeSignatureId) {
            sig = savedSignatures.find(s => s.id === activeSignatureId);
        } else if (savedSignatures.length > 0) {
            sig = savedSignatures[0];
            setActiveSignatureId(sig.id); // Auto-activate if we used forced fallback
        }

        if (!sig) {
            alert("Buat tanda tangan terlebih dahulu/pilih tanda tangan!");
            return;
        }

        // Default to provided page index or visible page
        const targetPageIndex = pageIndex !== undefined ? pageIndex : getVisiblePageIndex();

        let defaultX = 100;
        let defaultY = 100;

        // If triggered from button, place near bottom-right
        if (customRect?.fromButton) {
            const canvas = pageCanvasRefs.current[targetPageIndex];
            if (canvas) {
                // Button is at bottom-right. Place signature slightly above and to the left.
                // Signature default size is 200x80.
                defaultX = Math.max(0, canvas.width - 250);
                defaultY = Math.max(0, canvas.height - 150);
            }
        }

        let newSig = {
            id: Date.now(),
            pageIndex: targetPageIndex,
            dataUrl: sig.dataUrl,
            width: 200,
            height: 80,
            x: defaultX,
            y: defaultY
        }

        if (customRect && !customRect.fromButton) {
            newSig.x = customRect.x
            newSig.y = customRect.y
            newSig.width = customRect.width
            newSig.height = customRect.height
        }

        setPlacedSignatures(prev => [...prev, newSig])

        // Auto-select the newly added signature for adjustment
        // We find index by length since it's added to end
        setTimeout(() => setSelectedSigIndex(placedSignatures.length), 0);
    }
    const pageCanvasRefs = useRef([])
    const pageContainerRefs = useRef([])
    const fileInputRef = useRef(null)
    const docScrollRef = useRef(null)
    const workspaceRef = useRef(null)

    const colors = [
        { value: '#000000', label: 'Hitam' },
        { value: '#1e40af', label: 'Biru' },
        { value: '#dc2626', label: 'Merah' },
    ]


    const handlePageMouseDown = (e, pageIndex) => {
        // Only start selection if we have an active signature
        // We allow clicking background even if a sig is selected (it will just deselect it)
        if (!activeSignatureId) return

        // Prevent default text selection
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
            // Don't prevent default immediately if it might interfere with other things, 
            // but here we want to draw a box.
        }

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

        setIsSelecting(true)
        setSelectedSigIndex(null) // Deselect any active signature
        setSelectionBox({
            pageIndex,
            startX: x,
            startY: y,
            x,
            y,
            width: 0,
            height: 0
        })
    }

    const handleSigMouseDown = (e, sigIndex, pageIndex) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedSigIndex(sigIndex)

        const sig = placedSignatures[sigIndex]
        const canvas = pageCanvasRefs.current[pageIndex]
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        // Determine scale relative to the actual displayed size vs canvas internal resolution
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
        // Handle Selection Drawing
        if (isSelecting && selectionBox) {
            if (selectionBox.pageIndex !== pageIndex) return
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

            const currentX = (clientX - rect.left) * scaleX
            const currentY = (clientY - rect.top) * scaleY

            const width = Math.abs(currentX - selectionBox.startX)
            const height = Math.abs(currentY - selectionBox.startY)
            const x = Math.min(currentX, selectionBox.startX)
            const y = Math.min(currentY, selectionBox.startY)

            setSelectionBox(prev => ({
                ...prev,
                x,
                y,
                width,
                height
            }))
            return
        }

        if (selectedSigIndex === null || (!dragging && !resizing)) return

        const sig = placedSignatures[selectedSigIndex]
        if (sig.pageIndex !== pageIndex) return

        e.preventDefault() // Critical to prevent scroll/zoom while dragging

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
        if (isSelecting && selectionBox) {
            // Finalize selection if valid
            if (selectionBox.width > 20 && selectionBox.height > 20 && activeSignatureId) {
                addSignatureToPage(activeSignatureId, selectionBox.pageIndex, {
                    x: selectionBox.x,
                    y: selectionBox.y,
                    width: selectionBox.width,
                    height: selectionBox.height
                })
            }
            setIsSelecting(false)
            setSelectionBox(null)
        }
        setDragging(false)
        setResizing(false)
    }

    const removePlacedSignature = (index) => {
        setPlacedSignatures(prev => prev.filter((_, i) => i !== index))
        setSelectedSigIndex(null)
    }

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2.0))
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))

    // Draw pages with signatures
    useEffect(() => {
        // Calculate base width from viewport, not from current container width to avoid infinite growth
        // Use docScrollRef or window width as base for calculation
        // Fallback to a safe default if ref is not yet available
        let baseWidth = 800;
        if (docScrollRef.current) {
            baseWidth = docScrollRef.current.clientWidth - 48; // Padding
        } else if (containerRef.current) {
            baseWidth = containerRef.current.clientWidth;
        }

        documentPages.forEach((pageImg, pageIndex) => {
            const canvas = pageCanvasRefs.current[pageIndex]
            const container = pageContainerRefs.current[pageIndex]
            if (!canvas || !container) return

            // Only re-render base image if dimensions changed significantly
            // or if it's the first render.
            // But we need to keep the canvas size in sync.

            const containerWidth = baseWidth * zoomLevel
            const aspectRatio = pageImg.height / pageImg.width
            const displayWidth = containerWidth
            const displayHeight = containerWidth * aspectRatio

            // We only update if dimensions are different to avoid flicker/perf hit
            if (canvas.width !== pageImg.width || canvas.height !== pageImg.height) {
                canvas.width = pageImg.width
                canvas.height = pageImg.height
                const ctx = canvas.getContext('2d')
                if (ctx) ctx.drawImage(pageImg, 0, 0, pageImg.width, pageImg.height)
            }

            // Apply dimensions to style
            container.style.width = `${displayWidth}px`
            container.style.height = `${displayHeight}px`
            canvas.style.width = '100%'
            canvas.style.height = '100%'
        })
    }, [documentPages, zoomLevel])

    const getCompositedCanvas = (pageIndex) => {
        const pageImg = documentPages[pageIndex];
        if (!pageImg) return null;

        const canvas = document.createElement('canvas');
        canvas.width = pageImg.width;
        canvas.height = pageImg.height;
        const ctx = canvas.getContext('2d');

        // Draw base image
        ctx.drawImage(pageImg, 0, 0);

        // Draw signatures for this page
        const signatures = placedSignatures.filter(s => s.pageIndex === pageIndex);
        signatures.forEach(sig => {
            const sigImg = new Image();
            sigImg.src = sig.dataUrl;
            // We need to wait for image to load if not cached, but dataUrl should be instant.
            // However, drawImage with dataUrl source is synchronous in most browsers if source is already loaded.
            // Since we created these from canvas, they are likely ready. 
            // To be 100% safe in async context we might need promises, but for this helper
            // we assume they are loaded as they are displayed on screen.
            ctx.drawImage(sigImg, sig.x, sig.y, sig.width, sig.height);
        });

        // Return canvas immediately. If separate images are needed we'd use promises.
        // For local generic images it should be fine.
        return canvas;
    }

    // Helper to load image for compositing
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        })
    }

    // Async version of compositing to be safe
    const getCompositedCanvasAsync = async (pageIndex) => {
        const pageImg = documentPages[pageIndex];
        if (!pageImg) return null;

        const canvas = document.createElement('canvas');
        canvas.width = pageImg.width;
        canvas.height = pageImg.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(pageImg, 0, 0);

        const signatures = placedSignatures.filter(s => s.pageIndex === pageIndex);
        for (const sig of signatures) {
            const sigImg = await loadImage(sig.dataUrl);
            ctx.drawImage(sigImg, sig.x, sig.y, sig.width, sig.height);
        }

        return canvas;
    }

    const downloadDocumentAsPDF = async () => {
        if (documentPages.length === 0) return
        setIsLoadingPdf(true); // Reuse loading state for feedback

        try {
            const { jsPDF } = await import('jspdf')
            let pdf = null

            for (let i = 0; i < documentPages.length; i++) {
                const canvas = await getCompositedCanvasAsync(i);
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
        } catch (e) {
            console.error("Download failed", e);
            alert("Gagal mengunduh dokumen");
        } finally {
            setIsLoadingPdf(false);
        }
    }

    const downloadPageAsPNG = async (pageIndex) => {
        const canvas = await getCompositedCanvasAsync(pageIndex);
        if (!canvas) return
        const link = document.createElement('a')
        link.download = `halaman-${pageIndex + 1}-bertandatangan.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const downloadPageAsPDF = async (pageIndex) => {
        const canvas = await getCompositedCanvasAsync(pageIndex);
        if (!canvas) return

        const { jsPDF } = await import('jspdf')
        const imgData = canvas.toDataURL('image/png')
        const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait'

        const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [canvas.width, canvas.height]
        })

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.save(`halaman-${pageIndex + 1}-bertandatangan.pdf`)
    }

    const clearDocument = () => {
        setDocumentPages([])
        setDocumentName('')
        setPlacedSignatures([])
        setSelectedSigIndex(null)
        setZoomLevel(1)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const truncateFilename = (name, maxLength = 25) => {
        if (name.length <= maxLength) return name
        const extIndex = name.lastIndexOf('.')
        if (extIndex === -1) return name.substring(0, maxLength) + '...'

        const ext = name.substring(extIndex)
        const nameWithoutExt = name.substring(0, extIndex)

        if (nameWithoutExt.length + ext.length <= maxLength) return name

        return nameWithoutExt.substring(0, maxLength - ext.length - 3) + '...' + ext
    }

    return (
        <>
            <Navbar />

            <main className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1>✍️ Tanda Tangan <span>Digital</span></h1>
                    <p>Buat tanda tangan dan tambahkan langsung ke dokumen Anda</p>

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
                            style={{ height: `${canvasHeight}px`, cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E") 0 24, auto` }}
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
                                    <span>Lebar Pencil: {lineWidth}px</span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        value={lineWidth}
                                        onChange={(e) => setLineWidth(Number(e.target.value))}
                                        className={styles.slider}
                                    />
                                </div>
                            </div>
                            <div className={styles.controlsRight}>
                                <div className={styles.heightControl}>
                                    <span>Tinggi: {canvasHeight}</span>
                                    <input
                                        type="range"
                                        min="150"
                                        max="600"
                                        step="50"
                                        value={canvasHeight}
                                        onChange={handleHeightChange}
                                        className={styles.slider}
                                        style={{ width: 60 }}
                                    />
                                </div>
                                <button className={styles.btnIcon} onClick={clearCanvas}>
                                    <RotateCcw size={18} /> Reset
                                </button>
                                <button className={styles.btnSave} onClick={saveSignature} disabled={!hasDrawn}>
                                    <Plus size={16} /> Simpan ke Dokumen
                                </button>
                                <button className={styles.btnDownload} onClick={downloadSignature} disabled={!hasDrawn}>
                                    <Download size={16} /> Download
                                </button>
                            </div>
                        </div>

                        {savedSignatures.length > 0 && (
                            <div className={styles.savedSignatures}>
                                <span className={styles.savedLabel}>Tersimpan:</span>
                                <div className={styles.savedList}>
                                    {savedSignatures.map((sig) => (
                                        <div
                                            key={sig.id}
                                            className={styles.savedItem}
                                            onClick={() => setActiveSignatureId(sig.id)}
                                        >
                                            <img src={sig.dataUrl} alt="Signature" />
                                            <button onClick={(e) => {
                                                e.stopPropagation()
                                                deleteSignature(sig.id)
                                            }}>
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
                            {/* ... upload UI content ... */}
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
                        <div ref={workspaceRef} className={styles.documentWorkspace}>
                            <div className={styles.workspaceHeader}>
                                <div className={styles.docInfo}>
                                    <FileText size={16} />
                                    <span>{truncateFilename(documentName)} ({documentPages.length} halaman)</span>
                                </div>
                                <div className={styles.docActions}>
                                    <button onClick={clearDocument} className={styles.btnReset}>
                                        <X size={14} /> Ganti Dokumen
                                    </button>
                                </div>
                            </div>

                            {savedSignatures.length > 0 && (
                                <div className={styles.sigPicker}>
                                    <span>Pilih Tanda Tangan:</span>
                                    <div className={styles.sigPickerList}>
                                        {savedSignatures.map((sig) => (
                                            <div
                                                key={sig.id}
                                                className={`${styles.sigPickerItem} ${activeSignatureId === sig.id ? styles.active : ''}`}
                                                onClick={() => setActiveSignatureId(sig.id)}
                                            >
                                                <img src={sig.dataUrl} alt="Signature" />
                                                {activeSignatureId === sig.id && <Check size={12} className={styles.sigPickerCheck} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Floating Zoom Controls - inside relative workspace (restored) */}
                            <div className={styles.zoomControls}>
                                <button onClick={handleZoomOut} title="Zoom Out"><ZoomOut size={16} /></button>
                                <span>{Math.round(zoomLevel * 100)}%</span>
                                <button onClick={handleZoomIn} title="Zoom In"><ZoomIn size={16} /></button>
                            </div>

                            {/* Scrollable Document Pages */}
                            <div ref={docScrollRef} className={styles.docScroll}>
                                {documentPages.map((_, pageIndex) => (
                                    <div
                                        key={pageIndex}
                                        className={styles.pageWrapper}
                                    >
                                        <div className={styles.pageHeaderItem}>
                                            <div className={styles.pageNumber}>Halaman {pageIndex + 1}</div>
                                            <div className={styles.pageActions}>
                                                <button
                                                    className={styles.btnPageAction}
                                                    onClick={() => downloadPageAsPNG(pageIndex)}
                                                    title="Download halaman ini sebagai PNG"
                                                >
                                                    <Download size={14} /> PNG
                                                </button>
                                                <button
                                                    className={styles.btnPageAction}
                                                    onClick={() => downloadPageAsPDF(pageIndex)}
                                                    title="Download halaman ini sebagai PDF"
                                                >
                                                    <FileText size={14} /> PDF
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            className={styles.pageContainer}
                                            ref={el => pageContainerRefs.current[pageIndex] = el}
                                            onMouseMove={(e) => handleSigMouseMove(e, pageIndex)}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseUp}
                                            onTouchMove={(e) => handleSigMouseMove(e, pageIndex)}
                                            onTouchEnd={handleMouseUp}
                                            onMouseDown={(e) => handlePageMouseDown(e, pageIndex)}
                                            onTouchStart={(e) => handlePageMouseDown(e, pageIndex)}
                                        >
                                            <canvas
                                                ref={el => pageCanvasRefs.current[pageIndex] = el}
                                                className={styles.pageCanvas}
                                            />

                                            {/* Selection Box */}
                                            {isSelecting && selectionBox && selectionBox.pageIndex === pageIndex && (() => {
                                                const canvas = pageCanvasRefs.current[pageIndex]
                                                if (!canvas) return null
                                                // We need to recalculate scale because it's not available in this scope
                                                const rect = canvas.getBoundingClientRect()
                                                const scaleX = rect.width / canvas.width
                                                const scaleY = rect.height / canvas.height
                                                return (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            left: selectionBox.x * scaleX,
                                                            top: selectionBox.y * scaleY,
                                                            width: selectionBox.width * scaleX,
                                                            height: selectionBox.height * scaleY,
                                                            border: '2px dashed #2563eb',
                                                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                                            pointerEvents: 'none',
                                                            zIndex: 10
                                                        }}
                                                    />
                                                )
                                            })()}

                                            {/* Signature overlays for this page */}
                                            {placedSignatures
                                                .map((sig, globalIndex) => ({ sig, globalIndex }))
                                                .filter(({ sig }) => sig.pageIndex === pageIndex)
                                                .map(({ sig, globalIndex }) => {
                                                    const canvas = pageCanvasRefs.current[pageIndex]
                                                    if (!canvas) return null

                                                    // Scale is 1.0 because we are using percentages relative to the container
                                                    // which matches the displayed size of the canvas

                                                    return (
                                                        <div
                                                            key={sig.id}
                                                            className={`${styles.sigOverlay} ${selectedSigIndex === globalIndex ? styles.selected : ''}`}
                                                            style={{
                                                                left: `${(sig.x / canvas.width) * 100}%`,
                                                                top: `${(sig.y / canvas.height) * 100}%`,
                                                                width: `${(sig.width / canvas.width) * 100}%`,
                                                                height: `${(sig.height / canvas.height) * 100}%`
                                                            }}
                                                            onMouseDown={(e) => handleSigMouseDown(e, globalIndex, pageIndex)}
                                                            onTouchStart={(e) => handleSigMouseDown(e, globalIndex, pageIndex)}
                                                        >
                                                            <img
                                                                src={sig.dataUrl}
                                                                alt="Signature"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'contain',
                                                                    pointerEvents: 'none',
                                                                    userSelect: 'none'
                                                                }}
                                                            />
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
                                            {activeSignatureId && (
                                                <div className={styles.addSigToPage}>
                                                    <button
                                                        onClick={() => addSignatureToPage(activeSignatureId, pageIndex, { fromButton: true })}
                                                        title="Tambah tanda tangan"
                                                    >
                                                        <Plus size={14} /> Tambah Tanda Tangan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.downloadActions}>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={downloadDocumentAsPDF}
                                >
                                    <Download size={18} /> Download Semua Halaman (PDF)
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                <TrustSection />
                {/* Cara Pakai / How To Use */}
                <GuideSection
                    linkHref="/guide#signature"
                />
            </main >

            <Footer />
        </>
    )
}
