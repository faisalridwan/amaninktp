'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert, Check, X } from 'lucide-react'
import styles from './ConsentModal.module.css'

export default function ConsentModal() {
    const [isVisible, setIsVisible] = useState(false)

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
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <ShieldAlert size={32} className={styles.icon} />
                    <h2>Komitmen Keamanan & Privasi</h2>
                </div>

                <div className={styles.content}>
                    <p>
                        Halo! Selamat datang di <strong>AmaninKTP</strong>. Demi keamanan Anda, mohon perhatikan hal berikut:
                    </p>
                    <ul className={styles.list}>
                        <li>
                            <Check size={16} /> <strong>100% Client-Side:</strong> Seluruh proses watermarking dan tanda tangan dilakukan langsung di browser Anda.
                        </li>
                        <li>
                            <Check size={16} /> <strong>Tanpa Server:</strong> Gambar Anda <strong>TIDAK PERNAH</strong> diunggah ke server kami.
                        </li>
                        <li>
                            <Check size={16} /> <strong>Hapus Data:</strong> Data sementara akan hilang saat tab browser ditutup atau di-refresh.
                        </li>
                    </ul>
                    <p className={styles.footerNote}>
                        Dengan melanjutkan, Anda menyetujui bahwa aplikasi ini digunakan sebagai alat bantu keamanan dokumen secara mandiri.
                    </p>
                </div>

                <div className={styles.actions}>
                    <button className={styles.btn} onClick={handleAccept}>
                        Saya Mengerti & Setuju
                    </button>
                </div>
            </div>
        </div>
    )
}
