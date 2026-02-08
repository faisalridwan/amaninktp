'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileImage, Shield, CreditCard, Users, FileText, Building, File, Upload, Crop, Type, Palette, Download, Move, RotateCcw, PenTool, Eraser, Lock, Server, Zap, Trash2, Heart, Code } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function AboutPage() {
    const documentTypes = [
        { icon: CreditCard, label: 'KTP', desc: 'Kartu Tanda Penduduk' },
        { icon: CreditCard, label: 'SIM', desc: 'Surat Izin Mengemudi' },
        { icon: Users, label: 'Kartu Keluarga', desc: 'Dokumen keluarga' },
        { icon: FileText, label: 'Paspor', desc: 'Dokumen perjalanan' },
        { icon: Building, label: 'NPWP', desc: 'Nomor Pokok Wajib Pajak' },
        { icon: File, label: 'Dokumen Lain', desc: 'Ijazah, akta, dll' },
    ]

    const watermarkFeatures = [
        { icon: Upload, title: 'Upload Fleksibel', desc: 'Klik, drag & drop, atau paste (Ctrl+V) gambar dengan mudah' },
        { icon: Crop, title: 'Crop Gambar', desc: 'Potong area dokumen dengan grid guide untuk hasil presisi' },
        { icon: Type, title: 'Teks Kustom', desc: 'Tulis watermark sesuai kebutuhan atau gunakan template otomatis' },
        { icon: Palette, title: 'Warna & Style', desc: 'Atur font, warna, ukuran, dan transparansi watermark' },
        { icon: Move, title: 'Drag & Resize', desc: 'Posisikan watermark di mana saja dengan mode satu teks' },
        { icon: RotateCcw, title: 'Rotasi Bebas', desc: 'Putar watermark dari -180° hingga 180° sesuai selera' },
        { icon: Download, title: 'Export Mudah', desc: 'Download hasil sebagai PNG berkualitas tinggi atau PDF' },
        { icon: Shield, title: 'Auto Verifikasi', desc: 'Tambah tanggal otomatis untuk bukti waktu penggunaan' },
    ]

    const signatureFeatures = [
        { icon: PenTool, title: 'Kanvas Digital', desc: 'Tulis tanda tangan dengan mouse, trackpad, atau layar sentuh' },
        { icon: Palette, title: 'Pilihan Warna', desc: 'Lima warna pena tersedia: hitam, biru, merah, hijau, ungu' },
        { icon: Type, title: 'Ketebalan Pena', desc: 'Atur ketebalan garis dari tipis hingga tebal sesuai kebutuhan' },
        { icon: Eraser, title: 'Hapus & Ulang', desc: 'Clear canvas kapan saja untuk membuat tanda tangan baru' },
    ]

    const securityFeatures = [
        { icon: Lock, title: '100% Client-Side', desc: 'Semua proses terjadi di browser Anda, bukan di server kami' },
        { icon: Server, title: 'Tanpa Upload', desc: 'Gambar tidak pernah dikirim ke server manapun di internet' },
        { icon: Zap, title: 'Tanpa Login', desc: 'Langsung pakai tanpa perlu membuat akun atau mendaftar' },
        { icon: Trash2, title: 'Tidak Disimpan', desc: 'Data hilang otomatis saat Anda menutup tab browser' },
    ]

    const stats = [
        { value: '100%', label: 'Gratis Selamanya' },
        { value: '0', label: 'Data Disimpan' },
        { value: '∞', label: 'Penggunaan Tanpa Batas' },
    ]

    return (
        <>
            <Navbar />

            <main className="container">
                {/* Hero */}
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>Tentang <span>AmaninKTP</span></h1>
                    <p className={styles.heroSubtitle}>
                        Aplikasi gratis buatan Indonesia untuk melindungi dokumen identitas dengan watermark.
                        100% aman, 100% privat, langsung di browser Anda.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/" className={styles.ctaBtn}>
                            <Shield size={18} /> Mulai Watermark
                        </Link>
                    </div>
                </header>

                {/* Stats */}
                <section className={styles.statsSection}>
                    {stats.map((stat, i) => (
                        <div key={i} className={`neu-card no-hover ${styles.statCard}`}>
                            <span className={styles.statValue}>{stat.value}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </section>

                {/* Document Types Section */}
                <section className={styles.docSection}>
                    <h2 className={styles.sectionTitle}>
                        <FileImage size={24} /> Melindungi Berbagai Dokumen Anda
                    </h2>
                    <p className={styles.sectionDesc}>
                        Aman dari penyalahgunaan digital! Watermark KTP membantu melindungi berbagai dokumen penting Anda — dari KTP, SIM, hingga paspor — dengan mudah dan profesional.
                    </p>
                    <div className={styles.docGrid}>
                        {documentTypes.map((doc, i) => (
                            <div key={i} className={`neu-card no-hover ${styles.docCard}`}>
                                <doc.icon size={32} />
                                <h3>{doc.label}</h3>
                                <p>{doc.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Watermark Features */}
                <section className={styles.featureSection}>
                    <h2 className={styles.sectionTitle}>
                        <FileImage size={24} /> Fitur Watermark KTP
                    </h2>
                    <p className={styles.sectionDesc}>
                        Lengkap dan mudah digunakan untuk semua tingkat pengguna.
                    </p>
                    <div className={styles.featureGrid}>
                        {watermarkFeatures.map((f, i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <f.icon size={22} />
                                </div>
                                <div>
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Signature Features */}
                <section className={styles.featureSection}>
                    <h2 className={styles.sectionTitle}>
                        <PenTool size={24} /> Fitur Tanda Tangan
                    </h2>
                    <p className={styles.sectionDesc}>
                        Buat tanda tangan digital transparan untuk dokumen Anda.
                    </p>
                    <div className={styles.featureGrid}>
                        {signatureFeatures.map((f, i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <f.icon size={22} />
                                </div>
                                <div>
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Security */}
                <section className={styles.featureSection}>
                    <h2 className={styles.sectionTitle}>
                        <Shield size={24} /> Keamanan & Privasi
                    </h2>
                    <p className={styles.sectionDesc}>
                        Privasi Anda adalah prioritas utama kami.
                    </p>
                    <div className={styles.featureGrid}>
                        {securityFeatures.map((f, i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <f.icon size={22} />
                                </div>
                                <div>
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Open Source */}
                <section className={styles.openSourceSection}>
                    <div className={`neu-card no-hover ${styles.openSourceCard}`}>
                        <Code size={32} />
                        <h3>Dibangun dengan Teknologi Open Source</h3>
                        <p>AmaninKTP menggunakan Next.js, React, Lucide Icons, dan jsPDF untuk memberikan pengalaman terbaik.</p>
                        <Link href="/libraries" className={styles.textLink}>Lihat Perpustakaan →</Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}
