'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import UploadArea from '@/components/UploadArea'
import styles from './page.module.css'
import { Lock, Unlock, ArrowRight, RefreshCcw, Loader2, FileText, Check } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'

export default function PdfSecurityClient() {
    const [mode, setMode] = useState('protect') // 'protect' or 'unlock'
    const [file, setFile] = useState(null)
    const [password, setPassword] = useState('')
    const [isProccessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleFileSelect = (selectedFile) => {
        if (selectedFile?.type === 'application/pdf') {
            setFile(selectedFile)
            setError(null)
            setIsSuccess(false)
            setPassword('')
        } else {
            setError('Mohon upload file PDF yang valid.')
        }
    }

    const protectPdf = async () => {
        if (!file || !password) {
            setError('Mohon masukkan password.')
            return
        }
        setIsProcessing(true); setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            
            pdfDoc.encrypt({
                userPassword: password,
                ownerPassword: password, // Same for simplicity, usually owner has full rights
                permissions: {
                    printing: 'highResolution',
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: false,
                    documentAssembly: false,
                },
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            saveAs(blob, `protected_${file.name}`)
            
            setIsSuccess(true)
        } catch (err) {
            console.error(err)
            setError('Gagal mengunci PDF. Pastikan file valid.')
        } finally {
            setIsProcessing(false)
        }
    }

    const unlockPdf = async () => {
        if (!file) return
        // For unlock, if PDF is encrypted, PDFDocument.load throws or needs password
        // We prompt user for password if they know it (to remove it)
        // If the user wants to "Crack" it, clientside JS is too slow.
        // Assuming "Unlock" means "Remove Known Password".
        
        if (!password) {
            setError('Masukkan password file saat ini untuk membukanya.')
            return
        }

        setIsProcessing(true); setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            
            // Try formatting loading it with password
            // If password is wrong, it will throw
            const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password })
            
            // To "Remove" password, we just save it. pdf-lib saves without encryption by default unless .encrypt is called.
            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            saveAs(blob, `unlocked_${file.name}`)
            
            setIsSuccess(true)
        } catch (err) {
            console.error(err)
            if (err.message.includes('Password')) {
                setError('Password salah. Mohon masukkan password yang benar.')
            } else {
                setError('Gagal membuka PDF. File mungkin rusak atau password salah.')
            }
        } finally {
            setIsProcessing(false)
        }
    }

    const handleProcess = () => {
        if (mode === 'protect') protectPdf()
        else unlockPdf()
    }

    const reset = () => {
        setFile(null); setPassword(''); setError(null); setIsSuccess(false)
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <h1 className={styles.heroTitle}>
                    🔒 Protect/Unlock <span>PDF</span>
                </h1>
                <p className={styles.description}>
                    {mode === 'protect' 
                        ? 'Tambahkan password enkripsi untuk melindungi dokumen PDF Anda.' 
                        : 'Hapus password dari file PDF Anda agar bisa dibuka tanpa sandi.'}
                    <br/>100% Aman, diproses di browser Anda.
                </p>

                <div className={styles.toolContainer}>
                    <div className={styles.tabs}>
                        <button 
                            className={`${styles.tab} ${mode === 'protect' ? styles.active : ''}`}
                            onClick={() => { setMode('protect'); reset() }}
                        >
                            <Lock size={16} style={{display:'inline', marginRight:5}}/> Protect PDF
                        </button>
                        <button 
                            className={`${styles.tab} ${mode === 'unlock' ? styles.active : ''}`}
                            onClick={() => { setMode('unlock'); reset() }}
                        >
                            <Unlock size={16} style={{display:'inline', marginRight:5}}/> Unlock PDF
                        </button>
                    </div>

                    {!file ? (
                        <div className={styles.uploadArea}>
                            <UploadArea
                                onFileSelect={handleFileSelect}
                                accept=".pdf"
                                title="Upload File PDF"
                                description="Seret & lepas atau klik untuk memilih file PDF"
                                icon={mode === 'protect' ? Lock : Unlock}
                            />
                            {error && <div className={styles.errorMessage}>{error}</div>}
                        </div>
                    ) : (
                        <div className={styles.previewArea}>
                            <div className={styles.fileInfo}>
                                <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '8px', color: 'white' }}>
                                    <FileText size={24} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '600' }}>{file.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </div>
                            </div>

                            {!isSuccess && (
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>
                                        {mode === 'protect' ? 'Set Password Baru' : 'Masukkan Password Saat Ini'}
                                    </label>
                                    <input 
                                        type="password" 
                                        className={styles.passwordInput}
                                        placeholder={mode === 'protect' ? 'Masukkan password rahasia...' : 'Password file...'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            )}
                            
                            {isProccessing ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                                    <Loader2 className="animate-spin" /> Sedang Memproses...
                                </div>
                            ) : isSuccess ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#52c41a', fontWeight: '600', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Check /> Berhasil! File didownload.
                                    </p>
                                    <button onClick={reset} className={styles.processButton} style={{ background: 'var(--text-secondary)' }}>
                                        <RefreshCcw size={18} /> Proses File Lain
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                     <button onClick={reset} className={styles.processButton} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                                        Batal
                                    </button>
                                    <button onClick={handleProcess} className={styles.processButton}>
                                        {mode === 'protect' ? 'Kunci PDF' : 'Buka PDF'} <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {error && <p className={styles.errorMessage}>{error}</p>}
                        </div>
                    )}
                </div>

                <TrustSection />
                <GuideSection linkHref="/guide#pdf-security" />
            </main>
            <Footer />
        </div>
    )
}
