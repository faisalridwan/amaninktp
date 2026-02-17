'use client'

import { useState, useRef, useEffect } from 'react'
import { RotateCw, FileText, Download, RefreshCw, Layers, Shield, Check, ListChecks } from 'lucide-react'
import { PDFDocument, degrees } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'


export default function RotatePDFPage() {
    const [file, setFile] = useState(null)
    const [pages, setPages] = useState([]) // { id, rotation, thumbnail }
    const [isProcessing, setIsProcessing] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
    }, [])

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.type === 'application/pdf') {
            processFile(selectedFile)
        }
    }

    const processFile = async (selectedFile) => {
        setFile(selectedFile)
        setIsProcessing(true)
        const newPages = []

        try {
            const arrayBuffer = await selectedFile.arrayBuffer()
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
            const pdfData = await loadingTask.promise

            for (let i = 1; i <= pdfData.numPages; i++) {
                const page = await pdfData.getPage(i)
                const viewport = page.getViewport({ scale: 0.3 })
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                canvas.height = viewport.height
                canvas.width = viewport.width
                await page.render({ canvasContext: context, viewport }).promise

                newPages.push({
                    id: `rotate-${i}`,
                    rotation: 0,
                    thumbnail: canvas.toDataURL()
                })
            }
            setPages(newPages)
        } catch (err) {
            console.error(err)
            alert('Gagal memuat PDF.')
        } finally {
            setIsProcessing(false)
        }
    }

    const rotatePage = (index) => {
        const newPages = [...pages]
        newPages[index].rotation = (newPages[index].rotation + 90) % 360
        setPages(newPages)
    }

    const rotateAll = () => {
        const newPages = pages.map(p => ({
            ...p,
            rotation: (p.rotation + 90) % 360
        }))
        setPages(newPages)
    }

    const handleExport = async () => {
        if (!file) return
        setIsProcessing(true)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            const pdfPages = pdfDoc.getPages()

            pages.forEach((pageData, index) => {
                if (pageData.rotation !== 0) {
                    const page = pdfPages[index]
                    const currentRotation = page.getRotation().angle
                    page.setRotation(degrees(currentRotation + pageData.rotation))
                }
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `rotated-${file.name}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error(err)
            alert('Gagal memutar PDF.')
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        setFile(null)
        setPages([])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                    <h1 className={styles.heroTitle}>🔄 Putar PDF <span>Permanen</span></h1>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Putar halaman PDF yang terbalik atau miring secara permanen dan aman di browser.
                    </p>

                </header>

                {!file ? (
                    <div
                        className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={() => setDragActive(true)}
                        onDragLeave={() => setDragActive(false)}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDrop={(e) => {
                            e.preventDefault()
                            setDragActive(false)
                            if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0])
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <div className={styles.iconCircle}>
                            <Layers size={40} />
                        </div>
                        <div className={styles.uploadContent}>
                            <h3>Upload Dokumen</h3>
                            <p>Tarik file atau klik untuk memilih</p>
                            <div className={styles.supportedTypes}>
                                <span>PDF</span>
                            </div>
                            <span className={styles.safeTag}>🔒 100% Client-Side</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.workspace}>
                        <div className={styles.workspaceHeader}>
                            <div className={styles.fileMeta}>
                                <FileText size={20} />
                                <span>{file.name} ({pages.length} Halaman)</span>
                            </div>
                            <div className={styles.headerActions}>
                                <button className={styles.btnSecondary} onClick={rotateAll}>
                                    <RotateCw size={16} /> Putar Semua
                                </button>
                                <button className={styles.btnSecondary} onClick={reset}>
                                    <RefreshCw size={16} /> Ganti File
                                </button>
                                <button className={styles.btnPrimary} onClick={handleExport}>
                                    <Download size={16} /> Simpan & Download
                                </button>
                            </div>
                        </div>

                        {isProcessing && pages.length === 0 ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.spinner}></div>
                                <p>Menyiapkan preview...</p>
                            </div>
                        ) : (
                            <div className={styles.pageGrid}>
                                {pages.map((page, index) => (
                                    <div key={page.id} className={styles.pageCard}>
                                        <div className={styles.pageNumber}>{index + 1}</div>
                                        <div className={styles.thumbnailWrapper} style={{ transform: `rotate(${page.rotation}deg)` }}>
                                            <img src={page.thumbnail} alt={`Halaman ${index + 1}`} className={styles.thumbnail} />
                                        </div>
                                        <button className={styles.rotateBtn} onClick={() => rotatePage(index)}>
                                            <RotateCw size={18} /> Putar 90°
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <TrustSection />
                <GuideSection toolId="rotate" />
            </main>

            <Footer />
        </>
    )
}
