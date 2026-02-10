'use client'

import { useState, useRef, useEffect } from 'react'
import {
    QrCode, Download, RefreshCcw, Copy, Check, Link as LinkIcon,
    Wifi, Shield, User, CreditCard, Image as ImageIcon, Palette,
    Settings, Share2, Type, Smartphone, Globe, Zap, History
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

// Dynamic import for qr-code-styling because it might use window/document
let QRCodeStyling;

export default function QRCodePage() {
    // Content Type State
    const [contentType, setContentType] = useState('url') // url, wifi, vcard, epc

    // Data States
    const [url, setUrl] = useState('https://amanindata.qreatip.com')
    const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA', hidden: false })
    const [vcard, setVcard] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', title: '', website: '' })
    const [epc, setEpc] = useState({ name: '', iban: '', bic: '', amount: '', reference: '' })

    // Styling States
    const [dotsColor, setDotsColor] = useState('#000000')
    const [dotsType, setDotsType] = useState('square')
    const [bgColor, setBgColor] = useState('#ffffff')
    const [cornerType, setCornerType] = useState('square')
    const [cornerDotType, setCornerDotType] = useState('dot')
    const [cornerColor, setCornerColor] = useState('#000000')
    const [margin, setMargin] = useState(10)
    const [size, setSize] = useState(500)
    const [logo, setLogo] = useState(null)
    const [logoSize, setLogoSize] = useState(0.4)
    const [errorCorrection, setErrorCorrection] = useState('Q')

    // UI States
    const [activeTab, setActiveTab] = useState('content') // content, style, technical
    const [copied, setCopied] = useState(false)
    const [qrCode, setQrCode] = useState(null)
    const qrRef = useRef(null)

    useEffect(() => {
        import('qr-code-styling').then((module) => {
            QRCodeStyling = module.default;
            const newQrCode = new QRCodeStyling({
                width: size,
                height: size,
                type: 'svg',
                data: getQRData(),
                margin: margin,
                qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: errorCorrection },
                imageOptions: { hideBackgroundDots: true, imageSize: logoSize, margin: 0 },
                dotsOptions: { color: dotsColor, type: dotsType },
                backgroundOptions: { color: bgColor },
                cornersSquareOptions: { color: cornerColor, type: cornerType },
                cornersDotOptions: { color: cornerColor, type: cornerDotType }
            });
            setQrCode(newQrCode);
            if (qrRef.current) {
                newQrCode.append(qrRef.current);
            }
        });
    }, []);

    useEffect(() => {
        if (qrCode) {
            qrCode.update({
                data: getQRData(),
                width: size,
                height: size,
                margin: margin,
                qrOptions: { errorCorrectionLevel: errorCorrection },
                dotsOptions: { color: dotsColor, type: dotsType },
                backgroundOptions: { color: bgColor },
                cornersSquareOptions: { color: cornerColor, type: cornerType },
                cornersDotOptions: { color: cornerColor, type: cornerDotType },
                image: logo,
                imageOptions: { imageSize: logoSize }
            });
        }
    }, [url, wifi, vcard, epc, contentType, dotsColor, dotsType, bgColor, cornerType, cornerDotType, cornerColor, margin, size, logo, logoSize, errorCorrection]);

    function getQRData() {
        switch (contentType) {
            case 'url':
                return url;
            case 'wifi':
                return `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};H:${wifi.hidden};;`;
            case 'vcard':
                return `BEGIN:VCARD\nVERSION:3.0\nN:${vcard.lastName};${vcard.firstName}\nFN:${vcard.firstName} ${vcard.lastName}\nORG:${vcard.company}\nTITLE:${vcard.title}\nTEL;TYPE=work,voice:${vcard.phone}\nURL:${vcard.website}\nEMAIL:${vcard.email}\nEND:VCARD`;
            case 'epc':
                return `BCD\n001\n1\nSCT\n${epc.bic}\n${epc.name}\n${epc.iban}\nEUR${epc.amount}\n\n${epc.reference}`;
            default:
                return url;
        }
    }

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setLogo(event.target.result);
            reader.readAsDataURL(file);
        }
    }

    const downloadQR = (extension) => {
        if (qrCode) {
            qrCode.download({ name: 'qr-code-amanindata', extension: extension });
        }
    }

    const copyURL = () => {
        navigator.clipboard.writeText(getQRData());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        <QrCode size={32} /> QR Code <span>Generator</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Generator QR Code tercanggih & teraman. 100% Client-side tanpa simpan data.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.grid}>
                        {/* Left: Preview */}
                        <div className={styles.previewSection}>
                            <div className={`neu-card no-hover ${styles.qrCard}`}>
                                <div className={styles.qrWrapper} ref={qrRef}></div>
                                <div className={styles.previewActions}>
                                    <div className={styles.downloadGroup}>
                                        <button onClick={() => downloadQR('png')} className={styles.btnPrimary}>
                                            <Download size={18} /> PNG
                                        </button>
                                        <button onClick={() => downloadQR('svg')} className={styles.btnSecondary}>
                                            <Download size={18} /> SVG
                                        </button>
                                    </div>
                                    <button onClick={copyURL} className={styles.btnGhost}>
                                        {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Tersalin' : 'Salin Data'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className={styles.controlsSection}>
                            <div className={styles.tabHeader}>
                                <button className={activeTab === 'content' ? styles.tabActive : ''} onClick={() => setActiveTab('content')}>
                                    <Type size={18} /> Konten
                                </button>
                                <button className={activeTab === 'style' ? styles.tabActive : ''} onClick={() => setActiveTab('style')}>
                                    <Palette size={18} /> Desain
                                </button>
                                <button className={activeTab === 'technical' ? styles.tabActive : ''} onClick={() => setActiveTab('technical')}>
                                    <Settings size={18} /> Teknis
                                </button>
                            </div>

                            <div className={`neu-card no-hover ${styles.controlCard}`}>
                                {activeTab === 'content' && (
                                    <div className={styles.contentSection}>
                                        <div className={styles.typeSelector}>
                                            <button className={contentType === 'url' ? styles.typeActive : ''} onClick={() => setContentType('url')}><Globe size={16} /> URL</button>
                                            <button className={contentType === 'wifi' ? styles.typeActive : ''} onClick={() => setContentType('wifi')}><Wifi size={16} /> WiFi</button>
                                            <button className={contentType === 'vcard' ? styles.typeActive : ''} onClick={() => setContentType('vcard')}><User size={16} /> vCard</button>
                                            <button className={contentType === 'epc' ? styles.typeActive : ''} onClick={() => setContentType('epc')}><CreditCard size={16} /> EPC</button>
                                        </div>

                                        {contentType === 'url' && (
                                            <div className={styles.inputGroup}>
                                                <label>URL / Teks</label>
                                                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                                            </div>
                                        )}

                                        {contentType === 'wifi' && (
                                            <div className={styles.fieldsGrid}>
                                                <div className={styles.inputGroup}><label>SSID (Nama WiFi)</label><input value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Password</label><input type="password" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Enkripsi</label>
                                                    <select value={wifi.encryption} onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}>
                                                        <option value="WPA">WPA/WPA2</option>
                                                        <option value="WEP">WEP</option>
                                                        <option value="nopass">None</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {contentType === 'vcard' && (
                                            <div className={styles.fieldsGrid}>
                                                <div className={styles.inputGroup}><label>Nama Depan</label><input value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Nama Belakang</label><input value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Email</label><input type="email" value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Telepon</label><input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Perusahaan</label><input value={vcard.company} onChange={(e) => setVcard({ ...vcard, company: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Website</label><input value={vcard.website} onChange={(e) => setVcard({ ...vcard, website: e.target.value })} /></div>
                                            </div>
                                        )}

                                        {contentType === 'epc' && (
                                            <div className={styles.fieldsGrid}>
                                                <div className={styles.inputGroup}><label>Nama Penerima</label><input value={epc.name} onChange={(e) => setEpc({ ...epc, name: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>IBAN</label><input value={epc.iban} onChange={(e) => setEpc({ ...epc, iban: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>BIC</label><input value={epc.bic} onChange={(e) => setEpc({ ...epc, bic: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Jumlah (EUR)</label><input type="number" value={epc.amount} onChange={(e) => setEpc({ ...epc, amount: e.target.value })} /></div>
                                                <div className={styles.inputGroup}><label>Referensi</label><input value={epc.reference} onChange={(e) => setEpc({ ...epc, reference: e.target.value })} /></div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'style' && (
                                    <div className={styles.styleSection}>
                                        <div className={styles.settingsGrid}>
                                            <div className={styles.inputGroup}><label>Warna Dots</label><input type="color" value={dotsColor} onChange={(e) => setDotsColor(e.target.value)} /></div>
                                            <div className={styles.inputGroup}><label>Background Color</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></div>
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label>Bentuk Dots</label>
                                            <select value={dotsType} onChange={(e) => setDotsType(e.target.value)}>
                                                <option value="square">Square</option>
                                                <option value="dots">Dots</option>
                                                <option value="rounded">Rounded</option>
                                                <option value="extra-rounded">Extra Rounded</option>
                                                <option value="classy">Classy</option>
                                                <option value="classy-rounded">Classy Rounded</option>
                                            </select>
                                        </div>

                                        <div className={styles.settingsGrid}>
                                            <div className={styles.inputGroup}>
                                                <label>Square Sudut</label>
                                                <select value={cornerType} onChange={(e) => setCornerType(e.target.value)}>
                                                    <option value="square">Square</option>
                                                    <option value="dot">Dot</option>
                                                    <option value="extra-rounded">Rounded</option>
                                                </select>
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Titik Sudut</label>
                                                <select value={cornerDotType} onChange={(e) => setCornerDotType(e.target.value)}>
                                                    <option value="square">Square</option>
                                                    <option value="dot">Dot</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label>Upload Logo</label>
                                            <div className={styles.uploadBtnWrapper}>
                                                <button className={styles.btnUpload} onClick={() => document.getElementById('logo-upload').click()}>
                                                    <ImageIcon size={16} /> Pilih Logo
                                                </button>
                                                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} hidden />
                                                {logo && <button onClick={() => setLogo(null)} className={styles.btnRemoveLogo}><History size={14} /> Reset Logo</button>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'technical' && (
                                    <div className={styles.techSection}>
                                        <div className={styles.inputGroup}>
                                            <label>Ukuran: {size}px</label>
                                            <input type="range" min="300" max="1000" step="50" value={size} onChange={(e) => setSize(parseInt(e.target.value))} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Margin: {margin}px</label>
                                            <input type="range" min="0" max="100" step="5" value={margin} onChange={(e) => setMargin(parseInt(e.target.value))} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Error Correction</label>
                                            <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value)}>
                                                <option value="L">Low (7%)</option>
                                                <option value="M">Medium (15%)</option>
                                                <option value="Q">Quartile (25%)</option>
                                                <option value="H">High (30%)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.infoBox}>
                        <Zap size={16} />
                        <p>Tips: Gunakan "Error Correction" High (H) jika Anda menambahkan logo di tengah agar QR Code tetap mudah dipindai.</p>
                    </div>
                </div>

                <TrustSection />
                <GuideSection toolId="qrcode" />
            </main>
            <Footer />
        </>
    )
}
