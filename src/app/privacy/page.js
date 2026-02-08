'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function PrivacyPage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    const privacySections = [
        {
            icon: '🔒',
            title: 'Pemrosesan Lokal (Client-Side)',
            content: [
                'AmaninKTP didesain dengan prinsip <strong>Privacy First</strong>. Seluruh proses pengeditan gambar (watermark) dan pembuatan tanda tangan dilakukan secara lokal di dalam browser perangkat Anda (Handphone/Laptop).',
                '<strong>Tidak ada gambar</strong> yang diunggah ke server kami. Server hanya berfungsi untuk mengirimkan halaman website ini kepada Anda.'
            ]
        },
        {
            icon: '🚫',
            title: 'Tanpa Penyimpanan Data',
            content: [
                'Kami tidak memiliki database untuk menyimpan gambar KTP atau tanda tangan Anda.',
                'Setelah Anda menutup tab browser, semua data sementara di memori browser akan <strong>hilang secara permanen</strong>.'
            ]
        },
        {
            icon: '⚡',
            title: 'Tanpa Login & Tracking',
            content: [
                'Anda <strong>tidak perlu mendaftar atau login</strong> untuk menggunakan layanan ini.',
                'Kami tidak menggunakan cookies pelacak atau alat analytics yang invasif.',
                'Tidak ada data pribadi yang dikumpulkan.'
            ]
        },
        {
            icon: '🛡️',
            title: 'Keamanan Terjamin',
            content: [
                'Kode sumber website dapat diperiksa melalui Developer Tools browser Anda.',
                'Semua proses berjalan 100% di sisi klien (client-side).',
                'Anda memiliki <strong>kontrol penuh</strong> atas data Anda.'
            ]
        }
    ]

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <div className={styles.pageHeader}>
                    <h1>🔐 Privasi & Keamanan Data</h1>
                    <p>Komitmen kami terhadap perlindungan privasi dan keamanan data Anda.</p>
                </div>

                <div className={`neu-card no-hover ${styles.contentCard}`}>
                    {privacySections.map((section, index) => (
                        <div key={index} className={styles.privacySection}>
                            <h3>
                                <span className={styles.sectionIcon}>{section.icon}</span>
                                {section.title}
                            </h3>
                            {section.content.map((paragraph, pIndex) => (
                                <p key={pIndex} dangerouslySetInnerHTML={{ __html: paragraph }} />
                            ))}
                        </div>
                    ))}

                    <div className={styles.highlight}>
                        <p>✅ <strong>Kesimpulan:</strong> Data Anda aman karena tidak pernah meninggalkan perangkat Anda.</p>
                    </div>

                    <div className={styles.actionButtons}>
                        <Link href="/" className="neu-btn primary">
                            🏠 Kembali ke Beranda
                        </Link>
                        <Link href="/watermark" className="neu-btn secondary">
                            🛡️ Coba Watermark
                        </Link>
                    </div>
                </div>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
