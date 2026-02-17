'use client'

import { useState, useRef } from 'react'
import { File, Download, Trash2, ScissorsLineDashed, RefreshCw, Archive } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import UploadArea from '@/components/UploadArea'

export default function BulkRenamerPage() {
    const [files, setFiles] = useState([])
    const [prefix, setPrefix] = useState('')
    const [suffix, setSuffix] = useState('')
    const [replaceText, setReplaceText] = useState('')
    const [withText, setWithText] = useState('')
    const [startNumber, setStartNumber] = useState(1)
    const [useNumbering, setUseNumbering] = useState(true)
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                original: file,
                name: file.name,
                size: file.size
            }))
            setFiles(prev => [...prev, ...newFiles])
        }
    }

    const getNewName = (originalName, index) => {
        let name = originalName
        const extIndex = name.lastIndexOf('.')
        let ext = extIndex !== -1 ? name.substring(extIndex) : ''
        let base = extIndex !== -1 ? name.substring(0, extIndex) : name

        // Replace
        if (replaceText) {
            base = base.split(replaceText).join(withText)
        }

        // Prefix & Suffix
        let newBase = `${prefix}${base}${suffix}`

        // Numbering
        if (useNumbering) {
            newBase = `${newBase}-${startNumber + index}`
        }

        return `${newBase}${ext}`
    }

    const handleDownloadAll = async () => {
        if (files.length === 0) return

        const zip = new JSZip()
        files.forEach((file, index) => {
            const newName = getNewName(file.name, index)
            zip.file(newName, file.original)
        })

        const content = await zip.generateAsync({ type: 'blob' })
        saveAs(content, 'renamed_files.zip')
    }

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>🏷️ Rename File <span>Massal</span></h1>
                        <p className={styles.heroSubtitle}>
                            Ganti nama banyak file sekaligus dengan pola prefix, suffix, atau penomoran otomatis.
                        </p>
                    </div>

                    <div className={styles.workspace}>
                        <div className={styles.controls}>
                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Prefix (Awalan)</label>
                                <input className={styles.input} value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="e.g. IMG_" />
                            </div>
                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Suffix (Akhiran)</label>
                                <input className={styles.input} value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="e.g. _2024" />
                            </div>
                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Replace Text</label>
                                <input className={styles.input} value={replaceText} onChange={e => setReplaceText(e.target.value)} placeholder="Find..." />
                            </div>
                            <div className={styles.controlGroup}>
                                <label className={styles.label}>With Text</label>
                                <input className={styles.input} value={withText} onChange={e => setWithText(e.target.value)} placeholder="Replace..." />
                            </div>
                            <div className={styles.controlGroup}>
                                <label className={styles.label}>Start Number</label>
                                <input type="number" className={styles.input} value={startNumber} onChange={e => setStartNumber(parseInt(e.target.value) || 1)} />
                            </div>
                        </div>

                        {files.length === 0 ? (
                            <UploadArea
                                onFileSelect={handleFileChange}
                                multiple={true}
                                title="Upload File untuk Rename"
                                subtitle="Tarik banyak file sekaligus atau klik untuk memilih"
                                formats={['ALL FILES']}
                                icon={File}
                            />
                        ) : (
                            <>
                                <div className={styles.actions} style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <button className={styles.btnSecondary} onClick={() => setFiles([])}>
                                        <RefreshCw size={16} /> Reset
                                    </button>
                                    <button className={styles.btnPrimary} onClick={() => fileInputRef.current.click()}>
                                        <File size={16} /> Tambah File
                                    </button>
                                    <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} hidden />
                                </div>

                                <div className={styles.fileList}>
                                    {files.map((file, i) => (
                                        <div key={i} className={styles.fileItem}>
                                            <span className={styles.originalName}>{file.name}</span>
                                            <ScissorsLineDashed size={16} style={{ color: '#cbd5e0' }} />
                                            <span className={styles.newName}>{getNewName(file.name, i)}</span>
                                            <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.actions}>
                                    <button className={styles.btnPrimary} onClick={handleDownloadAll}>
                                        <Archive size={18} /> Download All (ZIP)
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <TrustSection />
                    <GuideSection toolId="bulk-renamer" />
                </div>
            </main>
            <Footer />
        </>
    )
}
