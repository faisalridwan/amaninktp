'use client'

import { useState } from 'react'
import styles from './DonationModal.module.css'

export default function DonationModal({ isOpen, onClose }) {
    const [copied, setCopied] = useState(false)

    const rekening = 'BCA 1234567890'

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(rekening)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`neu-card ${styles.modalContent}`} onClick={e => e.stopPropagation()}>
                <button className={styles.closeModal} onClick={onClose}>
                    ×
                </button>

                <h3 className={styles.modalTitle}>Dukung Kami ❤️</h3>
                <p className={styles.modalSubtitle}>
                    Bantu kami tetap semangat coding dengan secangkir kopi ☕
                </p>

                <div className={styles.qrisContainer}>
                    <div className={styles.qrisPlaceholder}>
                        <span className={styles.qrisIcon}>📱</span>
                        <p>QRIS Placeholder</p>
                        <p className={styles.qrisHint}>Scan untuk donasi</p>
                    </div>
                </div>

                <p className={styles.orText}>Atau transfer ke:</p>

                <div className={styles.rekeningContainer}>
                    <span>{rekening}</span>
                    <button
                        className={`neu-btn neu-btn-sm ${styles.copyBtn}`}
                        onClick={handleCopy}
                    >
                        {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                </div>

                <p className={styles.thankYou}>Terima kasih atas dukungannya! 🙏</p>
            </div>
        </div>
    )
}
