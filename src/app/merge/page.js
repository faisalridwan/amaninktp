'use client'

import { useState, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'
import { FileUp, Trash2, ArrowUp, ArrowDown, Download, FileText, X, AlertCircle, Eye, Image as ImageIcon, Plus, Shield, Zap, Lock, Smartphone } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'

export default function MergePDF() {
    const [files, setFiles] = useState([])
    const [isMerging, setIsMerging] = useState(false)
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null)
    const [previewFile, setPreviewFile] = useState(null)
    const [error, setError] = useState('')
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    // Handle File Upload (PDF & Images)
    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files || [])
        // Filter for PDF, JPG, PNG
        const validFiles = uploadedFiles.filter(file =>
            file.type === 'application/pdf' ||
            file.type === 'image/jpeg' ||
            file.type === 'image/png'
        )

        if (validFiles.length < uploadedFiles.length) {
            setError('Beberapa file diabaikan. Hanya PDF, JPG, dan PNG yang didukung.')
        } else {
            setError('')
        }

        const newFiles = validFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type.includes('image') ? 'image' : 'pdf',
            preview: file.type.includes('image') ? URL.createObjectURL(file) : null
        }))

        setFiles(prev => [...prev, ...newFiles])
        // Reset input value to allow selecting same file again if needed
        e.target.value = null
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload({ target: { files: e.dataTransfer.files } })
        }
    }

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id))
        setMergedPdfUrl(null)
    }

    const moveFile = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === files.length - 1)) return

        const newFiles = [...files]
        const temp = newFiles[index]
        newFiles[index] = newFiles[index + direction]
        newFiles[index + direction] = temp
        setFiles(newFiles)
        setMergedPdfUrl(null)
    }

    const mergePDFs = async () => {
        if (files.length < 2 && files[0]?.type === 'pdf') {
            // Allow 1 file if it's an image we want to convert to PDF, but typically merge implies 2+
            // But user arguably might want to convert 1 image to PDF here too.
            // Let's stick to standard behavior: if only 1 PDF, warning. If 1 image, allow.
            if (files.length === 0) return
        }

        setIsMerging(true)
        setError('')
        setMergedPdfUrl(null)

        try {
            const mergedPdf = await PDFDocument.create()

            for (const fileObj of files) {
                const fileBytes = await fileObj.file.arrayBuffer()

                if (fileObj.type === 'pdf') {
                    const pdf = await PDFDocument.load(fileBytes)
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
                    copiedPages.forEach((page) => mergedPdf.addPage(page))
                } else if (fileObj.type === 'image') {
                    let image
                    if (fileObj.file.type === 'image/jpeg') {
                        image = await mergedPdf.embedJpg(fileBytes)
                    } else {
                        image = await mergedPdf.embedPng(fileBytes)
                    }

                    // Define page size based on image size, or standard A4? 
                    // Usually for "Image to PDF", matching image size is best to preserve quality.
                    const page = mergedPdf.addPage([image.width, image.height])
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: image.width,
                        height: image.height,
                    })
                }
            }

            const pdfBytes = await mergedPdf.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            setMergedPdfUrl(url)
        } catch (err) {
            console.error('Merge error:', err)
            setError('Gagal menggabungkan file. Pastikan file tidak rusak atau terlindungi password.')
        } finally {
            setIsMerging(false)
        }
    }

    const openPreview = (file) => {
        const fileUrl = URL.createObjectURL(file.file)
        setPreviewFile({ ...file, url: fileUrl })
    }

    const closePreview = () => {
        setPreviewFile(null)
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.heroTitle}>📄 Gabungkan PDF & <span>Gambar</span></h1>
                    <p className={styles.subtitle}>
                        Satukan file PDF dan gambar (JPG/PNG) menjadi satu dokumen PDF secara urut.
                    </p>

                </div>

                <div className={styles.workspace}>
                    {/* Upload Area */}
                    <div
                        className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{ display: files.length > 0 ? 'none' : 'flex' }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="application/pdf,image/jpeg,image/png"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <div className={styles.iconCircle}>
                            <FileUp size={40} />
                        </div>
                        <div className={styles.uploadContent}>
                            <h3>Upload File PDF & Gambar</h3>
                            <p>Tarik file atau klik untuk memilih</p>
                            <div className={styles.supportedTypes}>
                                <span>PDF</span>
                                <span>JPG</span>
                                <span>PNG</span>
                            </div>
                            <span className={styles.safeTag}>🔒 100% Client-Side</span>
                        </div>
                        {error && (
                            <div className={styles.error} onClick={(e) => e.stopPropagation()}>
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className={styles.fileList}>
                            <div className={styles.listHeader}>
                                <span>File yang akan digabung ({files.length})</span>
                                <button className={styles.btnClear} onClick={() => { setFiles([]); setMergedPdfUrl(null); }}>
                                    Hapus Semua
                                </button>
                            </div>

                            <div className={styles.filesGrid}>
                                {files.map((file, index) => (
                                    <div key={file.id} className={styles.fileCard}>
                                        <div className={styles.filePreview} onClick={() => openPreview(file)} style={{ cursor: 'pointer' }}>
                                            {file.type === 'image' ? (
                                                <img src={file.preview} alt={file.name} className={styles.thumbImage} />
                                            ) : (
                                                <div className={styles.thumbPdf}>
                                                    <FileText size={32} />
                                                    <span className={styles.pdfLabel}>PDF</span>
                                                </div>
                                            )}
                                            <div className={styles.previewOverlay}>
                                                <Eye size={20} color="white" />
                                            </div>
                                            <button className={styles.btnRemove} onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className={styles.fileInfo}>
                                            <p className={styles.fileName}>{file.name}</p>
                                            <p className={styles.fileSize}>{file.size}</p>
                                        </div>
                                        <div className={styles.fileActions}>
                                            <button
                                                onClick={() => moveFile(index, -1)}
                                                disabled={index === 0}
                                                title="Geser Kiri/Atas"
                                            >
                                                <ArrowUp size={16} style={{ transform: 'rotate(-90deg)' }} />
                                            </button>
                                            <span className={styles.orderBadge}>{index + 1}</span>
                                            <button
                                                onClick={() => moveFile(index, 1)}
                                                disabled={index === files.length - 1}
                                                title="Geser Kanan/Bawah"
                                            >
                                                <ArrowDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Merge Action */}
                            <div className={styles.actionSection}>
                                <div className={styles.buttonGroup}>
                                    <button
                                        className={styles.btnAddMore}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Plus size={18} />
                                        Tambah File
                                    </button>
                                    <button
                                        className={`${styles.btnPrimary} ${isMerging ? styles.loading : ''}`}
                                        onClick={mergePDFs}
                                        disabled={isMerging || files.length === 0}
                                    >
                                        {isMerging ? 'Memproses...' : 'Gabungkan File'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Result Preview */}
                    {mergedPdfUrl && (
                        <div className={styles.resultSection}>
                            <div className={styles.resultHeader}>
                                <h2>Hasil Penggabungan</h2>
                                <div className={styles.resultActions}>
                                    <a
                                        href={mergedPdfUrl}
                                        download={`merged_document_${new Date().getTime()}.pdf`}
                                        className={styles.btnDownload}
                                    >
                                        <Download size={18} />
                                        Download PDF
                                    </a>
                                </div>
                            </div>
                            <div className={styles.pdfPreviewFrame}>
                                <iframe src={mergedPdfUrl} title="PDF Preview" width="100%" height="600px" />
                            </div>
                        </div>
                    )}
                </div>

                <TrustSection />

                {/* Cara Pakai / How To Use */}
                <GuideSection
                    linkHref="/guide#merge"
                />

                {/* New Advantages Section */}
                <section className={styles.advantagesSection}>
                    <h2 className={styles.sectionTitle}>Keunggulan Amanin Data</h2>
                    <div className={styles.advantagesGrid}>
                        <div className={styles.advantageCard}>
                            <span className={styles.cardIcon}>🔒</span>
                            <h3 className={styles.cardTitle}>Privasi Utama</h3>
                            <p className={styles.cardDesc}>
                                File Anda tidak pernah meninggalkan perangkat. Semua proses dilakukan di browser Anda, 100% aman dari peretasan cloud.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <span className={styles.cardIcon}>⚡</span>
                            <h3 className={styles.cardTitle}>Tanpa Antri</h3>
                            <p className={styles.cardDesc}>
                                Tidak perlu menunggu upload atau download. Proses penggabungan terjadi instan menggunakan kekuatan perangkat Anda sendiri.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <span className={styles.cardIcon}>📱</span>
                            <h3 className={styles.cardTitle}>Semua Perangkat</h3>
                            <p className={styles.cardDesc}>
                                Dapat digunakan di Laptop, HP, atau Tablet. Desain responsif memudahkan Anda bekerja dari mana saja tanpa instal aplikasi.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <span className={styles.cardIcon}>✅</span>
                            <h3 className={styles.cardTitle}>Gratis Selamanya</h3>
                            <p className={styles.cardDesc}>
                                Tanpa batasan jumlah file, tanpa watermark, dan tanpa biaya. Nikmati fitur premium secara cuma-cuma untuk produktivitas Anda.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* File Preview Modal */}
            {previewFile && (
                <div className={styles.modalOverlay} onClick={closePreview}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{previewFile.name}</h3>
                            <button className={styles.closeModal} onClick={closePreview}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.previewBody}>
                            {previewFile.type === 'image' ? (
                                <img src={previewFile.url} alt="Preview" className={styles.previewImage} />
                            ) : (
                                <iframe src={previewFile.url} className={styles.previewFrame} title="PDF Preview" />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    )
}
