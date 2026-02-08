'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, FileImage, PenTool, HelpCircle, ChevronDown, ChevronUp, Shield, Lightbulb } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DonationModal from '@/components/DonationModal'
import styles from './page.module.css'

export default function GuidePage() {
    const [isDonationOpen, setIsDonationOpen] = useState(false)
    const [openFaq, setOpenFaq] = useState(null)

    const watermarkSteps = [
        'Buka halaman <strong>Watermark KTP</strong> dari menu.',
        'Upload gambar dengan klik, drag & drop, atau paste (Ctrl+V).',
        'Crop gambar jika diperlukan.',
        'Pilih jenis watermark: <strong>Menyeluruh</strong> atau <strong>Satu Teks</strong>.',
        'Tulis teks watermark atau centang "Tambah Verifikasi + Tanggal".',
        'Atur font, ukuran, rotasi, transparansi, dan warna.',
        'Download hasil sebagai <strong>PNG</strong> atau <strong>PDF</strong>.',
    ]

    const signatureSteps = [
        'Buka halaman <strong>TTD Online</strong>.',
        'Gambar tanda tangan dengan mouse atau jari.',
        'Pilih warna pena dan ketebalan garis.',
        'Klik <strong>Hapus</strong> untuk mengulang jika perlu.',
        'Download hasil PNG dengan background transparan.',
    ]

    const faqs = [
        {
            q: 'Apakah gambar saya diupload ke server?',
            a: 'Tidak. Semua proses dilakukan 100% di browser Anda. Gambar tidak pernah dikirim ke server manapun.'
        },
        {
            q: 'Apakah data saya disimpan?',
            a: 'Tidak. Setelah Anda menutup tab browser, semua data hilang permanen. Tidak ada database yang menyimpan gambar.'
        },
        {
            q: 'Apakah aplikasi ini gratis?',
            a: 'Ya, 100% gratis selamanya. Kami menerima donasi sukarela untuk pengembangan.'
        },
        {
            q: 'Format file apa yang didukung?',
            a: 'Mendukung JPG, PNG, WebP, dan format gambar standar lainnya. Hasil bisa didownload sebagai PNG atau PDF.'
        },
        {
            q: 'Bagaimana cara menghapus watermark?',
            a: 'Watermark yang sudah diterapkan tidak bisa dihapus—ini adalah tujuannya untuk melindungi dokumen Anda.'
        },
        {
            q: 'Apakah ada batasan ukuran gambar?',
            a: 'Tidak ada batasan dari kami. Namun, gambar sangat besar mungkin memakan waktu lebih lama untuk diproses.'
        },
    ]

    return (
        <>
            <Navbar onDonateClick={() => setIsDonationOpen(true)} />

            <main className="container">
                <header className={styles.hero}>
                    <h1><BookOpen size={32} /> Cara Pakai</h1>
                    <p>Panduan lengkap menggunakan AmaninKTP</p>
                </header>

                <div className={styles.guideGrid}>
                    {/* Watermark Guide */}
                    <div className={`neu-card no-hover ${styles.guideCard}`}>
                        <div className={styles.guideHeader}>
                            <FileImage size={24} />
                            <h2>Watermark KTP</h2>
                        </div>
                        <ol className={styles.stepsList}>
                            {watermarkSteps.map((step, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
                            ))}
                        </ol>
                        <Link href="/" className={styles.ctaBtn}>
                            <Shield size={16} /> Coba Watermark
                        </Link>
                    </div>

                    {/* Signature Guide */}
                    <div className={`neu-card no-hover ${styles.guideCard}`}>
                        <div className={styles.guideHeader}>
                            <PenTool size={24} />
                            <h2>Tanda Tangan</h2>
                        </div>
                        <ol className={styles.stepsList}>
                            {signatureSteps.map((step, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
                            ))}
                        </ol>
                        <Link href="/signature" className={styles.ctaBtnAlt}>
                            <PenTool size={16} /> Coba TTD
                        </Link>
                    </div>
                </div>

                {/* Tips */}
                <section className={`neu-card no-hover ${styles.tips}`}>
                    <h3><Lightbulb size={20} /> Tips Keamanan</h3>
                    <ul>
                        <li><strong>Gunakan watermark spesifik</strong> — Sertakan tujuan dan tanggal</li>
                        <li><strong>Mode Menyeluruh lebih aman</strong> — Sulit dihapus dengan editing</li>
                        <li><strong>Transparansi 30-50% optimal</strong> — Terlihat tapi data tetap jelas</li>
                        <li><strong>Jangan bagikan KTP tanpa watermark</strong></li>
                    </ul>
                </section>

                {/* FAQ */}
                <section id="faq" className={styles.faqSection}>
                    <h2><HelpCircle size={24} /> Pertanyaan Umum (FAQ)</h2>
                    <div className={styles.faqList}>
                        {faqs.map((faq, i) => (
                            <div key={i} className={`neu-card no-hover ${styles.faqItem} ${openFaq === i ? styles.open : ''}`}>
                                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span>{faq.q}</span>
                                    {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {openFaq === i && <p className={styles.faqAnswer}>{faq.a}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer onDonateClick={() => setIsDonationOpen(true)} />
            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        </>
    )
}
