'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Download, Copy, Check, CreditCard, QrCode, Heart } from 'lucide-react'
import { generateQRIS } from '@/utils/qris'
import styles from './DonationModal.module.css'

// Base QRIS string
const BASE_QRIS = "00020101021126610014COM.GO-JEK.WWW01189360091435688656990210G5688656990303UMI51440014ID.CO.QRIS.WWW0215ID10243341199880303UMI5204581253033605802ID5914qreatip studio6013JAKARTA TIMUR61051311062070703A01630460A8"

export default function DonationModal({ isOpen, onClose }) {
    const [amount, setAmount] = useState('')
    const [qrisCode, setQrisCode] = useState('')
    const [method, setMethod] = useState('qris')
    const [copied, setCopied] = useState(false)

    const handleAmountChange = (e) => {
        const value = e.target.value
        if (/^\d*$/.test(value)) {
            setAmount(value)
            if (qrisCode) setQrisCode('')
        }
    }

    const handleGenerate = () => {
        if (amount && parseInt(amount) >= 1000) {
            const code = generateQRIS(BASE_QRIS, amount)
            setQrisCode(code)
        }
    }

    const handleDownload = () => {
        const svg = document.getElementById('donation-qr')
        if (!svg) return

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        const serializer = new XMLSerializer()
        const svgStr = serializer.serializeToString(svg)
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            const pngUrl = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.href = pngUrl
            downloadLink.download = `donation-qris-${amount}.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
            URL.revokeObjectURL(url)
        }

        img.src = url
    }

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText('faisalridwansiregar@gmail.com')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    const formatAmount = (val) => {
        return new Intl.NumberFormat('id-ID').format(val)
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2><Heart size={20} /> Donasi</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Method Selector */}
                    <div className={styles.methodSelector}>
                        <button
                            onClick={() => setMethod('qris')}
                            className={`${styles.methodBtn} ${method === 'qris' ? styles.active : ''}`}
                        >
                            <QrCode size={16} /> QRIS
                        </button>
                        <button
                            onClick={() => setMethod('paypal')}
                            className={`${styles.methodBtn} ${method === 'paypal' ? styles.active : ''}`}
                        >
                            <CreditCard size={16} /> PayPal
                        </button>
                    </div>

                    {method === 'qris' ? (
                        <div className={styles.qrisSection}>
                            <div className={styles.inputGroup}>
                                <label>Jumlah (Rp)</label>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Masukkan jumlah (min 1000)"
                                    autoFocus
                                />
                                {amount && parseInt(amount) >= 1000 && (
                                    <span className={styles.formatted}>Rp {formatAmount(amount)}</span>
                                )}
                            </div>

                            {!qrisCode ? (
                                <button
                                    onClick={handleGenerate}
                                    disabled={!amount || parseInt(amount) < 1000}
                                    className={styles.generateBtn}
                                >
                                    Generate QRIS
                                </button>
                            ) : (
                                <div className={styles.qrResult}>
                                    <div className={styles.qrWrapper}>
                                        <QRCodeSVG
                                            id="donation-qr"
                                            value={qrisCode}
                                            size={180}
                                            level="M"
                                            includeMargin={false}
                                        />
                                    </div>

                                    <div className={styles.howTo}>
                                        <p className={styles.howToTitle}>Cara Bayar:</p>
                                        <ol>
                                            <li>Buka aplikasi pembayaran (GoPay, OVO, Dana, dll).</li>
                                            <li>Scan QR code di atas.</li>
                                            <li>Pastikan nama penerima: <strong>qreatip studio</strong>.</li>
                                            <li>Konfirmasi pembayaran.</li>
                                        </ol>
                                    </div>

                                    <button onClick={handleDownload} className={styles.downloadBtn}>
                                        <Download size={18} /> Simpan Gambar
                                    </button>

                                    <p className={styles.thankYou}>Terima kasih atas dukunganmu! ❤️</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.paypalSection}>
                            <div className={styles.paypalBox}>
                                <p className={styles.paypalLabel}>PayPal Email</p>
                                <p className={styles.paypalEmail}>faisalridwansiregar@gmail.com</p>
                                <button onClick={handleCopyEmail} className={styles.copyBtn}>
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                    {copied ? 'Tersalin' : 'Salin Email'}
                                </button>
                            </div>

                            <a
                                href="https://paypal.me/faisalridwansiregar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.paypalBtn}
                            >
                                Buka PayPal.me
                            </a>
                            <p className={styles.paypalNote}>*Biaya PayPal standar mungkin berlaku.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
