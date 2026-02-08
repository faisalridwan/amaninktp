'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function Home() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    const features = [
        {
            icon: '🛡️',
            title: 'Watermark KTP',
            description: 'Tambahkan teks watermark pada scan KTP Anda untuk mencegah penyalahgunaan data saat verifikasi online.',
            href: '/watermark',
            btnText: 'Coba Sekarang',
            btnStyle: 'primary'
        },
        {
            icon: '✍️',
            title: 'TTD Digital',
            description: 'Buat tanda tangan digital transparan dengan mudah. Atur warna dan ketebalan sesuai kebutuhan.',
            href: '/signature',
            btnText: 'Buat TTD',
            btnStyle: 'accent'
        }
    ]

    const trustBadges = [
        { emoji: '🔒', text: '100% Client-Side' },
        { emoji: '🚫', text: 'Tanpa Upload Server' },
        { emoji: '⚡', text: 'Tanpa Login' },
        { emoji: '🇮🇩', text: 'Karya Lokal' }
    ]

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main>
                {/* Hero Section */}
                <header className={styles.hero}>
                    <div className="container">
                        <h1 className={styles.heroTitle}>
                            Watermark KTP &<br />
                            <span>Tanda Tangan Online</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Solusi aman untuk melindungi identitas Anda. Semua proses dilakukan
                            di browser tanpa mengirim data ke server manapun.
                        </p>
                        <div className={styles.ctaGroup}>
                            <Link href="/watermark" className="neu-btn primary">
                                🛡️ Mulai Watermark
                            </Link>
                            <Link href="/signature" className="neu-btn accent">
                                ✍️ Buat Tanda Tangan
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Features Section */}
                <section className="container">
                    <div className={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div key={index} className={`neu-card ${styles.featureCard}`}>
                                <div className={styles.featureIcon}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <Link href={feature.href} className={`neu-btn ${feature.btnStyle}`}>
                                    {feature.btnText}
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trust Section */}
                <section className={styles.trustSection}>
                    <div className="container">
                        <h2>Keamanan Terjamin</h2>
                        <div className={styles.trustBadges}>
                            {trustBadges.map((badge, index) => (
                                <div key={index} className={styles.trustBadge}>
                                    <span className={styles.emoji}>{badge.emoji}</span>
                                    {badge.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />

            <DonationModal
                isOpen={isDonationOpen}
                onClose={() => setIsDonationOpen(false)}
            />
        </>
    )
}
