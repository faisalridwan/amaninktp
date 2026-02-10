'use client'

import { useState } from 'react'
import { BookOpen, AlertTriangle, Lightbulb, MousePointer, Info, Shield, CheckCircle, ChevronDown, Camera, FileStack, Search, Eraser, Minimize2 } from 'lucide-react'
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
            desc: <>Upload pasfoto Anda yang ingin diedit background-nya. Disarankan menggunakan foto dengan pencahayaan yang baik.</>
        },
        {
            title: 'Pilih Warna Background',
            desc: <>Pilih warna <strong>Merah</strong>, <strong>Biru</strong>, atau warna kustom lainnya sesuai kebutuhan dokumen Anda.</>
        },
        {
            title: 'Atur Ukuran',
            desc: <>Pilih ukuran standar (2x3, 3x4, 4x6) untuk hasil cetak yang presisi.</>
        },
        {
            title: 'Download Hasil',
            desc: <>Klik download untuk menyimpan foto yang sudah diedit. Kualitas foto tetap terjaga.</>
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
            title: 'Upload Gambar',
            desc: <>Upload foto KTP, dokumen, atau tangkapan layar yang mengandung data sensitif.</>
        },
        {
            title: 'Pilih Area',
            desc: <>Gunakan mouse untuk menyeleksi area yang ingin disensor (blok kotak).</>
        },
        {
            title: 'Pilih Efek Sensor',
            desc: <>Pilih mode sensor: <strong>Blur</strong>, <strong>Pixelate</strong>, atau <strong>Solid Color</strong> (blok hitam/putih).</>
        },
        {
            title: 'Download Aman',
            desc: <>Download gambar yang sudah disensor. Data asli tertutup permanen di gambar baru.</>
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

    return (
        <>
            <Navbar />

            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}><BookOpen size={32} /> Cara Pakai</h1>
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
                                    <a href="#security-tips">
                                        <Lightbulb size={16} /> Tips Keamanan
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
                                    <a href="#compress">
                                        <Minimize2 size={16} /> Kompres File
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
