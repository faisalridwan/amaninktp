'use client'

import { useState } from 'react'
import { BookOpen, AlertTriangle, Lightbulb, MousePointer, Info, Shield, CheckCircle, ChevronDown, Camera, FileStack, Search, Eraser, Minimize2, Scissors, ScissorsLineDashed, Move, RotateCw, Lock, RefreshCw, Smartphone, Palette, Trash2, FileDiff, Zap, Globe, Type, Sigma, FileEdit, ListOrdered, Fingerprint, Braces } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function GuidePage() {
    const [openIndex, setOpenIndex] = useState(0)
    // Using an array of objects for steps to ensure control over rendering
    const watermarkSteps = [
        {
            title: 'Buka Aplikasi & Siapkan Dokumen',
            desc: <>Akses halaman utama <strong>Amanin Data</strong>. Anda tidak perlu mendaftar atau login. Siapkan file <em>KTP</em> atau dokumen penting lainnya (format <em>JPG, PNG</em>) yang ingin Anda beri watermark.</>

        },
        {
            title: 'Upload Dokumen',
            desc: <>Klik <strong>area upload</strong> di tengah layar, atau tarik dan lepas (<em>drag & drop</em>) file gambar Anda ke area tersebut. Sistem akan memproses dokumen di browser Anda (aman, tidak diupload ke server).</>,
            image: ''
        },
        {
            title: 'Crop & Potong (Opsional)',
            desc: <>Jika foto dokumen terlalu lebar, aktifkan mode <strong>Crop</strong>. Tarik sudut-sudut grid untuk memotong bagian yang tidak perlu, lalu klik <strong>Selesai Crop</strong>.</>,
            image: ''
        },
        {
            title: 'Pilih Mode Watermark',
            desc: <>Pilih <strong>"Full Area"</strong> untuk watermark memenuhi seluruh halaman (lebih aman), atau <strong>"Satu Teks"</strong> untuk menempatkan satu tulisan saja di posisi tertentu.</>,
            image: ''
        },
        {
            title: 'Isi Teks & Tujuan',
            desc: <>Ketik teks watermark, misalnya <em>"VERIFIKASI PINJOL"</em> atau <em>"LAMARAN KERJA"</em>. Klik tombol <strong>+ Tambah Verifikasi & Tanggal</strong> untuk otomatis menambahkan tanggal hari ini agar dokumen valid.</>,
            image: ''
        },
        {
            title: 'Kustomisasi Tampilan',
            desc: <>Atur <strong>Ukuran</strong> (besar kecil teks), <strong>Rotasi</strong> (kemiringan), dan <strong>Transparansi</strong> (agar dokumen asli tetap terbaca). Gunakan slider <strong>Jarak Horizontal/Vertikal</strong> untuk mengatur kerapatan watermark.</>,
            image: ''
        },
        {
            title: 'Download & Simpan',
            desc: <>Cek hasil preview. Jika sudah pas, klik tombol <strong>Download PNG</strong> (gambar) atau <strong>Download PDF</strong> untuk menyimpan hasilnya ke perangkat Anda.</>,
            image: ''
        }
    ]

    const signatureSteps = [
        {
            title: 'Masuk ke Menu Tanda Tangan',
            desc: <>Klik menu <strong>Tanda Tangan</strong> di navigasi atas. Halaman ini untuk membuat tanda tangan digital dan menempelkannya ke dokumen <em>PDF</em> atau <em>Gambar</em>.</>,
            image: ''
        },
        {
            title: 'Buat Tanda Tangan Baru',
            desc: <>Di area kanvas putih, goreskan tanda tangan Anda menggunakan <em>mouse</em> atau <em>layar sentuh</em>. Anda bisa ganti <strong>Warna</strong> (Hitam/Biru/Merah) dan <strong>Ketebalan</strong> garis.</>,
            image: ''
        },
        {
            title: 'Simpan Tanda Tangan',
            desc: <>Setelah menggambar, klik tombol <strong>"Simpan ke Dokumen"</strong>. Tanda tangan akan disimpan sementara di daftar bawah kanvas untuk dipakai.</>,
            image: ''
        },
        {
            title: 'Upload Dokumen',
            desc: <>Scroll ke bawah ke bagian <strong>"Tambahkan ke Dokumen"</strong>. Upload file <em>PDF</em> atau <em>Gambar</em> yang ingin ditandatangani.</>,
            image: ''
        },
        {
            title: 'Pilih & Tempel Tanda Tangan',
            desc: <>Pilih tanda tangan dari daftar. Lalu di area dokumen, <strong>KLIK DAN TAHAN (Drag)</strong> mouse Anda membentuk kotak untuk menempelkan tanda tangan di posisi yang pas.</>,
            image: ''
        },
        {
            title: 'Sesuaikan Posisi',
            desc: <>Jika posisi kurang pas, klik tanda tangan di dokumen lalu <strong>geser-geser</strong>. Tarik ujung kanan-bawah tanda tangan untuk <strong>memperbesar atau memperkecil</strong>.</>,
            image: ''
        },
        {
            title: 'Download Dokumen',
            desc: <>Setelah selesai, klik <strong>"Download Semua Halaman (PDF)"</strong> untuk menyimpan dokumen yang sudah resmi ditandatangani.</>,
            image: ''
        }
    ]

    const photoGeneratorSteps = [
        {
            title: 'Upload Foto',
            desc: <>Upload foto yang ingin Anda edit. Bisa untuk pas foto, wallpaper, atau post sosial media.</>
        },
        {
            title: 'Pilih Ukuran / Preset',
            desc: <>Pilih preset siap pakai (Pas Foto 3x4, Instagram, Wallpaper) atau atur <strong>Dimensi Custom</strong> (px, cm, mm, inch) dan <strong>DPI</strong> untuk keperluan cetak.</>
        },
        {
            title: 'Ganti Background',
            desc: <>Pilih mode resize: <strong>Cover</strong> (potong penuh) atau <strong>Fit</strong> (utuh). Jika "Fit", Anda bisa ubah warna latar belakang menjadi Putih, Hitam, atau Blur.</>
        },
        {
            title: 'Format & Kualitas',
            desc: <>Pilih format output (JPG/PNG/WEBP) dan atur kualitas kompresi sesuai kebutuhan, lalu klik <strong>Download Image</strong>.</>
        }
    ]

    const mergePdfSteps = [
        {
            title: 'Pilih File PDF',
            desc: <>Upload beberapa file PDF yang ingin Anda gabungkan menjadi satu dokumen.</>
        },
        {
            title: 'Atur Urutan',
            desc: <>Drag & Drop file untuk mengatur urutan halaman sesuai keinginan Anda.</>
        },
        {
            title: 'Gabungkan',
            desc: <>Klik tombol <strong>"Gabungkan PDF"</strong> untuk memproses penyatuan file.</>
        },
        {
            title: 'Simpan',
            desc: <>Download file PDF baru yang berisi gabungan dari dokumen-dokumen Anda.</>
        }
    ]

    const nikParserSteps = [
        {
            title: 'Masukkan NIK',
            desc: <>Ketik 16 digit Nomor Induk Kependudukan (NIK) pada kolom yang tersedia.</>
        },
        {
            title: 'Cek Data',
            desc: <>Klik tombol <strong>"Cek NIK Sekarang"</strong>. Sistem akan mengekstrak informasi yang terkandung dalam NIK tersebut.</>
        },
        {
            title: 'Lihat Hasil',
            desc: <>Informasi seperti Tanggal Lahir, Jenis Kelamin, dan Wilayah akan ditampilkan. Data ini diekstrak dari logika penomoran NIK, bukan dari database pemerintah.</>
        }
    ]

    const redactSteps = [
        {
            title: 'Multi-Upload Dokumen',
            desc: <>Upload satu atau banyak file sekaligus (PDF & Gambar). File akan muncul di list sebelah kiri. Klik nama file untuk mulai mengeditnya.</>
        },
        {
            title: 'Buat Sensor Baru',
            desc: <>Klik dan tarik (drag) mouse di area yang ingin disensor. Kotak sensor akan muncul secara otomatis.</>
        },
        {
            title: 'Edit & Hapus Sensor',
            desc: <>Klik pada kotak sensor untuk memilihnya (muncul garis biru). Anda bisa <strong>menggeser</strong> posisinya atau menekan tombol <strong>Delete/Backspace</strong> untuk menghapus.</>
        },
        {
            title: 'Kustomisasi Tampilan',
            desc: <>Pilih mode <strong>Block</strong> (Warna Solid) atau <strong>Blur</strong>. Anda juga bisa mengganti warna sensor (Hitam, Putih, Merah) sesuai kebutuhan dokumen.</>
        },
        {
            title: 'Download Hasil',
            desc: <>Klik tombol <strong>Download</strong>. Dokumen akan diproses ulang (flatten) sehingga sensor menyatu permanen dengan gambar/PDF dan tidak bisa dilepas kembali.</>
        }
    ]

    const compressSteps = [
        {
            title: 'Pilih File',
            desc: <>Upload file Gambar (JPG/PNG) atau PDF yang ukurannya ingin dikecilkan.</>
        },
        {
            title: 'Tentukan Kualitas',
            desc: <>Pilih preset kompresi (Low, Medium, High) atau atur slider manual untuk menyeimbangkan ukuran dan kualitas.</>
        },
        {
            title: 'Proses Kompresi',
            desc: <>Tunggu sejenak hingga proses kompresi selesai dilakukan di browser Anda.</>
        },
        {
            title: 'Bandingkan & Download',
            desc: <>Lihat perbandingan ukuran file sebelum dan sesudah kompresi, lalu download hasilnya jika sudah sesuai.</>
        }
    ]

    const removeBgSteps = [
        {
            title: 'Upload Foto',
            desc: <>Upload foto yang ingin dihapus background-nya. Usahakan objek utama terlihat jelas.</>
        },
        {
            title: 'Proses Otomatis',
            desc: <>Tunggu sistem AI memisahkan objek dari latar belakang. Proses ini berjalan di browser Anda.</>
        },
        {
            title: 'Cek Hasil',
            desc: <>Lihat hasil foto tanpa background (transparan). Jika sudah sesuai, Anda bisa langsung mendownloadnya.</>
        },
        {
            title: 'Download',
            desc: <>Download file dalam format PNG (transparan) untuk digunakan di desain lain.</>
        }
    ]

    const splitSteps = [
        {
            title: 'Upload PDF',
            desc: <>Upload file PDF yang ingin Anda pecah menjadi beberapa bagian.</>
        },
        {
            title: 'Pilih Mode Split',
            desc: <>Pilih <strong>"Extract Pages"</strong> untuk mengambil halaman tertentu, atau <strong>"Split by Range"</strong> untuk memotong berdasarkan rentang halaman.</>
        },
        {
            title: 'Tentukan Halaman',
            desc: <>Klik halaman yang ingin diekstrak atau masukkan nomor halaman secara manual.</>
        },
        {
            title: 'Download Limitless',
            desc: <>Download file PDF baru yang berisi halaman-halaman pilihan Anda.</>
        }
    ]

    const rearrangeSteps = [
        {
            title: 'Upload PDF',
            desc: <>Upload file PDF yang halaman-halamannya ingin Anda urutkan ulang.</>
        },
        {
            title: 'Drag & Drop',
            desc: <>Klik dan tahan halaman, lalu geser ke posisi urutan baru yang diinginkan.</>
        },
        {
            title: 'Hapus Halaman',
            desc: <>Jika ada halaman yang tidak diinginkan, klik ikon <strong>Hapus (Trash)</strong> pada halaman tersebut.</>
        },
        {
            title: 'Simpan Dokumen',
            desc: <>Klik <strong>Download PDF</strong> untuk menyimpan dokumen dengan urutan baru.</>
        }
    ]

    const rotateSteps = [
        {
            title: 'Upload PDF',
            desc: <>Upload file PDF yang memiliki halaman miring atau terbalik.</>
        },
        {
            title: 'Putar Halaman',
            desc: <>Klik tombol putar pada halaman tertentu, atau gunakan tombol <strong>"Rotate All"</strong> untuk memutar semua halaman sekaligus.</>
        },
        {
            title: 'Simpan',
            desc: <>Setelah orientasi benar, klik <strong>Download PDF</strong> untuk menyimpan perubahan.</>
        }
    ]

    const passwordSteps = [
        {
            title: 'Atur Kriteria',
            desc: <>Pilih panjang password (e.g. 16 karakter) dan opsi karakter (Huruf Besar, Angka, Simbol) sesuai kebutuhan keamanan.</>
        },
        {
            title: 'Generate',
            desc: <>Klik tombol <strong>Generate Password</strong>. Sistem akan membuat password acak yang kuat secara instan.</>
        },
        {
            title: 'Salin',
            desc: <>Klik tombol <strong>Copy</strong> untuk menyalin password. Password ini dibuat di browser dan tidak dikirim ke server kami.</>
        }
    ]

    const encryptSteps = [
        {
            title: 'Pilih File',
            desc: <>Upload file rahasia yang ingin diamankan. Bisa berupa dokumen, gambar, atau video.</>
        },
        {
            title: 'Buat Password',
            desc: <>Masukkan password enkripsi. <strong>PENTING:</strong> Ingat baik-baik password ini, karena jika lupa, file tidak bisa dibuka selamanya.</>
        },
        {
            title: 'Enkripsi & Download',
            desc: <>Klik <strong>"Enkripsi File"</strong>. File akan diubah menjadi format <em>.enc</em> yang tidak bisa dibaca tanpa password. Simpan file ini dengan aman.</>
        },
        {
            title: 'Dekripsi (Buka Kunci)',
            desc: <>Untuk membuka kembali, upload file <em>.enc</em> di menu yang sama, masukkan password, lalu klik <strong>"Dekripsi"</strong>.</>
        }
    ]

    const ocrSteps = [
        {
            title: 'Upload Gambar',
            desc: <>Upload gambar (JPG, PNG) yang berisi teks yang ingin Anda salin.</>
        },
        {
            title: 'Pilih Bahasa',
            desc: <>Pilih bahasa teks dalam gambar (Inggris atau Indonesia) agar hasil scan lebih akurat.</>
        },
        {
            title: 'Scan Text',
            desc: <>Klik tombol <strong>"Mulai Scan"</strong>. AI Tesseract akan membaca teks dari gambar tersebut dalam beberapa detik.</>
        },
        {
            title: 'Salin Hasil',
            desc: <>Teks hasil scan akan muncul di kolom sebelah kanan. Anda bisa mengeditnya atau langsung klik tombol <strong>Copy Text</strong>.</>
        }
    ]

    const imageConverterSteps = [
        {
            title: 'Upload Gambar',
            desc: <>Upload gambar format <em>HEIC</em> (iPhone), <em>WebP</em>, atau format lain yang ingin diubah.</>
        },
        {
            title: 'Pilih Format Output',
            desc: <>Pilih format tujuan: <strong>JPG</strong> (untuk foto standar) atau <strong>PNG</strong> (untuk gambar berkualitas tinggi/transparan).</>
        },
        {
            title: 'Konversi',
            desc: <>Klik tombol <strong>Convert</strong>. Proses perubahan format dilakukan di browser Anda.</>
        },
        {
            title: 'Download',
            desc: <>Download gambar hasil konversi satu per satu atau sekaligus (ZIP).</>
        }
    ]

    const mockupSteps = [
        {
            title: 'Upload Screenshot',
            desc: <>Upload gambar tangkapan layar (screenshot) aplikasi atau website Anda.</>
        },
        {
            title: 'Pilih Device Frame',
            desc: <>Pilih bingkai perangkat yang sesuai: <strong>iPhone 14 Pro, MacBook Air, iPad Pro,</strong> atau <strong>Android</strong>.</>
        },
        {
            title: 'Kustomisasi',
            desc: <>Atur warna background, rotasi 3D, dan bayangan untuk membuat tampilan lebih estetik.</>
        },
        {
            title: 'Download',
            desc: <>Simpan hasil mockup dalam format PNG resolusi tinggi untuk keperluan presentasi atau portofolio.</>
        }
    ]

    const colorPickerSteps = [
        {
            title: 'Upload / EyeDropper',
            desc: <>Upload gambar referensi, atau gunakan fitur <strong>EyeDropper</strong> untuk mengambil warna dari area manapun di layar Anda.</>
        },
        {
            title: 'Pilih Warna',
            desc: <>Arahkan kursor ke bagian gambar yang ingin diambil warnanya. Kaca pembesar akan membantu akurasi.</>
        },
        {
            title: 'Salin Kode',
            desc: <>Dapatkan kode warna dalam format <strong>HEX, RGB,</strong> dan <strong>HSL</strong>. Klik untuk menyalin ke clipboard.</>
        }
    ]

    const exifSteps = [
        {
            title: 'Upload Foto',
            desc: <>Upload foto yang ingin dibersihkan metadatanya. Foto dari kamera/HP biasanya mengandung info lokasi GPS dan jenis perangkat.</>
        },
        {
            title: 'Lihat Info',
            desc: <>Sistem akan menampilkan data EXIF yang terdeteksi (jika ada), seperti Lokasi, Tanggal, dan Model Kamera.</>
        },
        {
            title: 'Hapus EXIF',
            desc: <>Klik <strong>"Hapus EXIF"</strong> untuk membersihkan semua data metadata tersebut.</>
        },
        {
            title: 'Download Aman',
            desc: <>Download foto versi bersih yang aman untuk dibagikan ke media sosial tanpa membocorkan privasi lokasi Anda.</>
        }
    ]

    const diffSteps = [
        {
            title: 'Masukkan Teks',
            desc: <>Tempelkan (Paste) teks asli di kolom kiri, dan teks versi baru/editan di kolom kanan.</>
        },
        {
            title: 'Bandingkan',
            desc: <>Klik tombol <strong>"Bandingkan Perbedaan"</strong>.</>
        },
        {
            title: 'Lihat Hasil',
            desc: <>Perbedaan akan di-highlight: Warna <strong>Merah</strong> untuk teks yang dihapus, dan <strong>Hijau</strong> untuk teks yang baru ditambahkan.</>
        }
    ]


    const ipCheckSteps = [
        {
            title: 'Buka Halaman',
            desc: <>Cukup buka halaman <strong>Cek IP Saya</strong>. Sistem otomatis mendeteksi IP koneksi Anda.</>
        },
        {
            title: 'Lihat Detail',
            desc: <>Informasi lengkap akan muncul: <strong>Public IP Address</strong>, <strong>Lokasi (Negara/Kota)</strong>, <strong>ISP</strong>, dan info Perangkat/Browser yang Anda gunakan.</>
        },
        {
            title: 'Salin Info',
            desc: <>Gunakan tombol Copy untuk menyalin alamat IP jika diperlukan untuk konfigurasi jaringan atau whitelist akses.</>
        }
    ]

    const latexSteps = [
        {
            title: 'Tulis LaTeX',
            desc: <>Masukkan kode LaTeX pada kolom input. Preview rumus akan muncul secara otomatis di sebelah kanan.</>
        },
        {
            title: 'Kustomisasi',
            desc: <>Rumus akan dirender menggunakan KaTeX yang presisi. Pastikan sintaks LaTeX Anda benar.</>
        },
        {
            title: 'Download',
            desc: <>Klik tombol <strong>Download PNG</strong> untuk menyimpan rumus sebagai gambar transparan berkualitas tinggi.</>
        }
    ]

    const renamerSteps = [
        {
            title: 'Upload File',
            desc: <>Upload banyak file sekaligus yang ingin Anda ganti namanya.</>
        },
        {
            title: 'Atur Pola',
            desc: <>Tentukan <strong>Prefix</strong> (awalan), <strong>Suffix</strong> (akhiran), atau ganti teks tertentu. Anda juga bisa mengaktifkan penomoran otomatis.</>
        },
        {
            title: 'Proses & Download',
            desc: <>Lihat preview nama baru. Jika sudah sesuai, klik tombol <strong>Download All (ZIP)</strong> untuk mengunduh semua file yang sudah direname.</>
        }
    ]

    const pdfNumberSteps = [
        {
            title: 'Upload PDF',
            desc: <>Upload file PDF yang ingin Anda beri nomor halaman.</>
        },
        {
            title: 'Atur Posisi',
            desc: <>Pilih posisi nomor halaman (e.g. Bawah Tengah, Atas Kanan) dan atur ukuran font.</>
        },
        {
            title: 'Proses',
            desc: <>Klik tombol <strong>Proses & Download</strong>. Nomor halaman akan ditambahkan secara otomatis ke setiap halaman dokumen.</>
        }
    ]

    const gradientSteps = [
        {
            title: 'Pilih Warna',
            desc: <>Tambahkan atau kurangi titik warna (color stop) dan atur warnanya menggunakan color picker.</>
        },
        {
            title: 'Atur Arah/Tipe',
            desc: <>Pilih tipe gradasi (Linear/Radial) dan atur sudut kemiringannya.</>
        },
        {
            title: 'Salin Kode',
            desc: <>Salin kode CSS yang dihasilkan untuk digunakan langsung pada project website Anda.</>
        }
    ]

    const hashSteps = [
        {
            title: 'Pilih Input',
            desc: <>Pilih tab <strong>Text Input</strong> untuk teks, atau <strong>File Input</strong> untuk file.</>
        },
        {
            title: 'Generate Checksum',
            desc: <>Ketik teks atau upload file. Sistem akan otomatis menghitung hash MD5, SHA-1, SHA-256, dan SHA-512.</>
        },
        {
            title: 'Verifikasi',
            desc: <>Bandingkan kode hash yang muncul dengan hash asli untuk memverifikasi integritas file.</>
        }
    ]

    const jsonSteps = [
        {
            title: 'Paste JSON',
            desc: <>Tempelkan kode JSON Anda (yang mungkin berantakan) ke kolom Input.</>
        },
        {
            title: 'Format / Minify',
            desc: <>Klik <strong>Format (2/4)</strong> untuk merapikan, atau <strong>Minify</strong> untuk memadatkan kode.</>
        },
        {
            title: 'Validasi',
            desc: <>Jika format JSON salah, sistem akan menampilkan pesan error. Jika benar, Anda bisa menyalin hasilnya.</>
        }
    ]

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>📘 Panduan & <span>Cara Pakai</span></h1>
                    <p className={styles.heroSubtitle}>Panduan lengkap mengamankan dokumen Anda dengan Amanin Data</p>
                </header>

                <div className={styles.guideWrapper}>
                    {/* Sidebar Navigation */}
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarSticky}>
                            <h3 className={styles.sidebarTitle}>Isi Konten</h3>
                            <ul className={styles.sidebarNav}>
                                <li>
                                    <a href="#watermark">
                                        <Shield size={16} /> Watermark Dokumen
                                    </a>
                                </li>
                                <li>
                                    <a href="#signature">
                                        <MousePointer size={16} /> Tanda Tangan
                                    </a>
                                </li>

                                <li>
                                    <a href="#photo-generator">
                                        <Camera size={16} /> Photo Generator
                                    </a>
                                </li>
                                <li>
                                    <a href="#merge">
                                        <FileStack size={16} /> Gabung Dokumen
                                    </a>
                                </li>
                                <li>
                                    <a href="#nik-parser">
                                        <Search size={16} /> Cek NIK
                                    </a>
                                </li>
                                <li>
                                    <a href="#redact">
                                        <Eraser size={16} /> Sensor Data
                                    </a>
                                </li>
                                <li>
                                    <a href="#remove-background">
                                        <Scissors size={16} /> Hapus Background
                                    </a>
                                </li>
                                <li>
                                    <a href="#compress">
                                        <Minimize2 size={16} /> Kompres File
                                    </a>
                                </li>
                                <li>
                                    <a href="#split">
                                        <ScissorsLineDashed size={16} /> Split Dokumen
                                    </a>
                                </li>
                                <li>
                                    <a href="#rearrange">
                                        <Move size={16} /> Rearrange Dokumen
                                    </a>
                                </li>
                                <li>
                                    <a href="#rotate">
                                        <RotateCw size={16} /> Rotate Dokumen
                                    </a>
                                </li>
                                <li>
                                    <a href="#password-generator">
                                        <Shield size={16} /> Password Gen
                                    </a>
                                </li>
                                <li>
                                    <a href="#encrypt">
                                        <Lock size={16} /> File Encryptor
                                    </a>
                                </li>
                                <li>
                                    <a href="#ocr">
                                        <Type size={16} /> OCR Image
                                    </a>
                                </li>
                                <li>
                                    <a href="#image-converter">
                                        <RefreshCw size={16} /> Image Converter
                                    </a>
                                </li>
                                <li>
                                    <a href="#mockup-generator">
                                        <Smartphone size={16} /> Device Mockup
                                    </a>
                                </li>
                                <li>
                                    <a href="#color-picker">
                                        <Palette size={16} /> Color Picker
                                    </a>
                                </li>
                                <li>
                                    <a href="#exif-remover">
                                        <Trash2 size={16} /> Hapus EXIF
                                    </a>
                                </li>
                                <li>
                                    <a href="#diff-checker">
                                        <FileDiff size={16} /> Diff Checker
                                    </a>
                                </li>
                                <li>
                                    <a href="#ip-check">
                                        <Globe size={16} /> Cek IP
                                    </a>
                                </li>
                                <li>
                                    <a href="#latex-editor">
                                        <Sigma size={16} /> LaTeX Editor
                                    </a>
                                </li>
                                <li>
                                    <a href="#bulk-renamer">
                                        <FileEdit size={16} /> Bulk Renamer
                                    </a>
                                </li>
                                <li>
                                    <a href="#pdf-page-number">
                                        <ListOrdered size={16} /> PDF Numberer
                                    </a>
                                </li>
                                <li>
                                    <a href="#css-gradient">
                                        <Palette size={16} /> CSS Gradient
                                    </a>
                                </li>
                                <li>
                                    <a href="#hash-generator">
                                        <Fingerprint size={16} /> Hash Gen
                                    </a>
                                </li>
                                <li>
                                    <a href="#json-formatter">
                                        <Braces size={16} /> JSON Fmt
                                    </a>
                                </li>
                                <li>
                                    <a href="#security-tips">
                                        <Lightbulb size={16} /> Tips Keamanan
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    <div className={styles.contentArea}>
                        <div className={styles.guidesGrid}>
                            {/* Watermark Guide */}
                            <div id="watermark" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Shield size={24} className={styles.iconBlue} />
                                    <h2>Panduan Watermark Dokumen</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {watermarkSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                                {step.image && (
                                                    <div className={styles.stepImageWrapper}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={step.image} alt={step.title} className={styles.stepImage} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/" className={`${styles.actionBtn} ${styles.btnAlt}`}>Coba Watermark Sekarang</a>
                                </div>
                            </div>

                            {/* Signature Guide */}
                            <div id="signature" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <MousePointer size={24} className={styles.iconBlue} />
                                    <h2>Panduan Tanda Tangan</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {signatureSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                                {step.image && (
                                                    <div className={styles.stepImageWrapper}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={step.image} alt={step.title} className={styles.stepImage} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/signature" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buat Tanda Tangan</a>
                                </div>
                            </div>

                            {/* Photo Generator Guide */}
                            <div id="photo-generator" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Camera size={24} className={styles.iconBlue} />
                                    <h2>Panduan Photo Generator</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {photoGeneratorSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/photo-generator" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buka Photo Generator</a>
                                </div>
                            </div>

                            {/* Merge PDF Guide */}
                            <div id="merge" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <FileStack size={24} className={styles.iconBlue} />
                                    <h2>Panduan Gabung Dokumen</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {mergePdfSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/merge" className={`${styles.actionBtn} ${styles.btnAlt}`}>Gabung Dokumen Sekarang</a>
                                </div>
                            </div>

                            {/* NIK Parser Guide */}
                            <div id="nik-parser" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Search size={24} className={styles.iconBlue} />
                                    <h2>Panduan Cek NIK</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {nikParserSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/nik-parser" className={`${styles.actionBtn} ${styles.btnAlt}`}>Cek NIK</a>
                                </div>
                            </div>

                            {/* Redact Guide */}
                            <div id="redact" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Eraser size={24} className={styles.iconBlue} />
                                    <h2>Panduan Sensor Data</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {redactSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/redact" className={`${styles.actionBtn} ${styles.btnAlt}`}>Sensor Data</a>
                                </div>
                            </div>

                            {/* Compress Guide */}
                            <div id="compress" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Minimize2 size={24} className={styles.iconBlue} />
                                    <h2>Panduan Kompres File</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {compressSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/compress" className={`${styles.actionBtn} ${styles.btnAlt}`}>Kompres File</a>
                                </div>
                            </div>

                            {/* Remove Background Guide */}
                            <div id="remove-background" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Scissors size={24} className={styles.iconBlue} />
                                    <h2>Panduan Hapus Background</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {removeBgSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/remove-background" className={`${styles.actionBtn} ${styles.btnAlt}`}>Hapus Background Sekarang</a>
                                </div>
                            </div>

                            {/* Split PDF Guide */}
                            <div id="split" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <ScissorsLineDashed size={24} className={styles.iconBlue} />
                                    <h2>Panduan Split Dokumen</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {splitSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/split" className={`${styles.actionBtn} ${styles.btnAlt}`}>Split Dokumen</a>
                                </div>
                            </div>

                            {/* Rearrange PDF Guide */}
                            <div id="rearrange" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Move size={24} className={styles.iconBlue} />
                                    <h2>Panduan Rearrange Dokumen</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {rearrangeSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/rearrange" className={`${styles.actionBtn} ${styles.btnAlt}`}>Rearrange Dokumen</a>
                                </div>
                            </div>

                            {/* Rotate PDF Guide */}
                            <div id="rotate" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <RotateCw size={24} className={styles.iconBlue} />
                                    <h2>Panduan Rotate Dokumen</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {rotateSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/rotate" className={`${styles.actionBtn} ${styles.btnAlt}`}>Rotate Dokumen</a>
                                </div>
                            </div>

                            {/* Password Generator Guide */}
                            <div id="password-generator" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Shield size={24} className={styles.iconBlue} />
                                    <h2>Panduan Password Generator</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {passwordSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/password-generator" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buat Password</a>
                                </div>
                            </div>

                            {/* Encrypt Guide */}
                            <div id="encrypt" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Lock size={24} className={styles.iconBlue} />
                                    <h2>Panduan File Encryptor</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {encryptSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/encrypt" className={`${styles.actionBtn} ${styles.btnAlt}`}>Enkripsi File</a>
                                </div>
                            </div>

                            {/* OCR Guide */}
                            <div id="ocr" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Type size={24} className={styles.iconBlue} />
                                    <h2>Panduan OCR (Image to Text)</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {ocrSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/ocr" className={`${styles.actionBtn} ${styles.btnAlt}`}>Scan Image to Text</a>
                                </div>
                            </div>

                            {/* Image Converter Guide */}
                            <div id="image-converter" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <RefreshCw size={24} className={styles.iconBlue} />
                                    <h2>Panduan Image Converter</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {imageConverterSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/image-converter" className={`${styles.actionBtn} ${styles.btnAlt}`}>Convert Image</a>
                                </div>
                            </div>

                            {/* Mockup Generator Guide */}
                            <div id="mockup-generator" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Smartphone size={24} className={styles.iconBlue} />
                                    <h2>Panduan Device Mockup</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {mockupSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/mockup-generator" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buat Mockup</a>
                                </div>
                            </div>

                            {/* Color Picker Guide */}
                            <div id="color-picker" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Palette size={24} className={styles.iconBlue} />
                                    <h2>Panduan Color Picker</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {colorPickerSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/color-picker" className={`${styles.actionBtn} ${styles.btnAlt}`}>Ambil Warna</a>
                                </div>
                            </div>

                            {/* EXIF Remover Guide */}
                            <div id="exif-remover" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Trash2 size={24} className={styles.iconBlue} />
                                    <h2>Panduan Hapus EXIF</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {exifSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/exif-remover" className={`${styles.actionBtn} ${styles.btnAlt}`}>Hapus Metadata</a>
                                </div>
                            </div>

                            {/* Diff Checker Guide */}
                            <div id="diff-checker" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <FileDiff size={24} className={styles.iconBlue} />
                                    <h2>Panduan Diff Checker</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {diffSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/diff-checker" className={`${styles.actionBtn} ${styles.btnAlt}`}>Cek Perbedaan Teks</a>
                                </div>
                            </div>


                            {/* IP Check Guide */}
                            <div id="ip-check" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Globe size={24} className={styles.iconBlue} />
                                    <h2 id="ip-check">Panduan Cek IP Saya</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {ipCheckSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/ip-check" className={`${styles.actionBtn} ${styles.btnAlt}`}>Cek IP Saya</a>
                                </div>
                            </div>

                            {/* LaTeX Guide */}
                            <div id="latex-editor" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Sigma size={24} className={styles.iconBlue} />
                                    <h2 id="latex-editor">Panduan LaTeX Editor</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {latexSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/latex-editor" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buka LaTeX Editor</a>
                                </div>
                            </div>

                            {/* Bulk Renamer Guide */}
                            <div id="bulk-renamer" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <FileEdit size={24} className={styles.iconBlue} />
                                    <h2 id="bulk-renamer">Panduan Bulk Renamer</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {renamerSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/bulk-renamer" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buka Bulk Renamer</a>
                                </div>
                            </div>

                            {/* PDF Numberer Guide */}
                            <div id="pdf-page-number" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <ListOrdered size={24} className={styles.iconBlue} />
                                    <h2 id="pdf-page-number">Panduan PDF Numberer</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {pdfNumberSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/pdf-page-number" className={`${styles.actionBtn} ${styles.btnAlt}`}>Beri Nomor PDF</a>
                                </div>
                            </div>

                            {/* CSS Gradient Guide */}
                            <div id="css-gradient" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Palette size={24} className={styles.iconBlue} />
                                    <h2 id="css-gradient">Panduan CSS Gradient</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {gradientSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/css-gradient" className={`${styles.actionBtn} ${styles.btnAlt}`}>Buat Gradient</a>
                                </div>
                            </div>

                            {/* Hash Generator Guide */}
                            <div id="hash-generator" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Fingerprint size={24} className={styles.iconBlue} />
                                    <h2 id="hash-generator">Panduan Hash Generator</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {hashSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/hash-generator" className={`${styles.actionBtn} ${styles.btnAlt}`}>Generate Hash</a>
                                </div>
                            </div>

                            {/* JSON Formatter Guide */}
                            <div id="json-formatter" className={`neu-card no-hover ${styles.guideCard}`}>
                                <div className={styles.cardHeader}>
                                    <Braces size={24} className={styles.iconBlue} />
                                    <h2 id="json-formatter">Panduan JSON Formatter</h2>
                                </div>
                                <div className={styles.stepList}>
                                    {jsonSteps.map((step, index) => (
                                        <div key={index} className={styles.stepItem}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <div className={styles.stepContent}>
                                                <h3>{step.title}</h3>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <a href="/json-formatter" className={`${styles.actionBtn} ${styles.btnAlt}`}>Format JSON</a>
                                </div>
                            </div>
                        </div>

                        {/* Tips Section */}
                        <section id="security-tips" className={styles.tipsSection}>
                            <h2 className={styles.sectionTitle}><Lightbulb size={24} /> Tips Keamanan Dokumen</h2>
                            <div className={styles.tipsGrid}>
                                <div className={styles.tipCard}>
                                    <AlertTriangle size={24} className={styles.iconWarning} />
                                    <div>
                                        <h3>Jangan Polos</h3>
                                        <p>Jangan pernah mengirim foto KTP/SIM "polos" tanpa watermark ke pihak yang tidak dikenal atau via chat sembarangan.</p>
                                    </div>
                                </div>
                                <div className={styles.tipCard}>
                                    <Info size={24} className={styles.iconInfo} />
                                    <div>
                                        <h3>Tulis Tujuan Spesifik</h3>
                                        <p>Di watermark, tuliskan: "UNTUK VERIFIKASI [NAMA_APLIKASI] SAJA". Ini mempersulit penyalahgunaan untuk aplikasi lain.</p>
                                    </div>
                                </div>
                                <div className={styles.tipCard}>
                                    <CheckCircle size={24} className={styles.iconSuccess} />
                                    <div>
                                        <h3>Posisi Strategis</h3>
                                        <p>Pastikan watermark menutupi sebagian data penting (tapi tetap terbaca) agar tidak bisa dicrop atau dihapus dengan mudah.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* FAQ */}
                <section id="faq" className={styles.faqSection}>
                    <h2 className={styles.sectionTitle}>Pertanyaan Umum (FAQ)</h2>
                    <div className={styles.faqGrid}>
                        {[
                            { q: "Apakah data saya disimpan di server?", a: "Tidak sama sekali. Amanin Data bekerja 100% di browser Anda (Client-Side). File gambar Anda tidak pernah diupload ke internet. Saat Anda menutup tab, data hilang." },
                            { q: "Apakah aplikasi ini gratis?", a: "Ya, Amanin Data 100% gratis tanpa biaya tersembunyi dan tanpa langganan. Kami berkomitmen untuk tetap menyediakan layanan ini secara gratis bagi semua pengguna." },
                            { q: "Apakah akan ada iklan di website ini?", a: "Untuk menjaga kelangsungan layanan dan biaya operasional server, kemungkinan akan ada iklan yang ditampilkan di website ini ke depannya. Namun, kami akan memastikan iklan tidak mengganggu pengalaman pengguna dan fungsi utama aplikasi tetap berjalan dengan baik." },
                            { q: "Bagaimana cara mendukung Amanin Data?", a: "Anda dapat mendukung pengembangan Amanin Data dengan berdonasi melalui tombol \"Donasi\" di menu. Dukungan Anda membantu kami membiayai server, pengembangan fitur baru, dan menjaga layanan tetap gratis untuk semua orang." },
                            { q: "Bagaimana cara menghapus watermark?", a: "Tujuan watermark adalah agar sulit dihapus demi keamanan. Kami tidak menyediakan fitur penghapus watermark." },
                            { q: "Apakah bisa di HP / Tablet?", a: "Bisa! Amanin Data responsif dan ringan, bisa dibuka di browser Android (Chrome) maupun iOS (Safari)." },
                            { q: "Kemana donasi akan digunakan?", a: "Donasi akan digunakan untuk: biaya server dan hosting, pengembangan fitur baru, pemeliharaan dan keamanan website, serta biaya operasional lainnya agar layanan tetap berjalan lancar." }
                        ].map((item, i) => (
                            <div key={i} className={`${styles.faqItem} ${openIndex === i ? styles.open : ''}`}>
                                <button
                                    className={styles.faqHeader}
                                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                >
                                    <span>{item.q}</span>
                                    <ChevronDown size={20} className={styles.chevron} />
                                </button>
                                <div className={styles.faqContent}>
                                    <div className={styles.innerContent}>
                                        <p>{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}
