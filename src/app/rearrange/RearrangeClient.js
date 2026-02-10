'use client'

import { useState, useRef, useEffect } from 'react'
import { Move, FileText, Download, RefreshCw, Trash2, ArrowLeft, ArrowRight, Shield, Layers } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'


export default function RearrangePDFPage() {
    const [file, setFile] = useState(null)
    const [pages, setPages] = useState([]) // Array of objects { id, originalIndex, thumbnail }
    const [isProcessing, setIsProcessing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
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
            const numPages = pdfData.numPages

            for (let i = 1; i <= numPages; i++) {
                const page = await pdfData.getPage(i)
                const viewport = page.getViewport({ scale: 0.3 })
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                canvas.height = viewport.height
                canvas.width = viewport.width

                await page.render({ canvasContext: context, viewport }).promise
                newPages.push({
                    id: `page-${i}-${Date.now()}`,
                    originalIndex: i - 1,
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

    const movePage = (index, direction) => {
        const newPages = [...pages]
        const targetIndex = index + direction
        if (targetIndex < 0 || targetIndex >= newPages.length) return

        const temp = newPages[index]
        newPages[index] = newPages[targetIndex]
        newPages[targetIndex] = temp
        setPages(newPages)
    }

    const removePage = (index) => {
        if (pages.length <= 1) return
        const newPages = [...pages]
        newPages.splice(index, 1)
        setPages(newPages)
    }

    const handleExport = async () => {
        if (!file || pages.length === 0) return
        setIsExporting(true)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const sourceDoc = await PDFDocument.load(arrayBuffer)
            const newDoc = await PDFDocument.create()

            const indicesToCopy = pages.map(p => p.originalIndex)
            const copiedPages = await newDoc.copyPages(sourceDoc, indicesToCopy)
            copiedPages.forEach((page) => newDoc.addPage(page))

            const pdfBytes = await newDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `rearranged-${file.name}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error(err)
            alert('Gagal mengekspor PDF.')
        } finally {
            setIsExporting(false)
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
                        <Move size={32} /> Rearrange <span>PDF</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Ubah urutan halaman PDF Anda dengan drag-and-drop visual yang mudah dan aman.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side
                    </div>
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
                            <h3>Upload PDF</h3>
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
                                <button className={styles.btnSecondary} onClick={reset}>
                                    <RefreshCw size={16} /> Ganti File
                                </button>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleExport}
                                    disabled={isExporting}
                                >
                                    {isExporting ? 'Memproses...' : 'Simpan PDF Baru'}
                                </button>
                            </div>
                        </div>

                        {isProcessing ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.spinner}></div>
                                <p>Menyiapkan preview halaman...</p>
                            </div>
                        ) : (
                            <div className={styles.pageGrid}>
                                {pages.map((page, index) => (
                                    <div key={page.id} className={styles.pageCard}>
                                        <div className={styles.pageNumber}>{index + 1}</div>
                                        <img src={page.thumbnail} alt={`Halaman ${index + 1}`} className={styles.thumbnail} />
                                        <div className={styles.pageControls}>
                                            <button
                                                onClick={() => movePage(index, -1)}
                                                disabled={index === 0}
                                                className={styles.controlBtn}
                                                title="Pindahkan ke Kiri"
                                            >
                                                <ArrowLeft size={16} />
                                            </button>
                                            <button
                                                onClick={() => removePage(index)}
                                                className={styles.deleteBtn}
                                                title="Hapus Halaman"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => movePage(index, 1)}
                                                disabled={index === pages.length - 1}
                                                className={styles.controlBtn}
                                                title="Pindahkan ke Kanan"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <TrustSection />
                <GuideSection toolId="rearrange" />
            </main>

            <Footer />
        </>
    )
}
