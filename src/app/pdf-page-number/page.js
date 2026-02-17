
'use client'

import { useState, useRef } from 'react'
import { FileText, Download, Upload, Copy, Settings, Type } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'
import UploadArea from '@/components/UploadArea'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export default function PdfPageNumberPage() {
    const [pdfFile, setPdfFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [position, setPosition] = useState('bottom-center') // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
    const [fontSize, setFontSize] = useState(12)
    const [startNumber, setStartNumber] = useState(1)
    const [totalPreviewPages, setTotalPreviewPages] = useState(5) // Just a dummy number for visual preview if needed
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type === 'application/pdf') {
            setPdfFile(file)
            setFileName(file.name)
        } else {
            alert('Please select a valid PDF file')
        }
    }

    const processPdf = async () => {
        if (!pdfFile) return

        try {
            const arrayBuffer = await pdfFile.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            const pages = pdfDoc.getPages()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

            pages.forEach((page, index) => {
                const { width, height } = page.getSize()
                const numberText = `${startNumber + index}`
                const textWidth = font.widthOfTextAtSize(numberText, fontSize)
                const textHeight = font.heightAtSize(fontSize)

                let x, y

                // Margins
                const margin = 20

                switch (position) {
                    case 'top-left':
                        x = margin
                        y = height - margin - textHeight
                        break
                    case 'top-center':
                        x = (width - textWidth) / 2
                        y = height - margin - textHeight
                        break
                    case 'top-right':
                        x = width - margin - textWidth
                        y = height - margin - textHeight
                        break
                    case 'bottom-left':
                        x = margin
                        y = margin
                        break
                    case 'bottom-center':
                        x = (width - textWidth) / 2
                        y = margin
                        break
                    case 'bottom-right':
                        x = width - margin - textWidth
                        y = margin
                        break
                    default:
                        x = (width - textWidth) / 2
                        y = margin
                }

                page.drawText(numberText, {
                    x,
                    y,
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0),
                })
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `numbered-${fileName}`
            link.click()

        } catch (error) {
            console.error('Error processing PDF:', error)
            alert('Gagal memproses PDF. Pastikan file tidak terenkripsi.')
        }
    }

    // Helper for visual preview style
    const getPreviewStyle = () => {
        // Base styling for the number in the preview box
        const style = { position: 'absolute', fontSize: `${Math.max(8, fontSize / 2)}px` } // Scale down font for small preview
        switch (position) {
            case 'top-left': style.top = '10px'; style.left = '10px'; break;
            case 'top-center': style.top = '10px'; style.left = '50%'; style.transform = 'translateX(-50%)'; break;
            case 'top-right': style.top = '10px'; style.right = '10px'; break;
            case 'bottom-left': style.bottom = '10px'; style.left = '10px'; break;
            case 'bottom-center': style.bottom = '10px'; style.left = '50%'; style.transform = 'translateX(-50%)'; break;
            case 'bottom-right': style.bottom = '10px'; style.right = '10px'; break;
        }
        return style
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>🔢 Nomor Halaman <span>PDF</span></h1>
                        <p className={styles.heroSubtitle}>
                            Tambahkan nomor halaman otomatis ke file PDF Anda.
                        </p>
                    </div>

                    <div className={styles.workspace}>
                        {/* Control Section */}
                        <div className={styles.controlSection}>
                            <h3 className={styles.label} style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Pengaturan</h3>

                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Posisi Nomor</label>
                                <select className={styles.select} value={position} onChange={(e) => setPosition(e.target.value)}>
                                    <option value="bottom-center">Bawah Tengah</option>
                                    <option value="bottom-right">Bawah Kanan</option>
                                    <option value="bottom-left">Bawah Kiri</option>
                                    <option value="top-center">Atas Tengah</option>
                                    <option value="top-right">Atas Kanan</option>
                                    <option value="top-left">Atas Kiri</option>
                                </select>
                            </div>

                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Ukuran Font (px)</label>
                                <input type="number" className={styles.input} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} min="6" max="72" />
                            </div>

                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Mulai Dari Angka</label>
                                <input type="number" className={styles.input} value={startNumber} onChange={(e) => setStartNumber(Number(e.target.value))} min="1" />
                            </div>

                            <div className={styles.previewBox}>
                                <div className={styles.pagePreview}>
                                    <div style={{ padding: '20px', color: '#ccc', fontSize: '10px' }}>
                                        Running Text Example...
                                        <hr style={{ margin: '10px 0', borderColor: '#eee' }} />
                                        Lorem ipsum dolor sit amet...
                                    </div>
                                    <span className={styles.pageNumber} style={getPreviewStyle()}>
                                        {startNumber}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Upload Section */}
                        <div className={styles.uploadSection}>
                            {!pdfFile ? (
                                <UploadArea
                                    onFileSelect={handleFileChange}
                                    accept="application/pdf"
                                    title="Upload PDF untuk Format"
                                    subtitle="Tambahkan nomor halaman pada file PDF"
                                    formats={['PDF']}
                                />
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div className={styles.fileName}>
                                        <FileText size={20} />
                                        {fileName}
                                    </div>
                                    <button className={styles.btnPrimary} onClick={processPdf}>
                                        <Download size={18} /> Proses & Download
                                    </button>
                                    <button className={styles.btnPrimary} style={{ background: '#718096', marginTop: '10px' }} onClick={() => setPdfFile(null)}>
                                        Ganti File
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <TrustSection />
                    <GuideSection toolId="pdf-page-number" />
                </div>
            </main>
            <Footer />
        </>
    )
}
