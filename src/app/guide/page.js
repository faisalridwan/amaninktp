'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function GuidePage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)

    const watermarkSteps = [
        'Buka halaman <strong>Watermark KTP</strong> dari menu navigasi.',
        'Klik area upload atau tombol "Pilih file" untuk mengupload foto KTP Anda.',
        'Ketikkan teks watermark yang diinginkan, misal: <strong>"VERIFIKASI SHOPEE 2026"</strong>.',
        'Aktifkan/nonaktifkan mode <strong>Pola Tiled</strong> sesuai kebutuhan.',
        'Atur <strong>ukuran font</strong>, <strong>rotasi</strong>, dan <strong>transparansi</strong> menggunakan slider.',
        'Pilih <strong>warna teks</strong> yang diinginkan.',
        'Klik tombol <strong>Download Hasil</strong> untuk menyimpan gambar.',
    ]

    const signatureSteps = [
        'Buka halaman <strong>TTD Online</strong> dari menu navigasi.',
        'Goreskan tanda tangan Anda pada area putih yang tersedia menggunakan mouse atau jari.',
        'Pilih <strong>warna pena</strong> (Hitam, Biru, Merah, Hijau, Ungu) sesuai kebutuhan.',
        'Atur <strong>ketebalan garis</strong> menggunakan slider jika diperlukan.',
        'Jika salah, klik tombol <strong>Hapus</strong> untuk mengulang dari awal.',
        'Klik <strong>Download PNG</strong> untuk menyimpan tanda tangan dengan background transparan.',
    ]

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <div className={styles.pageHeader}>
                    <h1>📖 Cara Menggunakan</h1>
                    <p>Panduan lengkap untuk menggunakan fitur-fitur AmaninKTP dengan mudah.</p>
                </div>

                <div className={styles.guideGrid}>
                    {/* Watermark KTP Guide */}
                    <div className={`neu-card no-hover ${styles.guideCard}`}>
                        <div className={styles.guideHeader}>
                            <span className={styles.guideIcon}>🖼️</span>
                            <h2>Watermark KTP</h2>
                        </div>
                        <p className={styles.guideIntro}>
                            Lindungi foto KTP Anda dengan menambahkan watermark khusus untuk mencegah penyalahgunaan.
                        </p>
                        <ol className={styles.stepsList}>
                            {watermarkSteps.map((step, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
                            ))}
                        </ol>
                        <Link href="/watermark" className="neu-btn primary">
                            🛡️ Coba Watermark
                        </Link>
                    </div>

                    {/* TTD Online Guide */}
                    <div className={`neu-card no-hover ${styles.guideCard}`}>
                        <div className={styles.guideHeader}>
                            <span className={styles.guideIcon}>✍️</span>
                            <h2>Tanda Tangan Online</h2>
                        </div>
                        <p className={styles.guideIntro}>
                            Buat tanda tangan digital dengan background transparan untuk dokumen Anda.
                        </p>
                        <ol className={styles.stepsList}>
                            {signatureSteps.map((step, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
                            ))}
                        </ol>
                        <Link href="/signature" className="neu-btn accent">
                            ✍️ Coba Tanda Tangan
                        </Link>
                    </div>
                </div>

                {/* Tips Section */}
                <div className={`neu-card no-hover ${styles.tipsSection}`}>
                    <h3>💡 Tips Keamanan</h3>
                    <ul className={styles.tipsList}>
                        <li>
                            <strong>Gunakan watermark yang spesifik</strong> - Sertakan nama perusahaan/platform dan tanggal,
                            misal: "Hanya untuk verifikasi Shopee, 8 Feb 2026"
                        </li>
                        <li>
                            <strong>Posisikan watermark di area penting</strong> - Letakkan di bagian foto dan data penting
                            agar sulit dihapus
                        </li>
                        <li>
                            <strong>Simpan file asli dengan aman</strong> - Jangan bagikan foto KTP tanpa watermark
                        </li>
                        <li>
                            <strong>Periksa hasil sebelum mengirim</strong> - Pastikan watermark terlihat jelas namun
                            data tetap terbaca
                        </li>
                    </ul>
                </div>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
