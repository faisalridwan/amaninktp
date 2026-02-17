'use client'

import { useState, useCallback } from 'react'
import {
    Shield, Lock, Unlock, FileText, X, Eye, EyeOff, Key, Upload, Download, Check
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function EncryptPage() {
    const [file, setFile] = useState(null)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [status, setStatus] = useState(null) // { type: 'success' | 'error' | 'processing', message: '' }
    const [isDragging, setIsDragging] = useState(false)

    // Crypto Constants
    const SALT_LENGTH = 16
    const IV_LENGTH = 12
    const ALGORITHM = 'AES-GCM'
    const PBKDF2_ITERATIONS = 100000

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
            setStatus(null)
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setStatus(null)
        }
    }

    const deriveKey = async (password, salt) => {
        const enc = new TextEncoder()
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            enc.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        )
        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: ALGORITHM, length: 256 },
            false,
            ['encrypt', 'decrypt']
        )
    }

    const encryptFile = async () => {
        if (!file || !password) return

        try {
            setStatus({ type: 'processing', message: 'Mengenkripsi file...' })

            // 1. Prepare Salt & IV
            const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
            const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))

            // 2. Derive Key
            const key = await deriveKey(password, salt)

            // 3. Read File
            const fileData = await file.arrayBuffer()

            // 4. Encrypt
            const encryptedContent = await window.crypto.subtle.encrypt(
                { name: ALGORITHM, iv: iv },
                key,
                fileData
            )

            // 5. Combine: Salt + IV + Content
            const encryptedFile = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength)
            encryptedFile.set(salt, 0)
            encryptedFile.set(iv, salt.length)
            encryptedFile.set(new Uint8Array(encryptedContent), salt.length + iv.length)

            // 6. Download
            const blob = new Blob([encryptedFile], { type: 'application/octet-stream' })
            downloadBlob(blob, file.name + '.enc')

            setStatus({ type: 'success', message: 'File berhasil dienkripsi!' })
        } catch (error) {
            console.error(error)
            setStatus({ type: 'error', message: 'Gagal mengenkripsi file. ' + error.message })
        }
    }

    const decryptFile = async () => {
        if (!file || !password) return

        try {
            setStatus({ type: 'processing', message: 'Mendekripsi file...' })

            // 1. Read File
            const fileData = await file.arrayBuffer()
            const dataView = new Uint8Array(fileData)

            if (dataView.length < SALT_LENGTH + IV_LENGTH) {
                throw new Error('File rusak atau bukan file enkripsi yang valid.')
            }

            // 2. Extract Salt, IV, Content
            const salt = dataView.slice(0, SALT_LENGTH)
            const iv = dataView.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
            const encryptedContent = dataView.slice(SALT_LENGTH + IV_LENGTH)

            // 3. Derive Key
            const key = await deriveKey(password, salt)

            // 4. Decrypt
            const decryptedContent = await window.crypto.subtle.decrypt(
                { name: ALGORITHM, iv: iv },
                key,
                encryptedContent
            )

            // 5. Download
            // Remove .enc extension if present
            let originalName = file.name.replace(/\.enc$/, '')
            // If decrypting a file that didn't have .enc, maybe prepend decrypted_?
            if (originalName === file.name) originalName = 'decrypted_' + file.name

            const blob = new Blob([decryptedContent])
            downloadBlob(blob, originalName)

            setStatus({ type: 'success', message: 'File berhasil didekripsi!' })
        } catch (error) {
            console.error(error)
            setStatus({ type: 'error', message: 'Gagal mendekripsi file. Password salah atau file rusak.' })
        }
    }

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        🔐 Enkripsi File <span>Aman</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Amankan file rahasia dengan enkripsi AES-GCM (Military Grade).
                        <br />Password Anda adalah kuncinya. Jangan sampai lupa!
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Encryption
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>

                        {!file ? (
                            <div
                                className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <Upload size={48} className={styles.dropIcon} />
                                <h3 className={styles.dropText}>Klik atau Drag file ke sini</h3>
                                <p className={styles.dropSubtext}>Mendukung semua jenis file (PDF, Doc, Gambar, ZIP, dll)</p>
                                <input type="file" id="file-upload" onChange={handleFileSelect} hidden />
                            </div>
                        ) : (
                            <div className={styles.fileInfo}>
                                <div className={styles.fileName}>
                                    <FileText size={24} color="var(--primary-dark)" />
                                    <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button className={styles.removeBtn} onClick={() => { setFile(null); setStatus(null); }}>
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        <div className={styles.controls}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Password Enkripsi</label>
                                <div className={styles.passwordInputWrapper}>
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={styles.passwordInput}
                                        style={{ paddingLeft: '44px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan password rahasia..."
                                    />
                                    <button
                                        className={styles.togglePasswordBtn}
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={encryptFile}
                                    disabled={!file || !password}
                                >
                                    <Lock size={20} /> Enkripsi File
                                </button>
                                <button
                                    className={styles.btnSecondary}
                                    onClick={decryptFile}
                                    disabled={!file || !password}
                                >
                                    <Unlock size={20} /> Dekripsi File
                                </button>
                            </div>
                        </div>

                        {status && (
                            <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                                {status.type === 'success' && <Check size={20} />}
                                {status.type === 'error' && <X size={20} />}
                                {status.type === 'processing' && <span className="spinner">⏳</span>}
                                {status.message}
                            </div>
                        )}
                    </div>
                    <TrustSection />
                    <GuideSection toolId="encrypt" />
                </div>
            </main>
            <Footer />
        </>
    )
}
