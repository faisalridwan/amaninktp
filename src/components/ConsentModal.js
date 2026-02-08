'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, ChevronDown, ChevronUp, Heart } from 'lucide-react'
import styles from './ConsentModal.module.css'

export default function ConsentModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        const hasConsented = localStorage.getItem('amaninktp_consent')
        if (!hasConsented) {
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('amaninktp_consent', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className={styles.banner}>
            <div className={styles.container}>
                <div className={styles.mainRow}>
                    <div className={styles.info}>
                        <ShieldCheck size={20} className={styles.icon} />
                        <p className={styles.shortMsg}>
                            Data Anda 100% aman dan diproses di perangkat Anda.
                            {!isExpanded && <button className={styles.readMoreBtn} onClick={() => setIsExpanded(true)}>Selengkapnya <ChevronDown size={14} /></button>}
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <a href="https://amaninktp.qreatip.com/#donate" className={styles.donateBtn}>
                            <Heart size={16} /> Donasi
                        </a>
                        <button className={styles.acceptBtn} onClick={handleAccept}>
                            Saya Mengerti
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className={styles.expandedContent}>
                        <p>
                            <strong>AmaninKTP</strong> adalah aplikasi open-source yang memproses seluruh data dokumen Anda secara <strong>100% Client-Side</strong>.
                            Artinya, gambar Anda <strong>TIDAK PERNAH</strong> diunggah ke server mana pun.
                            Data sementara akan terhapus otomatis saat tab ditutup.
                        </p>
                        <button className={styles.showLessBtn} onClick={() => setIsExpanded(false)}>
                            Tutup <ChevronUp size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
