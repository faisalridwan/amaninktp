'use client'

import { useState, useRef, useEffect } from 'react'
import {
    QrCode, Download, RefreshCcw, Copy, Check, Link as LinkIcon,
    Wifi, Shield, User, CreditCard, Image as ImageIcon, Palette,
    Settings, Share2, Type, Smartphone, Globe, Zap, History,
    Mail, MessageSquare, MapPin, Facebook, Youtube, Calendar,
    ChevronDown, ChevronUp, Eraser
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
    const [contentType, setContentType] = useState('url') // url, text, wifi, vcard, email, phone, sms, location, facebook, youtube, event, crypto

    // Data States
    const [url, setUrl] = useState('https://amanindata.qreatip.com')
    const [text, setText] = useState('')
    const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA', hidden: false })
    const [vcard, setVcard] = useState({ firstName: '', lastName: '', displayName: '', email: '', company: '', title: '', website: '', phone: '', phoneType: 'Work' })
    const [email, setEmail] = useState({ to: '', subject: '', message: '' })
    const [phone, setPhone] = useState('')
    const [sms, setSms] = useState({ phone: '', message: '' })
    const [location, setLocation] = useState({ address: '', lat: '', lng: '' })
    const [facebook, setFacebook] = useState({ url: '', type: 'page' }) // page or share
    const [youtube, setYoutube] = useState('')
    const [event, setEvent] = useState({ title: '', location: '', start: '', end: '' })
    const [crypto, setCrypto] = useState({ asset: 'Bitcoin', address: '', amount: '' })

    // Styling States
    const [dotsColor, setDotsColor] = useState('#000000')
    const [dotsGradient, setDotsGradient] = useState({ enabled: false, type: 'linear', rotation: 0, color1: '#000000', color2: '#4a4a4a' })
    const [dotsType, setDotsType] = useState('square')

    const [bgColor, setBgColor] = useState('#ffffff')
    const [bgGradient, setBgGradient] = useState({ enabled: false, type: 'linear', rotation: 0, color1: '#ffffff', color2: '#f0f0f0' })

    const [cornerType, setCornerType] = useState('square')
    const [cornerColor, setCornerColor] = useState('#000000')
    const [cornerGradient, setCornerGradient] = useState({ enabled: false, type: 'linear', rotation: 0, color1: '#000000', color2: '#4a4a4a' })

    const [cornerDotType, setCornerDotType] = useState('dot')
    const [cornerDotColor, setCornerDotColor] = useState('#000000')
    const [cornerDotGradient, setCornerDotGradient] = useState({ enabled: false, type: 'linear', rotation: 0, color1: '#000000', color2: '#4a4a4a' })

    const [margin, setMargin] = useState(10)
    const [size, setSize] = useState(500)
    const [logo, setLogo] = useState(null)
    const [logoSize, setLogoSize] = useState(0.4)
    const [logoMargin, setLogoMargin] = useState(0)
    const [removeLogoBackground, setRemoveLogoBackground] = useState(true)

    // Advanced Shapes Constants
    const EYE_SHAPE_PATHS = {
        leaf: {
            frame: "M 0 0 C 7 0 7 7 7 7 C 0 7 0 0 0 0 Z M 1 1 Q 6 1 6 6 Q 1 6 1 1 Z",
            ball: "M 3.5 1.5 C 5 1.5 5.5 2 5.5 3.5 C 5.5 5 5 5.5 3.5 5.5 C 2 5.5 1.5 5 1.5 3.5 C 1.5 2 2 1.5 3.5 1.5 Z"
        },
        shield: {
            frame: "M 0 0 H 7 V 5 L 3.5 7 L 0 5 V 0 Z M 1 1 V 4.5 L 3.5 6 L 6 4.5 V 1 H 1 Z",
            ball: "M 2 2 H 5 V 4 L 3.5 5 L 2 4 V 2 Z"
        },
        star: {
            frame: "M 3.5 0 L 4.5 2.5 H 7 L 5 4 L 6 7 L 3.5 5.5 L 1 7 L 2 4 L 0 2.5 H 2.5 Z M 3.5 1.5 L 2.8 3.2 H 1.2 L 2.4 4.2 L 2 6 L 3.5 4.8 L 5 6 L 4.6 4.2 L 5.8 3.2 H 4.2 Z",
            ball: "M 3.5 2.5 L 4 3.5 H 5 L 4.2 4 L 4.5 5 L 3.5 4.3 L 2.5 5 L 2.8 4 L 2 3.5 H 3 Z"
        },
        heart: {
            frame: "M 3.5 7 L 3.1 6.6 C 1.2 4.9 0 3.8 0 2.5 C 0 1.1 1.1 0 2.5 0 C 3.3 0 4.1 0.4 4.5 1 C 4.9 0.4 5.7 0 6.5 0 C 7.9 0 9 1.1 9 2.5 C 9 3.8 7.8 4.9 5.9 6.6 L 5.5 7 Z", // Simplified
            ball: "M 3.5 5 L 3.3 4.8 C 2.5 4.1 2 3.6 2 3 C 2 2.5 2.5 2 3 2 C 3.3 2 3.6 2.2 3.8 2.5 C 4 2.2 4.3 2 4.6 2 C 5.1 2 5.6 2.5 5.6 3 C 5.6 3.6 5.1 4.1 4.3 4.8 L 4.1 5 Z"
        },
        diamond: {
            frame: "M 3.5 0 L 7 3.5 L 3.5 7 L 0 3.5 Z M 3.5 1.4 L 5.6 3.5 L 3.5 5.6 L 1.4 3.5 Z",
            ball: "M 3.5 2.5 L 4.5 3.5 L 3.5 4.5 L 2.5 3.5 Z"
        },
        hexagon: {
            frame: "M 3.5 0 L 6.5 1.7 V 5.3 L 3.5 7 L 0.5 5.3 V 1.7 Z M 3.5 1 L 5.5 2.2 V 4.8 L 3.5 6 L 1.5 4.8 V 2.2 Z",
            ball: "M 3.5 2 L 4.8 2.8 V 4.2 L 3.5 5 L 2.2 4.2 V 2.8 Z"
        },
        flower: {
            frame: "M 3.5 0 C 5 0 6 1 6 2.5 Q 7 3.5 6 4.5 C 6 6 5 7 3.5 7 C 2 7 1 6 1 4.5 Q 0 3.5 1 2.5 C 1 1 2 0 3.5 0 Z M 3.5 1.5 C 2.5 1.5 2.1 2.1 2.1 3 Q 1.5 3.5 2.1 4 C 2.1 4.9 2.5 5.5 3.5 5.5 C 4.5 5.5 4.9 4.9 4.9 4 Q 5.5 3.5 4.9 3 C 4.9 2.1 4.5 1.5 3.5 1.5 Z",
            ball: "M 3.5 2 L 4.5 2.5 L 5 3.5 L 4.5 4.5 L 3.5 5 L 2.5 4.5 L 2 3.5 L 2.5 2.5 Z"
        },
        liquid: {
            frame: "M 0 0 C 4 0 7 2 7 5 C 7 7 5 7 3 7 C 0 7 0 4 0 0 Z M 1 1 C 1 3 1 6 2.5 6 C 4 6 6 6 6 4.5 C 6 2.5 4 1 1 1 Z",
            ball: "M 2 2 C 4 2 5 3 5 4 C 5 5 4 5 3 5 C 2 5 2 4 2 2 Z"
        },
        japanese: {
            frame: "M 3.5 0 L 4.5 1 C 6 1 7 2 7 3.5 C 7 5 6 6 4.5 6 L 3.5 7 L 2.5 6 C 1 6 0 5 0 3.5 C 0 2 1 1 2.5 1 L 3.5 0 Z M 3.5 1.5 L 2.8 2.2 C 1.8 2.2 1.2 2.8 1.2 3.5 C 1.2 4.2 1.8 4.8 2.8 4.8 L 3.5 5.5 L 4.2 4.8 C 5.2 4.8 5.8 4.2 5.8 3.5 C 5.8 2.8 5.2 2.2 4.2 2.2 L 3.5 1.5 Z",
            ball: "M 3.5 2.5 L 4 3 L 4.5 3.5 L 4 4 L 3.5 4.5 L 3 4 L 2.5 3.5 L 3 3 Z"
        }
    }
    const [errorCorrection, setErrorCorrection] = useState('Q')
    const [qrVersion, setQrVersion] = useState(0)
    const [activeTab, setActiveTab] = useState('content') // content, style, technical

    // UI States
    const [sections, setSections] = useState({
        logo: true,
        design: true,
        eyes: true,
        technical: false
    })
    const [copied, setCopied] = useState(false)
    const [qrCode, setQrCode] = useState(null)
    const qrRef = useRef(null)

    useEffect(() => {
        import('qr-code-styling').then((module) => {
            QRCodeStyling = module.default;
            const newQrCode = new QRCodeStyling(getOptions());
            setQrCode(newQrCode);
            if (qrRef.current) {
                newQrCode.append(qrRef.current);
            }
        });
    }, []);

    useEffect(() => {
        if (qrCode) {
            qrCode.update(getOptions());
            if (EYE_SHAPE_PATHS[cornerType] || EYE_SHAPE_PATHS[cornerDotType]) {
                qrCode.applyExtension(applyCustomEyes);
            } else {
                qrCode.deleteExtension();
            }
        }
    }, [contentType, url, text, wifi, vcard, email, phone, sms, location, facebook, youtube, event, crypto, dotsColor, bgColor, cornerColor, cornerDotColor, dotsType, cornerType, cornerDotType, size, margin, logo, logoSize, logoMargin, removeLogoBackground, dotsGradient, bgGradient, cornerGradient, cornerDotGradient, qrVersion, errorCorrection]);

    function getOptions() {
        return {
            width: size,
            height: size,
            type: 'svg',
            data: getQRData(),
            margin: margin,
            qrOptions: { typeNumber: qrVersion, mode: 'Byte', errorCorrectionLevel: errorCorrection },
            imageOptions: { hideBackgroundDots: removeLogoBackground, imageSize: logoSize, margin: logoMargin },
            dotsOptions: {
                color: dotsColor,
                type: dotsType,
                gradient: dotsGradient.enabled ? {
                    type: dotsGradient.type,
                    rotation: (dotsGradient.rotation * Math.PI) / 180,
                    colorStops: [{ offset: 0, color: dotsGradient.color1 }, { offset: 1, color: dotsGradient.color2 }]
                } : undefined
            },
            backgroundOptions: {
                color: bgColor,
                gradient: bgGradient.enabled ? {
                    type: bgGradient.type,
                    rotation: (bgGradient.rotation * Math.PI) / 180,
                    colorStops: [{ offset: 0, color: bgGradient.color1 }, { offset: 1, color: bgGradient.color2 }]
                } : undefined
            },
            cornersSquareOptions: {
                color: EYE_SHAPE_PATHS[cornerType] ? 'transparent' : cornerColor,
                type: EYE_SHAPE_PATHS[cornerType] ? undefined : cornerType,
                gradient: (!EYE_SHAPE_PATHS[cornerType] && cornerGradient.enabled) ? {
                    type: cornerGradient.type,
                    rotation: (cornerGradient.rotation * Math.PI) / 180,
                    colorStops: [{ offset: 0, color: cornerGradient.color1 }, { offset: 1, color: cornerGradient.color2 }]
                } : undefined
            },
            cornersDotOptions: {
                color: EYE_SHAPE_PATHS[cornerDotType] ? 'transparent' : cornerDotColor,
                type: EYE_SHAPE_PATHS[cornerDotType] ? undefined : cornerDotType,
                gradient: (!EYE_SHAPE_PATHS[cornerDotType] && cornerDotGradient.enabled) ? {
                    type: cornerDotGradient.type,
                    rotation: (cornerDotGradient.rotation * Math.PI) / 180,
                    colorStops: [{ offset: 0, color: cornerDotGradient.color1 }, { offset: 1, color: cornerDotGradient.color2 }]
                } : undefined
            },
            image: logo
        };
    }

    const applyCustomEyes = (content, options) => {
        const isSvg = content instanceof SVGElement;
        const count = qrCode._qr.getModuleCount();
        const size_mod = options.width / count;
        const margin = options.margin;

        const drawEye = (x, y, rotation) => {
            if (isSvg) {
                const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                group.setAttribute("transform", `translate(${margin + x * size_mod}, ${margin + y * size_mod}) rotate(${rotation}, ${3.5 * size_mod}, ${3.5 * size_mod}) scale(${size_mod})`);

                if (EYE_SHAPE_PATHS[cornerType]) {
                    const frame = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    frame.setAttribute("d", EYE_SHAPE_PATHS[cornerType].frame);
                    frame.setAttribute("fill", cornerColor);
                    group.appendChild(frame);
                }

                if (EYE_SHAPE_PATHS[cornerDotType]) {
                    const ball = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    ball.setAttribute("d", EYE_SHAPE_PATHS[cornerDotType].ball);
                    ball.setAttribute("fill", cornerDotColor);
                    group.appendChild(ball);
                }

                content.appendChild(group);
            } else {
                // Canvas support
                const ctx = content;
                ctx.save();
                ctx.translate(margin + x * size_mod + 3.5 * size_mod, margin + y * size_mod + 3.5 * size_mod);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.scale(size_mod, size_mod);
                ctx.translate(-3.5, -3.5);

                if (EYE_SHAPE_PATHS[cornerType]) {
                    ctx.fillStyle = cornerColor;
                    const p = new Path2D(EYE_SHAPE_PATHS[cornerType].frame);
                    ctx.fill(p);
                }
                if (EYE_SHAPE_PATHS[cornerDotType]) {
                    ctx.fillStyle = cornerDotColor;
                    const p = new Path2D(EYE_SHAPE_PATHS[cornerDotType].ball);
                    ctx.fill(p);
                }
                ctx.restore();
            }
        };

        // Top Left
        drawEye(0, 0, 0);
        // Top Right
        drawEye(count - 7, 0, 0);
        // Bottom Left
        drawEye(0, count - 7, 0);
    };

    function getQRData() {
        switch (contentType) {
            case 'url': return url;
            case 'text': return text;
            case 'wifi': return `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};H:${wifi.hidden};;`;
            case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nN:${vcard.lastName};${vcard.firstName}\nFN:${vcard.displayName || `${vcard.firstName} ${vcard.lastName}`}\nORG:${vcard.company}\nTITLE:${vcard.title}\nTEL;TYPE=${vcard.phoneType}:${vcard.phone}\nURL:${vcard.website}\nEMAIL:${vcard.email}\nEND:VCARD`;
            case 'email': return `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.message)}`;
            case 'phone': return `tel:${phone}`;
            case 'sms': return `smsto:${sms.phone}:${sms.message}`;
            case 'location': return `geo:${location.lat},${location.lng}?q=${encodeURIComponent(location.address)}`;
            case 'facebook': return facebook.type === 'page' ? facebook.url : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebook.url)}`;
            case 'youtube': return youtube;
            case 'event': return `BEGIN:VEVENT\nSUMMARY:${event.title}\nLOCATION:${event.location}\nDTSTART:${event.start.replace(/[-:]/g, '')}\nDTEND:${event.end.replace(/[-:]/g, '')}\nEND:VEVENT`;
            case 'crypto': return `${crypto.asset.toLowerCase()}:${crypto.address}?amount=${crypto.amount}`;
            default: return url;
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

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    ...location,
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6),
                    address: `Lokasi Saya (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
                });
            });
        }
    }

    const dotsTypes = [
        { id: 'square', name: 'Square', icon: <div className={styles.sqSquare}></div> },
        { id: 'dots', name: 'Dots', icon: <div className={styles.sqDots}></div> },
        { id: 'rounded', name: 'Rounded', icon: <div className={styles.sqRounded}></div> },
        { id: 'extra-rounded', name: 'Extra Rounded', icon: <div className={styles.sqExtraRounded}></div> },
        { id: 'classy', name: 'Classy', icon: <div className={styles.sqClassy}></div> },
        { id: 'classy-rounded', name: 'Classy Rounded', icon: <div className={styles.sqClassyRounded}></div> }
    ];

    const cornerTypes = [
        { id: 'square', name: 'Square', icon: <div className={styles.frameSquare}></div> },
        { id: 'dot', name: 'Dot', icon: <div className={styles.frameCircle}></div> },
        { id: 'extra-rounded', name: 'Extra Rounded', icon: <div className={styles.frameRounded}></div> },
        { id: 'rounded', name: 'Rounded', icon: <div className={styles.frameCornerRounded}></div> },
        { id: 'leaf', name: 'Leaf', icon: <div className={styles.frameLeaf}></div> },
        { id: 'shield', name: 'Shield', icon: <div className={styles.frameShield}></div> },
        { id: 'star', name: 'Star', icon: <div className={styles.frameStar}></div> },
        { id: 'heart', name: 'Heart', icon: <div className={styles.frameHeart}></div> },
        { id: 'diamond', name: 'Diamond', icon: <div className={styles.frameDiamond}></div> },
        { id: 'hexagon', name: 'Hexagon', icon: <div className={styles.frameHexagon}></div> },
        { id: 'flower', name: 'Flower', icon: <div className={styles.frameFlower}></div> },
        { id: 'liquid', name: 'Liquid', icon: <div className={styles.frameLiquid}></div> },
        { id: 'japanese', name: 'Japanese', icon: <div className={styles.frameJapanese}></div> }
    ];

    const cornerDotTypes = [
        { id: 'square', name: 'Square', icon: <div className={styles.ballSquare}></div> },
        { id: 'dot', name: 'Dot', icon: <div className={styles.ballCircle}></div> },
        { id: 'rounded', name: 'Rounded', icon: <div className={styles.ballRounded}></div> },
        { id: 'leaf', name: 'Leaf', icon: <div className={styles.ballLeaf}></div> },
        { id: 'shield', name: 'Shield', icon: <div className={styles.ballShield}></div> },
        { id: 'star', name: 'Star', icon: <div className={styles.ballStar}></div> },
        { id: 'heart', name: 'Heart', icon: <div className={styles.ballHeart}></div> },
        { id: 'diamond', name: 'Diamond', icon: <div className={styles.ballDiamond}></div> },
        { id: 'hexagon', name: 'Hexagon', icon: <div className={styles.ballHexagon}></div> },
        { id: 'flower', name: 'Flower', icon: <div className={styles.ballFlower}></div> },
        { id: 'liquid', name: 'Liquid', icon: <div className={styles.ballLiquid}></div> },
        { id: 'japanese', name: 'Japanese', icon: <div className={styles.ballJapanese}></div> }
    ];

    const toggleSection = (section) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    }

    const presetLogos = [
        { name: 'none', icon: <Eraser size={20} />, value: null },
        { name: 'paypal', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="#003087"><path d="M20.067 6.947c.496 3.111-.75 5.885-3.001 8.261-2.25 2.375-5.228 3.593-8.156 3.593H6.072c-.415 0-.75-.335-.75-.75s.335-.75.75-.75h2.838c2.427 0 4.908-1.011 6.772-2.977 1.864-1.966 2.895-4.252 2.484-6.827-.411-2.574-1.996-4.66-4.348-5.723C11.468.71 8.878.508 6.5.508H2.433c-.415 0-.75.335-.75.75L.014 22.75c-.012.189.049.373.17.514a.75.75 0 0 0 .58.244h4.331c.415 0 .75-.335.75-.75L6.96 6.947c.188-1.173.914-2.126 1.954-2.597 1.04-.47 2.195-.558 3.253-.248 1.058.31 1.895.938 2.35 1.77.455.83.565 1.778.311 2.668-.254.89-.86 1.637-1.638 2.016a.751.751 0 0 0 .614 1.366c1.373-.672 2.373-1.936 2.768-3.32.395-1.383.255-2.836-.395-4.019s-1.841-2.016-3.238-2.31c-1.397-.294-2.859-.143-4.004.421-1.144.563-1.992 1.545-2.292 2.646L4.178 22.008h2.09l.365-2.275h2.277c2.25 0 4.61-.937 6.452-2.715s2.887-3.957 2.455-6.666c-.198-1.24-.717-2.316-1.47-3.155z" /></svg>, value: 'https://cdn-icons-png.flaticon.com/512/174/174861.png' },
        { name: 'youtube', icon: <Youtube color="#FF0000" size={20} />, value: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
        { name: 'instagram', icon: <svg viewBox="0 0 24 24" width="20" height="20"><defs><linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433" /><stop offset="25%" stopColor="#e6683c" /><stop offset="50%" stopColor="#dc2743" /><stop offset="75%" stopColor="#cc2366" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, value: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
        { name: 'tiktok', icon: <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-1.01-.01 2.62-.01 5.24-.02 7.86-.01 3.01-1.31 6.15-4.41 7.42-3.1 1.25-7.1.34-8.8-2.65-1.55-2.45-1.35-6.16 1.05-8.2 1.34-1.15 3.14-1.51 4.86-1.28.01 1.63.01 3.27.01 4.91-.71-.21-1.53-.18-2.18.23-.9.56-1.07 1.72-.61 2.6.48.91 1.65 1.33 2.59.88.84-.4.99-1.39.99-2.23.01-4.71.01-9.41.02-14.12z" /></svg>, value: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
    ]

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
                                    <Type size={18} /> <span>Konten</span>
                                </button>
                                <button className={activeTab === 'style' ? styles.tabActive : ''} onClick={() => setActiveTab('style')}>
                                    <Palette size={18} /> <span>Desain</span>
                                </button>
                                <button className={activeTab === 'technical' ? styles.tabActive : ''} onClick={() => setActiveTab('technical')}>
                                    <Settings size={18} /> <span>Teknis</span>
                                </button>
                            </div>

                            <div className={`neu-card no-hover ${styles.mainControlCard}`}>
                                {activeTab === 'content' && (
                                    <>
                                        <div className={styles.typeSelector}>
                                            <button className={contentType === 'url' ? styles.typeActive : ''} onClick={() => setContentType('url')}>
                                                <Globe size={18} /> <span>URL</span>
                                            </button>
                                            <button className={contentType === 'text' ? styles.typeActive : ''} onClick={() => setContentType('text')}>
                                                <Type size={18} /> <span>Teks</span>
                                            </button>
                                            <button className={contentType === 'wifi' ? styles.typeActive : ''} onClick={() => setContentType('wifi')}>
                                                <Wifi size={18} /> <span>WiFi</span>
                                            </button>
                                            <button className={contentType === 'vcard' ? styles.typeActive : ''} onClick={() => setContentType('vcard')}>
                                                <User size={18} /> <span>Kontak</span>
                                            </button>
                                            <button className={contentType === 'email' ? styles.typeActive : ''} onClick={() => setContentType('email')}>
                                                <Mail size={18} /> <span>Email</span>
                                            </button>
                                            <button className={contentType === 'phone' ? styles.typeActive : ''} onClick={() => setContentType('phone')}>
                                                <Smartphone size={18} /> <span>Telp</span>
                                            </button>
                                            <button className={contentType === 'sms' ? styles.typeActive : ''} onClick={() => setContentType('sms')}>
                                                <MessageSquare size={18} /> <span>SMS</span>
                                            </button>
                                            <button className={contentType === 'location' ? styles.typeActive : ''} onClick={() => setContentType('location')}>
                                                <MapPin size={18} /> <span>Lokasi</span>
                                            </button>
                                            <button className={contentType === 'facebook' ? styles.typeActive : ''} onClick={() => setContentType('facebook')}>
                                                <Facebook size={18} /> <span>FB</span>
                                            </button>
                                            <button className={contentType === 'youtube' ? styles.typeActive : ''} onClick={() => setContentType('youtube')}>
                                                <Youtube size={18} /> <span>YT</span>
                                            </button>
                                            <button className={contentType === 'event' ? styles.typeActive : ''} onClick={() => setContentType('event')}>
                                                <Calendar size={18} /> <span>Event</span>
                                            </button>
                                            <button className={contentType === 'crypto' ? styles.typeActive : ''} onClick={() => setContentType('crypto')}>
                                                <Bitcoin size={18} /> <span>Crypto</span>
                                            </button>
                                        </div>

                                        <div className={styles.contentBody}>
                                            {contentType === 'url' && (
                                                <div className={styles.inputGroup}>
                                                    <label>URL</label>
                                                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://contoh.com" />
                                                </div>
                                            )}
                                            {contentType === 'text' && (
                                                <div className={styles.inputGroup}>
                                                    <label>Teks</label>
                                                    <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Masukkan teks panjang di sini..." />
                                                </div>
                                            )}
                                            {contentType === 'wifi' && (
                                                <div className={styles.fieldsGrid}>
                                                    <div className={styles.inputGroup}><label>SSID (Nama WiFi)</label><input value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} placeholder="Nama Jaringan" /></div>
                                                    <div className={styles.inputGroup}><label>Password</label><input type="password" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} placeholder="Sandi WiFi" /></div>
                                                    <div className={styles.inputGroup}><label>Enkripsi</label>
                                                        <select value={wifi.encryption} onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}>
                                                            <option value="WPA">WPA/WPA2</option>
                                                            <option value="WEP">WEP</option>
                                                            <option value="nopass">Tanpa Sandi</option>
                                                        </select>
                                                    </div>
                                                    <div className={styles.checkboxGroup}>
                                                        <input type="checkbox" id="wifi-hidden" checked={wifi.hidden} onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })} />
                                                        <label htmlFor="wifi-hidden">Jaringan Tersembunyi</label>
                                                    </div>
                                                </div>
                                            )}
                                            {contentType === 'vcard' && (
                                                <div className={styles.vcardGrid}>
                                                    <div className={styles.fieldsGrid}>
                                                        <div className={styles.inputGroup}><input value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} placeholder="Nama Depan" /></div>
                                                        <div className={styles.inputGroup}><input value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} placeholder="Nama Belakang" /></div>
                                                    </div>
                                                    <div className={styles.inputGroup}><input value={vcard.displayName} onChange={(e) => setVcard({ ...vcard, displayName: e.target.value })} placeholder="Nama Tampilan" /></div>
                                                    <div className={styles.inputGroup}><input type="email" value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} placeholder="Alamat Email" /></div>
                                                    <div className={styles.inputGroup}><input value={vcard.company} onChange={(e) => setVcard({ ...vcard, company: e.target.value })} placeholder="Perusahaan" /></div>
                                                    <div className={styles.inputGroup}><input value={vcard.title} onChange={(e) => setVcard({ ...vcard, title: e.target.value })} placeholder="Jabatan / Posisi" /></div>
                                                    <div className={styles.inputGroup}><input value={vcard.website} onChange={(e) => setVcard({ ...vcard, website: e.target.value })} placeholder="Website" /></div>
                                                    <div className={styles.inputWrapper}>
                                                        <input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} placeholder="Telepon (+62812...)" />
                                                        <select className={styles.selectSmall} value={vcard.phoneType} onChange={(e) => setVcard({ ...vcard, phoneType: e.target.value })}>
                                                            <option value="Work">Kantor</option>
                                                            <option value="Mobile">HP</option>
                                                            <option value="Private">Pribadi</option>
                                                            <option value="Other">Lainnya</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                            {contentType === 'email' && (
                                                <div className={styles.fieldsGridFull}>
                                                    <div className={styles.inputGroup}><label>Ke Email</label><input type="email" value={email.to} onChange={(e) => setEmail({ ...email, to: e.target.value })} placeholder="email@tujuan.com" /></div>
                                                    <div className={styles.inputGroup}><label>Subjek</label><input value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} placeholder="Judul Email" /></div>
                                                    <div className={styles.inputGroup}><label>Pesan</label><textarea rows={3} value={email.message} onChange={(e) => setEmail({ ...email, message: e.target.value })} placeholder="Isi pesan email..." /></div>
                                                </div>
                                            )}
                                            {contentType === 'phone' && (
                                                <div className={styles.inputGroup}>
                                                    <label>Nomor Telepon</label>
                                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+6281..." />
                                                </div>
                                            )}
                                            {contentType === 'sms' && (
                                                <div className={styles.fieldsGridFull}>
                                                    <div className={styles.inputGroup}><label>Kirim Ke</label><input type="tel" value={sms.phone} onChange={(e) => setSms({ ...sms, phone: e.target.value })} placeholder="+6281..." /></div>
                                                    <div className={styles.inputGroup}><label>Isi Pesan SMS</label><textarea rows={3} value={sms.message} onChange={(e) => setSms({ ...sms, message: e.target.value })} placeholder="Isi SMS..." /></div>
                                                </div>
                                            )}
                                            {contentType === 'location' && (
                                                <div className={styles.fieldsGridFull}>
                                                    <div className={styles.inputGroup}>
                                                        <label>Cari Alamat</label>
                                                        <div className={styles.locationControls}>
                                                            <input value={location.address} onChange={(e) => setLocation({ ...location, address: e.target.value })} placeholder="Contoh: Jl. Sudirman, Jakarta" />
                                                            <button onClick={getCurrentLocation} className={styles.btnSmall} title="Gunakan Lokasi Saat Ini">
                                                                <MapPin size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={styles.fieldsGrid}>
                                                        <div className={styles.inputGroup}><label>Latitude</label><input value={location.lat} onChange={(e) => setLocation({ ...location, lat: e.target.value })} placeholder="-6.1754" /></div>
                                                        <div className={styles.inputGroup}><label>Longitude</label><input value={location.lng} onChange={(e) => setLocation({ ...location, lng: e.target.value })} placeholder="106.8272" /></div>
                                                    </div>
                                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address || "Peta")}`} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                                                        <Globe size={14} /> Lihat di Google Maps
                                                    </a>
                                                </div>
                                            )}
                                            {contentType === 'facebook' && (
                                                <div className={styles.fieldsGridFull}>
                                                    <div className={styles.inputGroup}>
                                                        <label>Facebook URL</label>
                                                        <input value={facebook.url} onChange={(e) => setFacebook({ ...facebook, url: e.target.value })} placeholder="https://facebook.com/user" />
                                                    </div>
                                                    <div className={styles.inputGroup}>
                                                        <label>Jenis Tautan</label>
                                                        <div className={styles.radioGroup}>
                                                            <label><input type="radio" checked={facebook.type === 'page'} onChange={() => setFacebook({ ...facebook, type: 'page' })} /> Profil/Halaman</label>
                                                            <label><input type="radio" checked={facebook.type === 'share'} onChange={() => setFacebook({ ...facebook, type: 'share' })} /> Bagikan URL</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {contentType === 'youtube' && (
                                                <div className={styles.inputGroup}>
                                                    <label>Youtube URL</label>
                                                    <input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                                                </div>
                                            )}
                                            {contentType === 'event' && (
                                                <div className={styles.fieldsGridFull}>
                                                    <div className={styles.inputGroup}><label>Judul Acara</label><input value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} placeholder="Rapat Tahunan" /></div>
                                                    <div className={styles.inputGroup}><label>Lokasi Acara</label><input value={event.location} onChange={(e) => setEvent({ ...event, location: e.target.value })} placeholder="Ruang Meeting A" /></div>
                                                    <div className={styles.fieldsGrid}>
                                                        <div className={styles.inputGroup}><label>Mulai</label><input type="datetime-local" value={event.start} onChange={(e) => setEvent({ ...event, start: e.target.value })} /></div>
                                                        <div className={styles.inputGroup}><label>Selesai</label><input type="datetime-local" value={event.end} onChange={(e) => setEvent({ ...event, end: e.target.value })} /></div>
                                                    </div>
                                                </div>
                                            )}
                                            {contentType === 'crypto' && (
                                                <div className={styles.fieldsGridFull}>
                                                    <div className={styles.inputGroup}>
                                                        <label>Pilih Aset Kripto</label>
                                                        <select value={crypto.asset} onChange={(e) => setCrypto({ ...crypto, asset: e.target.value })}>
                                                            <option value="Bitcoin">Bitcoin (BTC)</option>
                                                            <option value="Ethereum">Ethereum (ETH)</option>
                                                            <option value="Litecoin">Litecoin (LTC)</option>
                                                            <option value="Dash">Dash (DASH)</option>
                                                        </select>
                                                    </div>
                                                    <div className={styles.inputGroup}><label>Alamat Dompet</label><input value={crypto.address} onChange={(e) => setCrypto({ ...crypto, address: e.target.value })} placeholder="3FZb..." /></div>
                                                    <div className={styles.inputGroup}><label>Jumlah</label><input type="number" step="0.0001" value={crypto.amount} onChange={(e) => setCrypto({ ...crypto, amount: e.target.value })} placeholder="0.01" /></div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'style' && (
                                    <div className={styles.contentBody}>
                                        <p className={styles.customLabel}>Kustomisasi Visual</p>
                                        <div className={styles.accordionGrid}>
                                            <div className={`${styles.accordionSection} ${sections.logo ? styles.expanded : ''}`}>
                                                <button className={styles.accordionHeader} onClick={() => toggleSection('logo')}>
                                                    <div className={styles.headerLeft}><ImageIcon size={20} /> <span>Logo di Tengah</span></div>
                                                    {sections.logo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                                <div className={styles.accordionContent}>
                                                    <div className={styles.customCardBody}>
                                                        <label className={styles.innerLabel}>Pilih Logo Preset</label>
                                                        <div className={styles.presetIconsGrid}>
                                                            {presetLogos.map(p => (
                                                                <button
                                                                    key={p.name}
                                                                    className={`${styles.presetIconBtn} ${logo === p.value ? styles.presetActive : ''}`}
                                                                    onClick={() => setLogo(p.value)}
                                                                >
                                                                    {p.icon}
                                                                    <span className={styles.hoverLabel}>{p.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <div className={styles.inputGroup}>
                                                            <button className={styles.btnUpload} onClick={() => document.getElementById('logo-upload').click()}>
                                                                <ImageIcon size={16} /> Upload Logo Sendiri
                                                            </button>
                                                            <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} hidden />
                                                        </div>
                                                        <div className={styles.fieldsGrid}>
                                                            <div className={styles.inputGroupSmall}>
                                                                <label>Ukuran Logo</label>
                                                                <input type="range" min="0.1" max="0.5" step="0.05" value={logoSize} onChange={(e) => setLogoSize(parseFloat(e.target.value))} />
                                                            </div>
                                                            <div className={styles.checkboxGroupInline}>
                                                                <label>Hapus latar belakang</label>
                                                                <input type="checkbox" checked={removeLogoBackground} onChange={(e) => setRemoveLogoBackground(e.target.checked)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${styles.accordionSection} ${sections.design ? styles.expanded : ''}`}>
                                                <button className={styles.accordionHeader} onClick={() => toggleSection('design')}>
                                                    <div className={styles.headerLeft}><Palette size={20} /> <span>Bentuk & Warna</span></div>
                                                    {sections.design ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                                <div className={styles.accordionContent}>
                                                    <div className={styles.customCardBody}>
                                                        <div className={styles.designBlock}>
                                                            <p className={styles.blockTitle}>Bentuk Titik (Body Shape)</p>
                                                            <div className={styles.shapePickerGrid}>
                                                                {dotsTypes.map(t => (
                                                                    <button
                                                                        key={t.id}
                                                                        className={`${styles.shapeBtn} ${dotsType === t.id ? styles.shapeActive : ''}`}
                                                                        onClick={() => setDotsType(t.id)}
                                                                    >
                                                                        {t.icon}
                                                                        <span className={styles.hoverLabel}>{t.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className={styles.designBlock}>
                                                            <p className={styles.blockTitle}>Warna & Gradient</p>
                                                            <div className={styles.fieldsGrid}>
                                                                <div className={styles.inputGroup}>
                                                                    <label>Utama</label>
                                                                    <div className={styles.colorInputWrapper}>
                                                                        <input type="color" value={dotsColor} onChange={(e) => setDotsColor(e.target.value)} />
                                                                        <span className={styles.colorHex}>{dotsColor.toUpperCase()}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.inputGroup}>
                                                                    <label>Latar</label>
                                                                    <div className={styles.colorInputWrapper}>
                                                                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                                                                        <span className={styles.colorHex}>{bgColor.toUpperCase()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={styles.checkboxGroupInline}>
                                                                <input type="checkbox" id="dots-grad" checked={dotsGradient.enabled} onChange={(e) => setDotsGradient({ ...dotsGradient, enabled: e.target.checked })} />
                                                                <label htmlFor="dots-grad">Gunakan Gradient pada Titik</label>
                                                            </div>
                                                            {dotsGradient.enabled && (
                                                                <div className={styles.fieldsGrid}>
                                                                    <input type="color" value={dotsGradient.color1} onChange={(e) => setDotsGradient({ ...dotsGradient, color1: e.target.value })} />
                                                                    <input type="color" value={dotsGradient.color2} onChange={(e) => setDotsGradient({ ...dotsGradient, color2: e.target.value })} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${styles.accordionSection} ${sections.eyes ? styles.expanded : ''}`}>
                                                <button className={styles.accordionHeader} onClick={() => toggleSection('eyes')}>
                                                    <div className={styles.headerLeft}><QrCode size={20} /> <span>Bentuk Mata (Eyes)</span></div>
                                                    {sections.eyes ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                                <div className={styles.accordionContent}>
                                                    <div className={styles.customCardBody}>
                                                        <div className={styles.designBlock}>
                                                            <p className={styles.blockTitle}>Bingkai Mata (Eye Frame)</p>
                                                            <div className={styles.shapePickerGrid}>
                                                                {cornerTypes.map(t => (
                                                                    <button
                                                                        key={t.id}
                                                                        className={`${styles.shapeBtn} ${cornerType === t.id ? styles.shapeActive : ''}`}
                                                                        onClick={() => setCornerType(t.id)}
                                                                    >
                                                                        {t.icon}
                                                                        <span className={styles.hoverLabel}>{t.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className={styles.designBlock}>
                                                            <p className={styles.blockTitle}>Titik Mata (Eye Ball)</p>
                                                            <div className={styles.shapePickerGrid}>
                                                                {cornerDotTypes.map(t => (
                                                                    <button
                                                                        key={t.id}
                                                                        className={`${styles.shapeBtn} ${cornerDotType === t.id ? styles.shapeActive : ''}`}
                                                                        onClick={() => setCornerDotType(t.id)}
                                                                    >
                                                                        {t.icon}
                                                                        <span className={styles.hoverLabel}>{t.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'technical' && (
                                    <div className={styles.contentBody}>
                                        <div className={styles.techGrid}>
                                            <div className={styles.inputGroup}>
                                                <label>Ukuran: {size}px</label>
                                                <input type="range" min="300" max="1000" step="50" value={size} onChange={(e) => setSize(parseInt(e.target.value))} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Margin: {margin}px</label>
                                                <input type="range" min="0" max="100" step="5" value={margin} onChange={(e) => setMargin(parseInt(e.target.value))} />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Koreksi Kesalahan</label>
                                                <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value)}>
                                                    <option value="L">Low (7%)</option>
                                                    <option value="M">Medium (15%)</option>
                                                    <option value="Q">Quartile (25%)</option>
                                                    <option value="H">High (30%)</option>
                                                </select>
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Versi QR (0 = Otomatis)</label>
                                                <input type="number" min="0" max="40" value={qrVersion} onChange={(e) => setQrVersion(parseInt(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <TrustSection />
                <GuideSection toolId="qrcode" />
            </main>
            <Footer />
        </>
    )
}

const Bitcoin = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.75 8a2.5 2.5 0 1 0-2.5 2.5" /><path d="M11.75 18a2.5 2.5 0 1 0-2.5-2.5" /><path d="M8.5 22h3" /><path d="M10.5 15h4.5a3 3 0 0 0 0-6h-3.25V5H10.5v4H8.5V5h-2v4h-2v2h2v4h-2v2h2v4h2v-4z" />
    </svg>
)
