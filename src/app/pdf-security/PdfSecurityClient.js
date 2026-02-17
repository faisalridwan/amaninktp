'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import UploadArea from '@/components/UploadArea'
import styles from './page.module.css'
import { Lock, Unlock, ArrowRight, RefreshCcw, Loader2, FileText, Check, Eye, EyeOff, ShieldCheck, XCircle } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'

export default function PdfSecurityClient() {
    const [mode, setMode] = useState('protect') // 'protect' or 'unlock'
    const [file, setFile] = useState(null)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isProccessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleFileSelect = (selectedFile) => {
        if (selectedFile?.type === 'application/pdf') {
            setFile(selectedFile)
            setError(null)
            setIsSuccess(false)
            setPassword('')
            setShowPassword(false)
        } else {
            setError('Mohon upload file PDF yang valid.')
        }
    }

    const protectPdf = async () => {
        if (!file || !password) {
            setError('Mohon masukkan password')
            return
        }
        setIsProcessing(true); setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            
            pdfDoc.encrypt({
                userPassword: password,
                ownerPassword: password,
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
            setError('Gagal mengunci PDF. File mungkin rusak atau sudah terenkripsi.')
        } finally {
            setIsProcessing(false)
        }
    }

    const unlockPdf = async () => {
        if (!file) return
        if (!password) {
            setError('Masukkan password file saat ini untuk membukanya.')
            return
        }

        setIsProcessing(true); setError(null)

        try {
            const arrayBuffer = await file.arrayBuffer()
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
        setFile(null); setPassword(''); setError(null); setIsSuccess(false); setShowPassword(false);
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <h1 className={styles.heroTitle}>
                    {mode === 'protect' ? <Lock className={styles.heroIcon} /> : <Unlock className={styles.heroIcon} />}
                    {mode === 'protect' ? 'Protect' : 'Unlock'} <span>PDF</span>
                </h1>
                <p className={styles.description}>
                    {mode === 'protect' 
                        ? 'Enkripsi dokumen PDF Anda dengan password yang aman dalam hitungan detik.' 
                        : 'Hapus password dari file PDF Anda agar bisa diakses dengan mudah.'}
                    <br/>100% Aman, diproses Client-Side di browser Anda.
                </p>

                <div className={styles.toolContainer}>
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabs}>
                            <button 
                                className={`${styles.tab} ${mode === 'protect' ? styles.active : ''}`}
                                onClick={() => { setMode('protect'); reset() }}
                            >
                                <ShieldCheck size={18} /> Protect PDF
                            </button>
                            <button 
                                className={`${styles.tab} ${mode === 'unlock' ? styles.active : ''}`}
                                onClick={() => { setMode('unlock'); reset() }}
                            >
                                <Unlock size={18} /> Unlock PDF
                            </button>
                        </div>
                    </div>

                    {!file ? (
                        <div className={styles.uploadWrapper}>
                            <UploadArea
                                onFileSelect={handleFileSelect}
                                accept=".pdf"
                                title={mode === 'protect' ? "Upload PDF untuk Dikunci" : "Upload PDF Terkunci"}
                                description="Seret & lepas atau klik untuk memilih file PDF"
                                icon={mode === 'protect' ? Lock : Unlock}
                            />
                            {error && (
                                <div className={styles.errorBanner}>
                                    <XCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.workspace}>
                            <div className={styles.fileCard}>
                                <div className={styles.fileIconWrapper}>
                                    <FileText size={32} strokeWidth={1.5} />
                                </div>
                                <div className={styles.fileDetails}>
                                    <div className={styles.fileName}>{file.name}</div>
                                    <div className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                {!isSuccess && (
                                    <button onClick={reset} className={styles.changeFileBtn} title="Ganti File">
                                        <RefreshCcw size={18} />
                                    </button>
                                )}
                            </div>

                            {!isSuccess ? (
                                <div className={styles.actionArea}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>
                                            {mode === 'protect' ? 'Set Password Baru' : 'Masukkan Password File'}
                                        </label>
                                        <div className={styles.passwordWrapper}>
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                className={styles.input}
                                                placeholder={mode === 'protect' ? 'Ketik password rahasia...' : 'Password untuk membuka...'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoFocus
                                            />
                                            <button 
                                                className={styles.togglePassword}
                                                onClick={() => setShowPassword(!showPassword)}
                                                type="button"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {mode === 'protect' && (
                                            <p className={styles.hint}>Password ini tidak bisa dipulihkan jika lupa.</p>
                                        )}
                                    </div>

                                    {error && (
                                        <div className={styles.errorInline}>
                                            <XCircle size={16} /> {error}
                                        </div>
                                    )}
                                    
                                    <div className={styles.btnGroup}>
                                        <button onClick={reset} className={styles.btnSecondary}>
                                            Batal
                                        </button>
                                        <button 
                                            onClick={handleProcess} 
                                            className={styles.btnPrimary}
                                            disabled={isProccessing || !password}
                                        >
                                            {isProccessing ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} /> 
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    {mode === 'protect' ? 'Kunci PDF' : 'Buka PDF'} 
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.successState}>
                                    <div className={styles.successIcon}>
                                        <Check size={40} />
                                    </div>
                                    <h3>Berhasil!</h3>
                                    <p>File PDF Anda telah berhasil {mode === 'protect' ? 'dikunci' : 'dibuka'} dan didownload.</p>
                                    
                                    <div className={styles.successActions}>
                                        <button onClick={reset} className={styles.btnPrimary}>
                                            <RefreshCcw size={18} /> Proses File Lain
                                        </button>
                                    </div>
                                </div>
                            )}
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
