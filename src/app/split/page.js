'use client'

import { useState, useRef } from 'react'
import { Scissors, FileText, Download, Check, AlertCircle, RefreshCw, Layers, Shield } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function SplitPDFPage() {
    const [file, setFile] = useState(null)
    const [pageCount, setPageCount] = useState(0)
    const [selectedPages, setSelectedPages] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.type === 'application/pdf') {
            processFile(selectedFile)
        } else {
            setError('Mohon upload file PDF.')
        }
    }

    const processFile = async (selectedFile) => {
        setFile(selectedFile)
        setError(null)
        try {
            const arrayBuffer = await selectedFile.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            setPageCount(pdfDoc.getPageCount())
            setSelectedPages(`1-${pdfDoc.getPageCount()}`)
        } catch (err) {
            console.error(err)
            setError('Gagal membaca file PDF.')
        }
    }

    const handleSplit = async () => {
        if (!file) return
        setIsProcessing(true)
        setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            const splitDoc = await PDFDocument.create()

            // Parse ranges like "1, 3, 5-10"
            const pagesToExtract = []
            const parts = selectedPages.split(',')

            for (const part of parts) {
                const range = part.trim().split('-')
                if (range.length === 1) {
                    const p = parseInt(range[0])
                    if (!isNaN(p) && p > 0 && p <= pageCount) pagesToExtract.push(p - 1)
                } else if (range.length === 2) {
                    const start = parseInt(range[0])
                    const end = parseInt(range[1])
                    if (!isNaN(start) && !isNaN(end)) {
                        for (let i = start; i <= end; i++) {
                            if (i > 0 && i <= pageCount) pagesToExtract.push(i - 1)
                        }
                    }
                }
            }

            if (pagesToExtract.length === 0) {
                setError('Halaman yang dipilih tidak valid.')
                setIsProcessing(false)
                return
            }

            // Copy pages
            const copiedPages = await splitDoc.copyPages(pdfDoc, pagesToExtract)
            copiedPages.forEach((page) => splitDoc.addPage(page))

            const pdfBytes = await splitDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `split-${file.name}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

        } catch (err) {
            console.error(err)
            setError('Gagal memproses pemisahan PDF.')
        } finally {
            setIsProcessing(false)
        }
    }

    const reset = () => {
        setFile(null)
        setPageCount(0)
        setError(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                    <h1 className={styles.heroTitle}>✂️ Pisahkan PDF <span>Per Halaman</span></h1>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Pisahkan halaman PDF menjadi dokumen baru secara instan dan aman di browser Anda.
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
                        <div className={`neu-card no-hover ${styles.resultCard}`}>
                            <div className={styles.fileInfo}>
                                <FileText size={40} className={styles.fileIcon} />
                                <div>
                                    <h3>{file.name}</h3>
                                    <p>{pageCount} Halaman • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button className={styles.btnSecondary} onClick={reset}>
                                    <RefreshCw size={18} /> Ganti File
                                </button>
                            </div>

                            <hr className={styles.divider} />

                            <div className={styles.controls}>
                                <div className={styles.inputGroup}>
                                    <label>Masukkan Rentang Halaman (Contoh: 1-3, 5, 8-10)</label>
                                    <input
                                        type="text"
                                        value={selectedPages}
                                        onChange={(e) => setSelectedPages(e.target.value)}
                                        placeholder="Misal: 1-2, 4"
                                        className={styles.rangeInput}
                                    />
                                </div>

                                {error && (
                                    <div className={styles.errorMessage}>
                                        <AlertCircle size={16} /> {error}
                                    </div>
                                )}

                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleSplit}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <><div className={styles.spinner}></div> Memproses...</>
                                    ) : (
                                        <><Download size={18} /> Ekstrak Halaman & Download</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <TrustSection />
                <GuideSection toolId="split" />
            </main>

            <Footer />
        </>
    )
}
