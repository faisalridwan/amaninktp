'use client'

import { History, GitBranch, Sparkles, Shield, Monitor, Smartphone, Globe, Heart, Minimize2, EyeOff, Scissors, Layout, QrCode, ScissorsLineDashed, Move, RotateCw, Sigma, FileEdit, ListOrdered, Braces, Fingerprint, Palette, Trash2, FileDiff, Type, RefreshCw, FileStack, Search, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function ChangelogPage() {
    const changelog = [
        {
            version: '1.9.1',
            date: '17 Februari 2026',
            title: 'Creative & Developer Tools',
            description: 'Memperkenalkan 6 tools baru untuk produktivitas developer dan konten kreator, serta perbaikan UI dan integrasi KaTeX.',
            changes: [
                { icon: Sigma, text: 'LaTeX Editor: Tulis rumus matematika kompleks dan export menjadi gambar PNG/SVG transparan dengan KaTeX.' },
                { icon: FileEdit, text: 'Bulk Renamer: Ganti nama banyak file sekaligus dengan pola prefix, suffix, dan penomoran otomatis.' },
                { icon: ListOrdered, text: 'PDF Page Numberer: Tambahkan nomor halaman pada dokumen PDF dengan posisi dan font yang dapat dikustomisasi.' },
                { icon: Palette, text: 'CSS Gradient Generator: Buat gradasi warna CSS linear/radial yang indah secara visual.' },
                { icon: Braces, text: 'JSON Formatter: Format, validasi, dan minify data JSON dengan highlight syntax error.' },
                { icon: Fingerprint, text: 'Hash Generator: Cek integritas file dengan checksum MD5, SHA-1, SHA-256, dan SHA-512.' },
                { icon: Monitor, text: 'UI Update: Standardisasi desain Hero Section untuk semua halaman tool.' }
            ]
        },
        {
            version: '1.8.0',
            date: '16 Februari 2026',
            title: 'Network & Privacy Tools',
            description: 'Penambahan alat untuk jaringan dan privasi metadata foto.',
            changes: [
                { icon: Globe, text: 'IP Check: Lihat informasi detail Public IP, ISP, dan Lokasi Anda.' },
                { icon: Trash2, text: 'Exif Remover: Hapus metadata lokasi GPS dan info kamera sensitif dari foto sebelum diupload ke sosmed.' }
            ]
        },
        {
            version: '1.7.0',
            date: '15 Februari 2026',
            title: 'Visual Tools Update',
            description: 'Fitur baru untuk desainer dan developer web.',
            changes: [
                { icon: Palette, text: 'Color Picker: Ambil sampel warna dari gambar/layar (EyeDropper API) dan dapatkan kode HEX/RGB.' },
                { icon: FileDiff, text: 'Diff Checker: Bandingkan perbedaan antara dua teks kode atau dokumen secara side-by-side.' }
            ]
        },
        {
            version: '1.6.0',
            date: '14 Februari 2026',
            title: 'Device Mockup Generator',
            description: 'Membuat presentasi desain aplikasi lebih profesional.',
            changes: [
                { icon: Smartphone, text: 'Device Mockup: Bingkai screenshot aplikasi ke dalam frame HP (iPhone/Android) atau Laptop yang realistik.' }
            ]
        },
        {
            version: '1.5.0',
            date: '13 Februari 2026',
            title: 'Conversion Tools',
            description: 'Konversi format gambar dan ekstraksi teks dengan AI.',
            changes: [
                { icon: Type, text: 'OCR (Image to Text): Ekstrak tulisan dari gambar scan dokumen atau foto papan tulis.' },
                { icon: RefreshCw, text: 'Image Converter: Ubah format modern web (HEIC, WebP) menjadi format standar (JPG, PNG) agar kompatibel.' }
            ]
        },
        {
            version: '1.4.0',
            date: '12 Februari 2026',
            title: 'Security Suite',
            description: 'Peningkatan fitur keamanan data pribadi.',
            changes: [
                { icon: Shield, text: 'Password Generator: Buat password acak yang kuat dengan kustomisasi karakter.' },
                { icon: Lock, text: 'File Encryptor: Amankan file rahasia dengan enkripsi AES-GCM standar militer.' }
            ]
        },
        {
            version: '1.3.0',
            date: '11 Februari 2026',
            title: 'Document Processing Update',
            description: 'Fitur penggabungan dan analisis dokumen kependudukan.',
            changes: [
                { icon: FileStack, text: 'Merge PDF: Gabungkan banyak file PDF dan Gambar menjadi satu dokumen utuh.' },
                { icon: Search, text: 'NIK Parser: Cek informasi daerah, tanggal lahir, dan jenis kelamin dari nomor KTP (tanpa koneksi database pemerintah).' }
            ]
        },
        {
            version: '1.2.0',
            date: '10 Februari 2026',
            title: 'AI Background Removal & Advanced Photo Gen',
            description: 'Update besar untuk pengolahan gambar dan dokumen. Menghadirkan AI Background Remover dan fitur-fitur manipulasi PDF baru.',
            changes: [
                { icon: Scissors, text: 'Background Remover: Hapus latar belakang foto otomatis menggunakan AI langsung di browser.' },
                { icon: Layout, text: 'Advanced Photo Gen: Fitur resize cerdas dengan DPI kontrol dan preset ukuran pas foto.' },
                { icon: QrCode, text: 'QR Code Generator: Buat kode QR kustom untuk URL, teks, atau WiFi (Beta).' },
                { icon: ScissorsLineDashed, text: 'Split PDF: Pisah halaman PDF menjadi dokumen terpisah dengan mudah.' },
                { icon: Move, text: 'Rearrange PDF: Atur ulang urutan halaman PDF secara visual.' },
                { icon: RotateCw, text: 'Rotate PDF: Putar halaman PDF yang miring atau terbalik permanen.' },
                { icon: Globe, text: 'Tech Stack Upgrade: Migrasi ke Next.js 16.1.6 untuk performa maksimal.' }
            ]
        },
        {
            version: '1.1.0',
            date: '9 Februari 2026',
            title: 'New Tools: Compress & Redact',
            description: 'Penambahan fitur produktivitas baru: Kompres Foto/PDF dan Sensor Data (Redaction) untuk keamanan dokumen yang lebih lengkap.',
            changes: [
                { icon: Minimize2, text: 'Kompres Foto & PDF: Perkecil ukuran dokumen Anda secara instan tanpa mengurangi kualitas terbaca.' },
                { icon: EyeOff, text: 'Redact / Sensor Data: Tutup informasi sensitif (NIK, Nama, dll) pada dokumen langsung di browser.' },
                { icon: Shield, text: 'Tetap 100% Client-Side: Fitur baru ini juga berjalan sepenuhnya di perangkat Anda, tanpa upload ke server.' }
            ]
        },
        {
            version: '1.0.0',
            date: '8 Februari 2026',
            title: 'Initial Release (Public)',
            description: 'Peluncuran perdana Amanin Data - Solusi terpadu untuk privasi dokumen identitas masyarakat Indonesia.',
            changes: [
                { icon: Sparkles, text: 'Fitur Utama: Watermark PDF dan Image serta Tanda Tangan Digital.' },
                { icon: Shield, text: 'Privasi: Seluruh pemrosesan dilakukan di sisi klien (browser), 100% tanpa upload ke server.' },
                { icon: Monitor, text: 'Desain Premium: Antarmuka Neumorphic yang modern, tenang, dan mudah digunakan.' },
                { icon: Smartphone, text: 'Responsive: Optimal digunakan di perangkat desktop, tablet, maupun smartphone.' },
                { icon: Heart, text: 'Donasi Terintegrasi: Dukung pengembangan proyek via QRIS, Bank Jago, dan PayPal.' },
                { icon: Globe, text: 'Open Source: Dibangun dengan teknologi terbaik seperti Next.js, React, dan jsPDF.' }
            ]
        }
    ]

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>📜 Riwayat <span>Perubahan</span></h1>
                    <p className={styles.heroSubtitle}>
                        Ikuti perkembangan fitur dan pembaruan sistem Amanin Data.
                    </p>
                </header>

                <div className={styles.timeline}>
                    {changelog.map((entry, index) => (
                        <div key={index} className={styles.entry}>
                            <div className={styles.versionBadge}>
                                <GitBranch size={16} /> v{entry.version}
                            </div>
                            <div className={styles.date}>{entry.date}</div>

                            <div className={`neu-card no-hover ${styles.card}`}>
                                <h2 className={styles.title}>{entry.title}</h2>
                                <p className={styles.description}>{entry.description}</p>

                                <ul className={styles.changeList}>
                                    {entry.changes.map((change, i) => (
                                        <li key={i}>
                                            <change.icon size={18} className={styles.icon} />
                                            <span>{change.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </>
    )
}
