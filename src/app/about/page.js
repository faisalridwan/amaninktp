
'use client'

import Link from 'next/link'
import { FileImage, Shield, CreditCard, Users, FileText, Building, File, Upload, Crop, Type, Palette, Download, Move, RotateCcw, PenTool, Eraser, Lock, Server, Zap, Trash2, Heart, Code, Camera, Scissors, FileStack, EyeOff, User, Minimize2, CheckCircle, Smartphone, Globe, QrCode, RotateCw, ScissorsLineDashed, RefreshCw, FileDiff, Sigma, FileEdit, ListOrdered, Fingerprint, Braces } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function AboutPage() {
    const stats = [
        { value: '100%', label: 'Gratis Selamanya' },
        { value: '0', label: 'Data Disimpan' },
        { value: '27+', label: 'Tools Produktif' },
    ]

    const tools = [
        {
            icon: FileImage,
            title: 'Watermark Dokumen',
            desc: 'Lindungi identitas dengan watermark anti-maling. Mendukung edit massal dan multi-halaman.',
            href: '/'
        },
        {
            icon: PenTool,
            title: 'Tanda Tangan Digital',
            desc: 'Buat tanda tangan transparan profesional dan tempel langsung ke dokumen PDF/Gambar.',
            href: '/signature'
        },
        {
            icon: Lock,
            title: 'Password Generator',
            desc: 'Buat password super kuat dengan kustomisasi panjang dan karakter.',
            href: '/password-generator'
        },
        {
            icon: Shield,
            title: 'File Encryptor',
            desc: 'Amankan file rahasia dengan enkripsi AES-GCM client-side.',
            href: '/encrypt'
        },
        {
            icon: RefreshCw,
            title: 'Image Converter',
            desc: 'Ubah format gambar HEIC/WebP ke JPG/PNG dengan mudah.',
            href: '/image-converter'
        },
        {
            icon: Smartphone,
            title: 'Device Mockup',
            desc: 'Bingkai screenshot Anda ke dalam frame HP atau Laptop estetik.',
            href: '/mockup-generator'
        },
        {
            icon: Palette,
            title: 'Color Picker',
            desc: 'Ambil sampel warna dari gambar atau layar (EyeDropper).',
            href: '/color-picker'
        },
        {
            icon: Trash2,
            title: 'Hapus EXIF',
            desc: 'Hapus metadata lokasi dan info kamera dari foto demi privasi.',
            href: '/exif-remover'
        },
        {
            icon: FileDiff,
            title: 'Diff Checker',
            desc: 'Bandingkan perbedaan antara dua teks secara visual side-by-side.',
            href: '/diff-checker'
        },
        {
            icon: Globe,
            title: 'Cek IP Saya',
            desc: 'Lihat informasi public IP, lokasi, dan detail perangkat Anda.',
            href: '/ip-check'
        },
        {
            icon: Camera,
            title: 'Photo Generator',
            desc: 'Buat pas foto otomatis (2x3, 3x4, 4x6), ganti background warna, dan atur DPI cetak.',
            href: '/photo-generator'
        },
        {
            icon: Scissors,
            title: 'Hapus Background',
            desc: 'Hapus latar belakang foto otomatis dengan AI canggih dalam hitungan detik.',
            href: '/remove-background'
        },
        {
            icon: FileStack,
            title: 'Gabung Dokumen',
            desc: 'Satukan banyak file PDF dan Gambar menjadi satu file PDF yang rapi.',
            href: '/merge'
        },
        {
            icon: EyeOff,
            title: 'Sensor Data',
            desc: 'Blur atau tutup data sensitif pada dokumen sebelum dibagikan ke orang lain.',
            href: '/redact'
        },
        {
            icon: Minimize2,
            title: 'Kompres File',
            desc: 'Kecilkan ukuran foto dan PDF hingga 90% tanpa mengurangi kualitas visual.',
            href: '/compress'
        },
        {
            icon: Type,
            title: 'OCR (Image to Text)',
            desc: 'Salin teks dari gambar secara otomatis.',
            href: '/ocr'
        },
        {
            icon: User,
            title: 'Cek NIK',
            desc: 'Cek informasi daerah, tanggal lahir, dan jenis kelamin dari nomor NIK KTP.',
            href: '/nik-parser'
        },
        {
            icon: QrCode,
            title: 'QR Generator',
            desc: 'Buat kode QR kustom untuk URL, teks, atau WiFi secara instan dan aman.',
            href: '/qrcode'
        },
        {
            icon: ScissorsLineDashed,
            title: 'Split Dokumen',
            desc: 'Pisahkan halaman PDF menjadi dokumen baru secara mandiri di browser.',
            href: '/split'
        },
        {
            icon: Move,
            title: 'Rearrange Dokumen',
            desc: 'Ubah urutan halaman PDF dengan mudah melalui antarmuka visual.',
            href: '/rearrange'
        },
        {
            icon: RotateCw,
            title: 'Rotate Dokumen',
            desc: 'Putar halaman PDF yang miring atau terbalik secara permanen & aman.',
            href: '/rotate'
        },
        {
            icon: Sigma,
            title: 'LaTeX Editor',
            desc: 'Tulis rumus matematika kompleks dan export menjadi gambar PNG/SVG transparan.',
            href: '/latex-editor'
        },
        {
            icon: FileEdit,
            title: 'Bulk Renamer',
            desc: 'Ganti nama banyak file sekaligus dengan pola prefix, suffix, dan penomoran.',
            href: '/bulk-renamer'
        },
        {
            icon: ListOrdered,
            title: 'PDF Page Numberer',
            desc: 'Tambahkan nomor halaman otomatis pada dokumen PDF dengan posisi kustom.',
            href: '/pdf-page-number'
        },
        {
            icon: Palette,
            title: 'CSS Gradient Generator',
            desc: 'Buat gradasi warna CSS yang indah secara visual dan salin kodenya.',
            href: '/css-gradient'
        },
        {
            icon: Fingerprint,
            title: 'Hash Generator',
            desc: 'Generate checksum MD5, SHA-1, SHA-256 untuk verifikasi integritas file/teks.',
            href: '/hash-generator'
        },
        {
            icon: Braces,
            title: 'JSON Formatter',
            desc: 'Format, validasi, dan minify data JSON Anda agar mudah dibaca.',
            href: '/json-formatter'
        }
    ]

    const whyChooseUs = [
        {
            icon: Lock,
            title: '100% Client-Side',
            desc: 'Semua proses terjadi di browser Anda. File tidak pernah diupload ke server kami.'
        },
        {
            icon: Zap,
            title: 'Cepat & Ringan',
            desc: 'Tanpa antrian server. Proses instan karena menggunakan resource perangkat Anda sendiri.'
        },
        {
            icon: Globe,
            title: 'Karya Anak Bangsa',
            desc: 'Dibuat dengan bangga di Indonesia untuk keamanan data masyarakat Indonesia.'
        },
        {
            icon: Smartphone,
            title: 'Mobile Friendly',
            desc: 'Desain responsif yang nyaman digunakan di HP, Tablet, maupun Desktop.'
        }
    ]

    return (
        <>
            <Navbar />

            <main className="container">
                {/* Hero */}
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>Tentang <span>Amanin Data</span></h1>
                    <p className={styles.heroSubtitle}>
                        Platform "All-in-One" untuk mengelola dan mengamankan dokumen digital Anda.
                        Gratis, Aman, dan Tanpa Server.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/" className={styles.ctaBtn}>
                            <Shield size={18} /> Mulai Amankan Data
                        </Link>
                        <Link href="/guide" className={styles.ctaBtnAlt}>
                            Lihat Panduan
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

                {/* All Tools Section */}
                <section className={styles.featureSection}>
                    <h2 className={styles.sectionTitle}>
                        <Zap size={24} /> 27 Tools dalam 1 Aplikasi - <span>Amanin Data</span>
                    </h2>
                    <p className={styles.sectionDesc}>
                        Tidak perlu install banyak aplikasi. Semua kebutuhan dokumen digital Anda ada di sini.
                    </p>
                    <div className={styles.toolGrid}>
                        {tools.map((tool, i) => (
                            <Link key={i} href={tool.href} className={styles.toolCard}>
                                <div className={styles.toolIcon}>
                                    <tool.icon size={24} />
                                </div>
                                <div className={styles.toolContent}>
                                    <h3>{tool.title}</h3>
                                    <p>{tool.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className={styles.docSection}>
                    <h2 className={styles.sectionTitle}>
                        <Shield size={24} /> Mengapa Amanin Data?
                    </h2>
                    <p className={styles.sectionDesc}>
                        Kami berkomitmen menjaga privasi Anda dengan teknologi Client-Side Processing.
                    </p>
                    <div className={styles.whyGrid}>
                        {whyChooseUs.map((item, i) => (
                            <div key={i} className={`neu-card no-hover ${styles.whyCard}`}>
                                <div className={styles.whyIconWrapper}>
                                    <item.icon size={32} />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tech Stack */}
                <section className={styles.openSourceSection}>
                    <div className={`neu-card no-hover ${styles.openSourceCard}`}>
                        <Code size={32} />
                        <h3>Dibangun dengan Teknologi Modern</h3>
                        <p>
                            Amanin Data dibangun menggunakan <strong>Next.js 16</strong> dan teknologi web modern lainnya.
                            Kami memanfaatkan library canggih seperti <code>pdf-lib</code>, <code>jspdf</code>, <code>sharp</code>,
                            dan <code>background-removal</code> untuk menghadirkan fitur desktop-class langsung di browser.
                        </p>
                        <div className={styles.techTags}>
                            <span>React</span>
                            <span>Next.js</span>
                            <span>Client-Side Only</span>
                            <span>PWA Ready</span>
                        </div>
                        <br />
                        <Link href="/libraries" className={styles.textLink}>Lihat Perpustakaan →</Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}
