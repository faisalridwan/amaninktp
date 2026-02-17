'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { HelpCircle, Sparkles, Copy, Check, Download, Heart, Globe, PlayCircle, ChevronDown } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

// CRC16-CCITT (Poly: 0x1021, Init: 0xFFFF) implementation
function crc16ccitt(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        crc ^= (c << 8) & 0xFFFF;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
            crc = crc & 0xFFFF;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// QRIS Generation logic
function generateQRIS(baseString, amount) {
    if (!amount || amount <= 0) return baseString;
    let cleanBase = baseString;
    const crcIndex = baseString.lastIndexOf("6304");
    if (crcIndex !== -1) {
        cleanBase = baseString.substring(0, crcIndex);
    }
    const amountStr = amount.toString();
    const amountLen = amountStr.length.toString().padStart(2, '0');
    const amountTag = `54${amountLen}${amountStr}`;
    let injectedString = cleanBase;
    if (cleanBase.includes("5303360")) {
        injectedString = cleanBase.replace("5303360", "5303360" + amountTag);
    } else if (cleanBase.includes("5802ID")) {
        injectedString = cleanBase.replace("5802ID", amountTag + "5802ID");
    } else {
        injectedString = cleanBase + amountTag;
    }
    const stringToSign = injectedString + "6304";
    const crc = crc16ccitt(stringToSign);
    return stringToSign + crc;
}

const BASE_QRIS = "00020101021126610014COM.GO-JEK.WWW01189360091435688656990210G5688656990303UMI51440014ID.CO.QRIS.WWW0215ID10243341199880303UMI5204581253033605802ID5914qreatip studio6013JAKARTA TIMUR61051311062070703A01630460A8";

export default function DonatePage() {
    const [amount, setAmount] = useState('20000')
    const [isCustomAmount, setIsCustomAmount] = useState(false)
    const [activeTab, setActiveTab] = useState('qris')
    const [copied, setCopied] = useState(false)
    const [openIndex, setOpenIndex] = useState(0)

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? -1 : index)
    }

    const faqs = [
        {
            q: "Mengapa dukungan Anda sangat berarti bagi Amanin Data?",
            a: "Amanin Data hadir sebagai solusi gratis dan terbuka untuk membantu masyarakat melindungi privasi dokumen mereka. Namun, operasional infrastruktur digital seperti perpanjangan nama domain (.com), biaya hosting, koneksi internet untuk development, serta pemeliharaan hardware tetap membutuhkan biaya rutin. Dukungan Anda adalah 'bahan bakar' yang memastikan alat ini berkala tetap hidup, stabil, dan bisa terus dikembangkan untuk manfaat yang lebih luas."
        },
        {
            q: "Ke mana alokasi dana donasi disalurkan?",
            a: "Setiap Rupiah yang Anda berikan dialokasikan secara transparan untuk kebutuhan teknis proyek. Ini mencakup biaya langganan server, pembaruan keamanan sistem, riset fitur baru (seperti peningkatan algoritma watermark), serta memastikan Amanin Data tetap kompatibel dengan berbagai perangkat dan browser terbaru."
        },
        {
            q: "Apakah Amanin Data benar-benar akan tetap gratis selamanya?",
            a: "Tentu saja. Komitmen utama kami adalah menyediakan alat privasi yang bisa diakses siapa pun tanpa hambatan biaya (paywall). Donasi dari para pendukung adalah kunci utama yang memungkinkan kami menjaga model 'Gratis untuk Semua' ini tanpa harus mengorbankan privasi pengguna lewat iklan yang intrusif atau penjualan data."
        },
        {
            q: "Apakah proses donasi saya terjamin keamanannya?",
            a: "Sangat terjamin. Kami tidak mengelola dana atau menyimpan informasi kartu/rekening Anda secara langsung. Semua transaksi diproses melalui platform donasi pihak ketiga yang terpercaya dan memiliki izin resmi. Keamanan transaksi Anda dilindungi dengan enkripsi standar industri."
        },
        {
            q: "Selain materi, apa lagi yang bisa saya berikan untuk membantu?",
            a: "Dukungan tidak selalu harus berupa uang. Anda bisa membantu kami dengan melaporkan bug, memberikan saran fitur baru, atau menyebarkan informasi tentang Amanin Data agar lebih banyak orang menyadari pentingnya melindungi privasi dokumen."
        }
    ]

    const presets = [
        { label: 'Rp20.000', value: '20000' },
        { label: 'Rp30.000', value: '30000' },
        { label: 'Rp40.000', value: '40000' },
        { label: 'Rp50.000', value: '50000' },
        { label: 'Rp100.000', value: '100000' }
    ]

    const handlePresetClick = (val) => {
        setAmount(val)
        setIsCustomAmount(false)
    }

    const formatCurrency = (val) => {
        const num = val.toString().replace(/\D/g, '')
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num || 0)
    }

    const qrisValue = useMemo(() => {
        return generateQRIS(BASE_QRIS, amount)
    }, [amount])

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const svg = document.getElementById('donation-qr');
        if (!svg) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `amanindata-qris-${amount}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    return (
        <>
            <Navbar />

            <main className="container">
                <div className={styles.donationPage}>
                    <header className={styles.hero}>
                        <h1 className={styles.heroTitle}>💖 Dukung <span>Amanin Data</span></h1>
                        <p className={styles.heroSubtitle}>
                            Bantu kami menjaga privasi dokumen tetap aman, gratis, dan open-source.
                        </p>
                    </header>

                    <div className={styles.card}>
                        <div className={styles.tabsContainer}>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'qris' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('qris')}
                            >
                                QRIS
                            </button>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'bank' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('bank')}
                            >
                                Bank Jago
                            </button>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'intl' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('intl')}
                            >
                                PayPal
                            </button>
                        </div>

                        <div className={styles.paymentContent}>
                            <div className={styles.methodGrid}>
                                {activeTab === 'qris' && (
                                    <div className={styles.paymentCard}>
                                        <div className={styles.qrisSection}>
                                            <div className={styles.cardHeaderLogo}>
                                                <Image src="/images/logos/qris.svg" alt="QRIS" fill style={{ objectFit: 'contain' }} />
                                            </div>

                                            <div className={styles.presetsGrid}>
                                                {presets.map((p) => (
                                                    <button
                                                        key={p.value}
                                                        className={`${styles.presetChip} ${amount === p.value && !isCustomAmount ? styles.activeChip : ''}`}
                                                        onClick={() => handlePresetClick(p.value)}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                                <button
                                                    className={`${styles.presetChip} ${isCustomAmount ? styles.activeChip : ''}`}
                                                    onClick={() => setIsCustomAmount(true)}
                                                >
                                                    Custom
                                                </button>
                                            </div>

                                            {isCustomAmount && (
                                                <div className={styles.amountInputWrapper}>
                                                    <input
                                                        type="text"
                                                        className={styles.amountInput}
                                                        value={formatCurrency(amount)}
                                                        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="Masukkan jumlah"
                                                        autoFocus
                                                    />
                                                </div>
                                            )}

                                            {amount && parseInt(amount) >= 1000 ? (
                                                <div className={styles.qrisVisual}>
                                                    <div className={styles.qrisContainer}>
                                                        <QRCodeSVG
                                                            id="donation-qr"
                                                            value={qrisValue}
                                                            size={200}
                                                            level="M"
                                                            includeMargin={false}
                                                        />
                                                        <div className={styles.qrisBranding}>
                                                            <Sparkles size={14} />
                                                            <span>qreatip studio</span>
                                                        </div>
                                                    </div>

                                                    <button onClick={handleDownload} className={styles.downloadIconBtn}>
                                                        <Download size={20} /> Simpan QR
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={styles.amountError}>Minimal Rp 1.000</div>
                                            )}

                                            <div className={styles.tutorialBox}>
                                                <h4 className={styles.tutorialTitle}>
                                                    <PlayCircle size={18} /> Cara Pembayaran:
                                                </h4>
                                                <ol className={styles.tutorialSteps}>
                                                    <li>Buka aplikasi e-wallet (GoPay, OVO, Dana) atau m-banking Anda.</li>
                                                    <li>Pilih menu <strong>Scan / Bayar</strong> dan arahkan kamera ke kode QR di atas.</li>
                                                    <li>Pastikan nama penerima yang muncul adalah <strong>qreatip studio</strong>.</li>
                                                    <li>Masukkan PIN dan selesaikan transaksi.</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'bank' && (
                                    <div className={styles.paymentCard}>
                                        <div className={styles.cardHeaderLogo}>
                                            <Image src="/images/logos/jago.svg" alt="Bank Jago" fill style={{ objectFit: 'contain' }} />
                                        </div>
                                        <div className={styles.bankDisplay}>
                                            <span className={styles.bankLabel}>PT Bank Jago Tbk</span>
                                            <div className={styles.accountBox}>
                                                <span className={styles.accountNumberText}>105003774949</span>
                                                <button
                                                    className={styles.copyIconButton}
                                                    onClick={() => handleCopy('105003774949')}
                                                >
                                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                                </button>
                                            </div>
                                            <span className={styles.accountNameText}>A.N. Faisal Ridwan Siregar</span>
                                        </div>
                                        <p className={styles.methodSmallNote}>Transfer antar bank tersedia 24/7.</p>
                                    </div>
                                )}

                                {activeTab === 'intl' && (
                                    <div className={styles.paymentCard}>
                                        <div className={styles.cardHeaderLogo}>
                                            <Image src="/images/logos/paypal.svg" alt="PayPal" fill style={{ objectFit: 'contain' }} />
                                        </div>
                                        <div className={styles.intlVisual}>
                                            <Globe size={48} className={styles.globeIcon} />
                                            <p>Metode ini disarankan untuk pendukung dari luar Indonesia.</p>
                                        </div>
                                        <a href="https://paypal.me/faisalridwan" target="_blank" rel="noopener noreferrer" className={styles.paypalMainBtn}>
                                            <Heart size={18} /> Donasi via PayPal
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.footerNoteContainer}>
                            <div className={styles.comingSoonPill}>
                                <Sparkles size={14} /> Metode lainnya segera hadir
                            </div>
                        </div>
                    </div>

                    <section className={styles.appreciationSection}>
                        <h2 className={styles.appreciationTitle}>
                            <Sparkles size={32} /> Terima Kasih
                        </h2>
                        <p className={styles.appreciationDesc}>
                            Setiap bentuk dukungan membantu kami memastikan Amanin Data tetap gratis dan selalu aman untuk privasi masyarakat Indonesia.
                        </p>
                    </section>

                    <section className={styles.faqSection}>
                        <h2 className={styles.faqTitle}>
                            <HelpCircle size={24} /> Kenapa harus donasi?
                        </h2>
                        <div className={styles.accordionContainer}>
                            {faqs.map((faq, i) => (
                                <div key={i} className={`${styles.accordionItem} ${openIndex === i ? styles.open : ''}`}>
                                    <button
                                        className={styles.accordionHeader}
                                        onClick={() => toggleAccordion(i)}
                                    >
                                        <h4>{faq.q}</h4>
                                        <ChevronDown size={20} className={styles.chevron} />
                                    </button>
                                    <div className={styles.accordionContent}>
                                        <div className={styles.innerContent}>
                                            <p>{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    )
}
