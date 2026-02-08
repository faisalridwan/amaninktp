'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { HelpCircle, Globe, Sparkles, Copy, Check, Info, Download, Coffee, Heart } from 'lucide-react'
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
            crc = crc & 0xFFFF; // Ensure 16-bit
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
    const [amount, setAmount] = useState('10000')
    const [activeTab, setActiveTab] = useState('qris')
    const [copied, setCopied] = useState(false)

    const faqs = [
        {
            q: "Mengapa dukungan Anda sangat berarti bagi AmaninKTP?",
            a: "AmaninKTP hadir sebagai solusi gratis dan terbuka untuk membantu masyarakat melindungi privasi dokumen mereka. Namun, operasional infrastruktur digital tetap membutuhkan biaya rutin (domain, hosting, dsb). Dukungan Anda sangat membantu keberlangsungan alat ini."
        },
        {
            q: "Ke mana alokasi dana donasi disalurkan?",
            a: "Setiap Rupiah dialokasikan secara transparan untuk kebutuhan teknis proyek, seperti biaya server, riset fitur keamanan, dan pemeliharaan sistem agar tetap bisa digunakan gratis oleh semua orang."
        },
        {
            q: "Apakah AmaninKTP benar-benar akan tetap gratis selamanya?",
            a: "Tentu saja. Komitmen utama kami adalah menyediakan alat privasi yang bisa diakses siapa pun tanpa hambatan biaya. Donasi adalah cara komunitas mendukung komitmen ini."
        }
    ]

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
            downloadLink.download = `amaninktp-qris-${amount}.png`;
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
                        <h1 className={styles.heroTitle}>Dukung <span>AmaninKTP</span></h1>
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
                                <div className={styles.logoIcon}>
                                    <Image src="/images/logos/qris.svg" alt="QRIS" fill style={{ objectFit: 'contain' }} />
                                </div>
                                QRIS
                            </button>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'bank' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('bank')}
                            >
                                <div className={styles.logoIcon}>
                                    <Image src="/images/logos/jago.svg" alt="Jago" fill style={{ objectFit: 'contain' }} />
                                </div>
                                Bank Jago
                            </button>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'intl' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('intl')}
                            >
                                <div className={styles.logoIcon}>
                                    <Image src="/images/logos/paypal.svg" alt="PayPal" fill style={{ objectFit: 'contain' }} />
                                </div>
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
                                            <p className={styles.methodInstruction}>
                                                Scan menggunakan aplikasi e-wallet atau m-banking pilihan Anda.
                                            </p>

                                            <div className={styles.amountInputWrapper}>
                                                <input
                                                    type="text"
                                                    className={styles.amountInput}
                                                    value={formatCurrency(amount)}
                                                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="Minimal Rp 1.000"
                                                />
                                            </div>

                                            {amount && parseInt(amount) >= 1000 ? (
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
                                            ) : (
                                                <div className={styles.amountError}>Minimal donasi Rp 1.000</div>
                                            )}

                                            <button
                                                onClick={handleDownload}
                                                disabled={!amount || parseInt(amount) < 1000}
                                                className={styles.actionBtn}
                                            >
                                                <Download size={18} /> Simpan QR
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'bank' && (
                                    <div className={styles.paymentCard}>
                                        <div className={styles.cardHeaderLogo}>
                                            <Image src="/images/logos/jago.svg" alt="Bank Jago" fill style={{ objectFit: 'contain' }} />
                                        </div>
                                        <div className={styles.bankInfo}>
                                            <span className={styles.bankName}>PT Bank Jago Tbk</span>
                                            <div className={styles.accountCard}>
                                                <span className={styles.accountNum}>105003774949</span>
                                                <button
                                                    className={styles.inlineCopy}
                                                    onClick={() => handleCopy('105003774949')}
                                                >
                                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                            <span className={styles.accountHolder}>A.N. Faisal Ridwan Siregar</span>
                                        </div>
                                        <p className={styles.bankNote}>
                                            Dukungan langsung via transfer antar bank.
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'intl' && (
                                    <div className={styles.paymentCard}>
                                        <div className={styles.cardHeaderLogo}>
                                            <Image src="/images/logos/paypal.svg" alt="PayPal" fill style={{ objectFit: 'contain' }} />
                                        </div>
                                        <div className={styles.intlContent}>
                                            <Globe size={48} className={styles.intlIcon} />
                                            <p>Dukungan dari luar negeri menggunakan PayPal yang aman.</p>
                                        </div>
                                        <a href="https://paypal.me/faisalridwan" target="_blank" rel="noopener noreferrer" className={styles.paypalAction}>
                                            <Heart size={18} /> Dukung via PayPal
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.comingSoonContainer}>
                            <div className={styles.comingSoonBadge}>
                                <Sparkles size={14} /> Metode lainnya segera hadir
                            </div>
                        </div>
                    </div>

                    <section className={styles.thankYouSection}>
                        <h2 className={styles.thankYouTitle}>
                            <Sparkles size={32} /> Terima Kasih
                        </h2>
                        <p className={styles.thankYouDesc}>
                            Dukungan Anda membantu kami menjaga AmaninKTP tetap gratis dan aman bagi seluruh masyarakat Indonesia. Setiap kontribusi sangat berarti bagi keberlangsungan proyek ini.
                        </p>
                    </section>

                    <section className={styles.faqSection}>
                        <h2 className={styles.faqTitle}>
                            <HelpCircle size={24} /> FAQ
                        </h2>
                        <div className={styles.faqGrid}>
                            {faqs.map((faq, i) => (
                                <div key={i} className={styles.faqCard}>
                                    <h4>{faq.q}</h4>
                                    <p>{faq.a}</p>
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
