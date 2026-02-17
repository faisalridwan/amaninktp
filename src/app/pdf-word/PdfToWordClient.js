'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import UploadArea from '@/components/UploadArea'
import styles from './page.module.css'
import { FileText, Download, Loader2, ArrowRight, RefreshCcw, File as FileIcon, ArrowLeftRight } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import mammoth from 'mammoth'

export default function PdfToWordClient() {
    const [mode, setMode] = useState('pdf-to-word') // 'pdf-to-word' or 'word-to-pdf'
    const [file, setFile] = useState(null)
    const [isConverting, setIsConverting] = useState(false)
    const [progress, setProgress] = useState(0) 
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)

    // Load PDF.js worker
    useEffect(() => {
        const loadPdfWorker = async () => {
            if (window.pdfjsLib) return
            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
            }
            document.head.appendChild(script)
        }
        loadPdfWorker()
    }, [])

    const handleFileSelect = (selectedFile) => {
        if (mode === 'pdf-to-word') {
            if (selectedFile?.type === 'application/pdf') {
                setFile(selectedFile); setError(null); setIsSuccess(false)
            } else {
                setError('Mohon upload file PDF yang valid.')
            }
        } else {
            if (selectedFile?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(selectedFile); setError(null); setIsSuccess(false)
            } else {
                setError('Mohon upload file Word (.docx) yang valid.')
            }
        }
    }

    const convertPdfToWord = async () => {
        if (!file || !window.pdfjsLib) return
        setIsConverting(true); setProgress(0); setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
            const totalPages = pdf.numPages
            const docChildren = []

            for (let i = 1; i <= totalPages; i++) {
                setProgress(Math.round((i / totalPages) * 100))
                const page = await pdf.getPage(i)
                const textContent = await page.getTextContent()
                
                const lines = {}
                textContent.items.forEach(item => {
                    const y = item.transform[5] 
                    if (!lines[y]) lines[y] = []
                    lines[y].push(item)
                })

                const sortedY = Object.keys(lines).sort((a, b) => parseFloat(b) - parseFloat(a))

                sortedY.forEach(y => {
                    const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]) 
                    const lineText = lineItems.map(item => item.str).join(' ')
                    
                    if (lineText.trim()) {
                        docChildren.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: lineText,
                                        size: 24, 
                                        font: "Arial"
                                    }),
                                ],
                                spacing: { after: 200 },
                            })
                        )
                    }
                })
            }

            const doc = new Document({ sections: [{ children: docChildren }] })
            const blob = await Packer.toBlob(doc)
            saveAs(blob, file.name.replace('.pdf', '.docx'))
            setIsSuccess(true)

        } catch (err) {
            console.error(err)
            setError('Gagal mengkonversi PDF. File mungkin terkunci.')
        } finally {
            setIsConverting(false)
        }
    }

    const convertWordToPdf = async () => {
        if (!file) return
        setIsConverting(true); setProgress(0); setError(null)

        try {
            // Dynamic import jsPDF to avoid SSR issues
            const { jsPDF } = await import('jspdf')
            
            setProgress(30)
            const arrayBuffer = await file.arrayBuffer()
            
            // Extract raw text using mammoth (Handling formatting client-side is hard, we extract text)
            // Ideally we render HTML then PDF, but mammoth HTML is simple.
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer })
            const text = result.value
            
            setProgress(60)

            const doc = new jsPDF()
            
            // Simple text dump with word wrapping
            const splitText = doc.splitTextToSize(text, 180) // 180mm width (A4 is 210mm)
            
            let y = 20
            splitText.forEach(line => {
                if (y > 280) { // New page
                    doc.addPage()
                    y = 20
                }
                doc.text(line, 15, y)
                y += 7
            })
            
            setProgress(100)
            doc.save(file.name.replace('.docx', '.pdf'))
            setIsSuccess(true)

        } catch (err) {
            console.error(err)
            setError('Gagal mengkonversi Word to PDF. Pastikan file valid.')
        } finally {
            setIsConverting(false)
        }
    }

    const handleConvert = () => {
        if (mode === 'pdf-to-word') convertPdfToWord()
        else convertWordToPdf()
    }

    const reset = () => {
        setFile(null); setProgress(0); setError(null); setIsSuccess(false)
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <h1 className={styles.heroTitle}>
                    📄 PDF &lt;-&gt; Word <span>Online</span>
                </h1>
                <p className={styles.description}>
                    {mode === 'pdf-to-word' 
                        ? 'Ubah dokumen PDF Anda menjadi format Word (.docx) yang bisa diedit.' 
                        : 'Simpan dokumen Word (.docx) Anda menjadi file PDF yang aman dan portabel.'}
                    <br/>100% Aman, diproses di browser Anda tanpa upload ke server.
                </p>

                <div className={styles.toolContainer}>
                    <div className={styles.tabs}>
                        <button 
                            className={`${styles.tab} ${mode === 'pdf-to-word' ? styles.active : ''}`}
                            onClick={() => { setMode('pdf-to-word'); reset() }}
                        >
                            PDF to Word
                        </button>
                        <button 
                            className={`${styles.tab} ${mode === 'word-to-pdf' ? styles.active : ''}`}
                            onClick={() => { setMode('word-to-pdf'); reset() }}
                        >
                            Word to PDF
                        </button>
                    </div>

                    {!file ? (
                        <div className={styles.uploadArea}>
                            <UploadArea
                                onFileSelect={handleFileSelect}
                                accept={mode === 'pdf-to-word' ? ".pdf" : ".docx"}
                                title={`Upload File ${mode === 'pdf-to-word' ? 'PDF' : 'Word'}`}
                                description={`Seret & lepas atau klik untuk memilih file ${mode === 'pdf-to-word' ? '.pdf' : '.docx'}`}
                                icon={mode === 'pdf-to-word' ? FileIcon : FileText}
                            />
                            {error && <div className={styles.errorMessage}>{error}</div>}
                        </div>
                    ) : (
                        <div className={styles.previewArea}>
                            <div className={styles.fileInfo}>
                                <div style={{ background: mode === 'pdf-to-word' ? '#FF4D4F' : '#1890ff', padding: '10px', borderRadius: '8px', color: 'white' }}>
                                    {mode === 'pdf-to-word' ? <FileIcon size={24} /> : <FileText size={24} />}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '600' }}>{file.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </div>
                            </div>
                            
                            {isConverting ? (
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <div style={{ 
                                        height: '8px', 
                                        width: '100%', 
                                        background: '#eee', 
                                        borderRadius: '4px', 
                                        overflow: 'hidden',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ 
                                            height: '100%', 
                                            width: `${progress}%`, 
                                            background: 'var(--primary)', 
                                            transition: 'width 0.3s ease' 
                                        }} />
                                    </div>
                                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary)' }}>
                                        <Loader2 className="animate-spin" size={18} />
                                        Memproses Dokumen... {progress}%
                                    </p>
                                </div>
                            ) : isSuccess ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#52c41a', fontWeight: '600', marginBottom: '15px' }}>
                                        Konversi Berhasil! File telah didownload.
                                    </p>
                                    <button onClick={reset} className={styles.convertButton} style={{ background: 'var(--text-secondary)' }}>
                                        <RefreshCcw size={18} /> Konversi File Lain
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                     <button onClick={reset} className={styles.convertButton} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                                        Batal
                                    </button>
                                    <button onClick={handleConvert} className={styles.convertButton}>
                                        Konversi ke {mode === 'pdf-to-word' ? 'Word' : 'PDF'} <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {error && <p className={styles.errorMessage}>{error}</p>}
                        </div>
                    )}
                </div>

                <TrustSection />
                <GuideSection linkHref="/guide#pdf-word" />
            </main>
            <Footer />
        </div>
    )
}
