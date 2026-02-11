'use client'

import { useState, useRef, useEffect } from 'react'
import {
    QrCode, Download, RefreshCcw, Copy, Check, Link as LinkIcon,
    Wifi, Shield, User, CreditCard, Image as ImageIcon, Palette,
    Settings, Share2, Type, Smartphone, Globe, Zap, History,
    Mail, MessageSquare, MapPin, Facebook, Youtube, Calendar,
    ChevronDown, ChevronUp, Eraser, Layout
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

    // Advanced Styling
    const [eyeBorderThickness, setEyeBorderThickness] = useState(1)
    const [eyeSpacing, setEyeSpacing] = useState(0)
    const [eyeBorderColor, setEyeBorderColor] = useState('#000000')

    const [margin, setMargin] = useState(10)
    const [size, setSize] = useState(500)
    const [logo, setLogo] = useState(null)
    const [logoSize, setLogoSize] = useState(0.4)
    const [logoMargin, setLogoMargin] = useState(0)
    const [removeLogoBackground, setRemoveLogoBackground] = useState(true)

    // Advanced Shapes Constants
    const BODY_SHAPE_PATHS = {
        'mosaic': "M 0.1 0.1 H 0.9 V 0.9 H 0.1 Z", // Placeholder: Small Square
        'dot': "M 0.5 0.5 m -0.35, 0 a 0.35,0.35 0 1,0 0.7,0 a 0.35,0.35 0 1,0 -0.7,0",
        'circle': "M 0.5 0.5 m -0.4, 0 a 0.4,0.4 0 1,0 0.8,0 a 0.4,0.4 0 1,0 -0.8,0",
        'circle-zebra': "M 0.5 0.5 m -0.45, 0 a 0.45,0.45 0 1,0 0.9,0 a 0.45,0.45 0 1,0 -0.9,0 M 0.5 0.5 m -0.25, 0 a 0.25,0.25 0 1,0 0.5,0 a 0.25,0.25 0 1,0 -0.5,0",
        'circle-zebra-vertical': "M 0.5 0.5 m -0.45, 0 a 0.45,0.45 0 1,0 0.9,0 a 0.45,0.45 0 1,0 -0.9,0 M 0.4 0.1 V 0.9 M 0.6 0.1 V 0.9",
        'circular': "M 0.5 0.5 m -0.4, 0 a 0.4,0.4 0 1,0 0.8,0 a 0.4,0.4 0 1,0 -0.8,0",
        'edge-cut': "M 0.2 0 H 0.8 L 1 0.2 V 0.8 L 0.8 1 H 0.2 L 0 0.8 V 0.2 L 0.2 0 Z",
        'edge-cut-smooth': "M 0.2 0 H 0.8 Q 1 0 1 0.2 V 0.8 Q 1 1 0.8 1 H 0.2 Q 0 1 0 0.8 V 0.2 Q 0 0 0.2 0 Z",
        'japanese': "M 0.1 0.2 H 0.9 V 0.3 H 0.1 Z M 0.2 0.3 V 0.9 H 0.3 V 0.3 Z M 0.7 0.3 V 0.9 H 0.8 V 0.3 Z M 0.2 0.6 H 0.8 V 0.7 H 0.2 Z",
        'leaf': "M 0.5 1 C 0.5 1 0 1 0 0.5 C 0 0 0.5 0 0.5 0 C 0.5 0 1 0 1 0.5 C 1 1 0.5 1 0.5 1 Z",
        'pointed': "M 0.5 0 L 1 0.5 L 0.5 1 L 0 0.5 Z",
        'pointed-edge-cut': "M 0.5 0 L 1 0.2 L 1 0.8 L 0.5 1 L 0 0.8 L 0 0.2 Z",
        'pointed-in': "M 0 0 L 0.5 0.2 L 1 0 L 0.8 0.5 L 1 1 L 0.5 0.8 L 0 1 L 0.2 0.5 Z",
        'pointed-in-smooth': "M 0 0 Q 0.5 0.2 1 0 Q 0.8 0.5 1 1 Q 0.5 0.8 0 1 Q 0.2 0.5 0 0 Z",
        'pointed-smooth': "M 0.5 0 Q 1 0 1 0.5 Q 1 1 0.5 1 Q 0 1 0 0.5 Q 0 0 0.5 0 Z", // Circle basically?
        'round': "M 0.5 0.5 m -0.45, 0 a 0.45,0.45 0 1,0 0.9,0 a 0.45,0.45 0 1,0 -0.9,0",
        'rounded-in': "M 0 0 Q 0.2 0.2 0.5 0.2 Q 0.8 0.2 1 0 V 1 H 0 V 0 Z", // Approximate
        'rounded-in-smooth': "M 0 0 Q 0.3 0.3 0.5 0.3 Q 0.7 0.3 1 0 V 1 Q 0.7 0.7 0.5 0.7 Q 0.3 0.7 0 1 V 0 Z",
        'rounded-pointed': "M 0.5 0 Q 1 0 1 0.5 L 1 1 L 0.5 1 L 0 1 L 0 0.5 Q 0 0 0.5 0 Z",
        'star': "M 0.5 0 L 0.65 0.35 L 1 0.35 L 0.75 0.6 L 0.85 1 L 0.5 0.75 L 0.15 1 L 0.25 0.6 L 0 0.35 L 0.35 0.35 Z",
        'diamond': "M 0.5 0 L 1 0.5 L 0.5 1 L 0 0.5 Z"
    };

    const EYE_SHAPE_PATHS = {
        square: {
            frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z",
            ball: "M 2 2 H 5 V 5 H 2 Z"
        },
        dot: {
            frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 3.5 1 C 5 1 6 2 6 3.5 C 6 5 5 6 3.5 6 C 2 6 1 5 1 3.5 C 1 2 2 1 3.5 1 Z",
            ball: "M 3.5 2 C 2.7 2 2 2.7 2 3.5 C 2 4.3 2.7 5 3.5 5 C 4.3 5 5 4.3 5 3.5 C 5 2.7 4.3 2 3.5 2 Z"
        },
        rounded: {
            frame: "M 2 0 H 5 Q 7 0 7 2 V 5 Q 7 7 5 7 H 2 Q 0 7 0 5 V 2 Q 0 0 2 0 Z M 1 1 V 6 H 6 V 1 Z",
            ball: "M 3.5 2 C 4.3 2 5 2.7 5 3.5 C 5 4.3 4.3 5 3.5 5 C 2.7 5 2 4.3 2 3.5 C 2 2.7 2.7 2 3.5 2 Z"
        },
        'extra-rounded': {
            frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 1 1 V 6 H 6 V 1 Z",
            ball: "M 3.5 2 C 2.5 2 2 2.5 2 3.5 C 2 4.5 2.5 5 3.5 5 C 4.5 5 5 4.5 5 3.5 C 5 2.5 4.5 2 3.5 2 Z"
        },
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
            frame: "M 3.5 7 L 3.1 6.6 C 1.2 4.9 0 3.8 0 2.5 C 0 1.1 1.1 0 2.5 0 C 3.3 0 4.1 0.4 4.5 1 C 4.9 0.4 5.7 0 6.5 0 C 7.9 0 9 1.1 9 2.5 C 9 3.8 7.8 4.9 5.9 6.6 L 5.5 7 Z",
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
        },
        // Mapped Aliases for QRCode Monkey Sync
        frame0: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Square
        frame1: { frame: "M 2 0 H 5 Q 7 0 7 2 V 5 Q 7 7 5 7 H 2 Q 0 7 0 5 V 2 Q 0 0 2 0 Z M 1 1 V 6 H 6 V 1 Z", ball: "M 3.5 2 C 4.3 2 5 2.7 5 3.5 C 5 4.3 4.3 5 3.5 5 C 2.7 5 2 4.3 2 3.5 C 2 2.7 2.7 2 3.5 2 Z" }, // Rounded
        frame2: { frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 3.5 1 C 5 1 6 2 6 3.5 C 6 5 5 6 3.5 6 C 2 6 1 5 1 3.5 C 1 2 2 1 3.5 1 Z", ball: "M 3.5 2 C 2.7 2 2 2.7 2 3.5 C 2 4.3 2.7 5 3.5 5 C 4.3 5 5 4.3 5 3.5 C 5 2.7 4.3 2 3.5 2 Z" }, // Dot
        frame3: { frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 1 1 V 6 H 6 V 1 Z", ball: "M 3.5 2 C 2.5 2 2 2.5 2 3.5 C 2 4.5 2.5 5 3.5 5 C 4.5 5 5 4.5 5 3.5 C 5 2.5 4.5 2 3.5 2 Z" }, // Extra Rounded
        frame4: { frame: "M 0 0 C 7 0 7 7 7 7 C 0 7 0 0 0 0 Z M 1 1 Q 6 1 6 6 Q 1 6 1 1 Z", ball: "M 3.5 1.5 C 5 1.5 5.5 2 5.5 3.5 C 5.5 5 5 5.5 3.5 5.5 C 2 5.5 1.5 5 1.5 3.5 C 1.5 2 2 1.5 3.5 1.5 Z" }, // Leaf
        frame5: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Edge Cut (Placeholder: Square)
        frame6: { frame: "M 0 0 H 7 V 5 L 3.5 7 L 0 5 V 0 Z M 1 1 V 4.5 L 3.5 6 L 6 4.5 V 1 H 1 Z", ball: "M 2 2 H 5 V 4 L 3.5 5 L 2 4 V 2 Z" }, // Shield
        frame7: { frame: "M 3.5 0 L 4.5 2.5 H 7 L 5 4 L 6 7 L 3.5 5.5 L 1 7 L 2 4 L 0 2.5 H 2.5 Z M 3.5 1.5 L 2.8 3.2 H 1.2 L 2.4 4.2 L 2 6 L 3.5 4.8 L 5 6 L 4.6 4.2 L 5.8 3.2 H 4.2 Z", ball: "M 3.5 2.5 L 4 3.5 H 5 L 4.2 4 L 4.5 5 L 3.5 4.3 L 2.5 5 L 2.8 4 L 2 3.5 H 3 Z" }, // Star
        frame8: { frame: "M 3.5 0 L 7 3.5 L 3.5 7 L 0 3.5 Z M 3.5 1.4 L 5.6 3.5 L 3.5 5.6 L 1.4 3.5 Z", ball: "M 3.5 2.5 L 4.5 3.5 L 3.5 4.5 L 2.5 3.5 Z" }, // Diamond
        frame9: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Rotated (Placeholder: Square)
        frame10: { frame: "M 2 0 H 5 Q 7 0 7 2 V 5 Q 7 7 5 7 H 2 Q 0 7 0 5 V 2 Q 0 0 2 0 Z M 1 1 V 6 H 6 V 1 Z", ball: "M 3.5 2 C 4.3 2 5 2.7 5 3.5 C 5 4.3 4.3 5 3.5 5 C 2.7 5 2 4.3 2 3.5 C 2 2.7 2.7 2 3.5 2 Z" }, // Hook (Placeholder: Rounded)
        frame11: { frame: "M 3.5 0 L 4.5 1 C 6 1 7 2 7 3.5 C 7 5 6 6 4.5 6 L 3.5 7 L 2.5 6 C 1 6 0 5 0 3.5 C 0 2 1 1 2.5 1 L 3.5 0 Z M 3.5 1.5 L 2.8 2.2 C 1.8 2.2 1.2 2.8 1.2 3.5 C 1.2 4.2 1.8 4.8 2.8 4.8 L 3.5 5.5 L 4.2 4.8 C 5.2 4.8 5.8 4.2 5.8 3.5 C 5.8 2.8 5.2 2.2 4.2 2.2 L 3.5 1.5 Z", ball: "M 3.5 2.5 L 4 3 L 4.5 3.5 L 4 4 L 3.5 4.5 L 3 4 L 2.5 3.5 L 3 3 Z" }, // Japanese
        frame12: { frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 1 1 V 6 H 6 V 1 Z", ball: "M 3.5 2 C 2.5 2 2 2.5 2 3.5 C 2 4.5 2.5 5 3.5 5 C 4.5 5 5 4.5 5 3.5 C 5 2.5 4.5 2 3.5 2 Z" }, // Bubble (Placeholder: Extra Rounded)
        frame13: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Square Dot (Placeholder: Square)
        frame14: { frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 3.5 1 C 5 1 6 2 6 3.5 C 6 5 5 6 3.5 6 C 2 6 1 5 1 3.5 C 1 2 2 1 3.5 1 Z", ball: "M 3.5 2 C 2.7 2 2 2.7 2 3.5 C 2 4.3 2.7 5 3.5 5 C 4.3 5 5 4.3 5 3.5 C 5 2.7 4.3 2 3.5 2 Z" }, // Small Dot (Placeholder: Dot)
        frame15: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Empty (Placeholder: Square)
        frame16: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Bold (Placeholder: Square)

        ball0: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Square
        ball1: { frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 3.5 1 C 5 1 6 2 6 3.5 C 6 5 5 6 3.5 6 C 2 6 1 5 1 3.5 C 1 2 2 1 3.5 1 Z", ball: "M 3.5 2 C 2.7 2 2 2.7 2 3.5 C 2 4.3 2.7 5 3.5 5 C 4.3 5 5 4.3 5 3.5 C 5 2.7 4.3 2 3.5 2 Z" }, // Dot
        ball2: { frame: "M 2 0 H 5 Q 7 0 7 2 V 5 Q 7 7 5 7 H 2 Q 0 7 0 5 V 2 Q 0 0 2 0 Z M 1 1 V 6 H 6 V 1 Z", ball: "M 3.5 2 C 4.3 2 5 2.7 5 3.5 C 5 4.3 4.3 5 3.5 5 C 2.7 5 2 4.3 2 3.5 C 2 2.7 2.7 2 3.5 2 Z" }, // Rounded
        ball3: { frame: "M 3.5 0 C 1.5 0 0 1.5 0 3.5 C 0 5.5 1.5 7 3.5 7 C 5.5 7 7 5.5 7 3.5 C 7 1.5 5.5 0 3.5 0 Z M 1 1 V 6 H 6 V 1 Z", ball: "M 3.5 2 C 2.5 2 2 2.5 2 3.5 C 2 4.5 2.5 5 3.5 5 C 4.5 5 5 4.5 5 3.5 C 5 2.5 4.5 2 3.5 2 Z" }, // Extra Rounded
        ball4: { frame: "M 0 0 C 7 0 7 7 7 7 C 0 7 0 0 0 0 Z M 1 1 Q 6 1 6 6 Q 1 6 1 1 Z", ball: "M 3.5 1.5 C 5 1.5 5.5 2 5.5 3.5 C 5.5 5 5 5.5 3.5 5.5 C 2 5.5 1.5 5 1.5 3.5 C 1.5 2 2 1.5 3.5 1.5 Z" }, // Leaf
        ball5: { frame: "M 0 0 H 7 V 5 L 3.5 7 L 0 5 V 0 Z M 1 1 V 4.5 L 3.5 6 L 6 4.5 V 1 H 1 Z", ball: "M 2 2 H 5 V 4 L 3.5 5 L 2 4 V 2 Z" }, // Shield
        ball6: { frame: "M 3.5 0 L 4.5 2.5 H 7 L 5 4 L 6 7 L 3.5 5.5 L 1 7 L 2 4 L 0 2.5 H 2.5 Z M 3.5 1.5 L 2.8 3.2 H 1.2 L 2.4 4.2 L 2 6 L 3.5 4.8 L 5 6 L 4.6 4.2 L 5.8 3.2 H 4.2 Z", ball: "M 3.5 2.5 L 4 3.5 H 5 L 4.2 4 L 4.5 5 L 3.5 4.3 L 2.5 5 L 2.8 4 L 2 3.5 H 3 Z" }, // Star
        ball7: { frame: "M 3.5 0 L 7 3.5 L 3.5 7 L 0 3.5 Z M 3.5 1.4 L 5.6 3.5 L 3.5 5.6 L 1.4 3.5 Z", ball: "M 3.5 2.5 L 4.5 3.5 L 3.5 4.5 L 2.5 3.5 Z" }, // Diamond
        ball8: { frame: "M 3.5 0 L 6.5 1.7 V 5.3 L 3.5 7 L 0.5 5.3 V 1.7 Z M 3.5 1 L 5.5 2.2 V 4.8 L 3.5 6 L 1.5 4.8 V 2.2 Z", ball: "M 3.5 2 L 4.8 2.8 V 4.2 L 3.5 5 L 2.2 4.2 V 2.8 Z" }, // Hexagon
        ball9: { frame: "M 3.5 0 C 5 0 6 1 6 2.5 Q 7 3.5 6 4.5 C 6 6 5 7 3.5 7 C 2 7 1 6 1 4.5 Q 0 3.5 1 2.5 C 1 1 2 0 3.5 0 Z M 3.5 1.5 C 2.5 1.5 2.1 2.1 2.1 3 Q 1.5 3.5 2.1 4 C 2.1 4.9 2.5 5.5 3.5 5.5 C 4.5 5.5 4.9 4.9 4.9 4 Q 5.5 3.5 4.9 3 C 4.9 2.1 4.5 1.5 3.5 1.5 Z", ball: "M 3.5 2 L 4.5 2.5 L 5 3.5 L 4.5 4.5 L 3.5 5 L 2.5 4.5 L 2 3.5 L 2.5 2.5 Z" }, // Flower
        ball10: { frame: "M 0 0 C 4 0 7 2 7 5 C 7 7 5 7 3 7 C 0 7 0 4 0 0 Z M 1 1 C 1 3 1 6 2.5 6 C 4 6 6 6 6 4.5 C 6 2.5 4 1 1 1 Z", ball: "M 2 2 C 4 2 5 3 5 4 C 5 5 4 5 3 5 C 2 5 2 4 2 2 Z" }, // Liquid
        ball11: { frame: "M 3.5 0 L 4.5 1 C 6 1 7 2 7 3.5 C 7 5 6 6 4.5 6 L 3.5 7 L 2.5 6 C 1 6 0 5 0 3.5 C 0 2 1 1 2.5 1 L 3.5 0 Z M 3.5 1.5 L 2.8 2.2 C 1.8 2.2 1.2 2.8 1.2 3.5 C 1.2 4.2 1.8 4.8 2.8 4.8 L 3.5 5.5 L 4.2 4.8 C 5.2 4.8 5.8 4.2 5.8 3.5 C 5.8 2.8 5.2 2.2 4.2 2.2 L 3.5 1.5 Z", ball: "M 3.5 2.5 L 4 3 L 4.5 3.5 L 4 4 L 3.5 4.5 L 3 4 L 2.5 3.5 L 3 3 Z" }, // Japanese
        ball12: { frame: "M 3.5 7 L 3.1 6.6 C 1.2 4.9 0 3.8 0 2.5 C 0 1.1 1.1 0 2.5 0 C 3.3 0 4.1 0.4 4.5 1 C 4.9 0.4 5.7 0 6.5 0 C 7.9 0 9 1.1 9 2.5 C 9 3.8 7.8 4.9 5.9 6.6 L 5.5 7 Z", ball: "M 3.5 5 L 3.3 4.8 C 2.5 4.1 2 3.6 2 3 C 2 2.5 2.5 2 3 2 C 3.3 2 3.6 2.2 3.8 2.5 C 4 2.2 4.3 2 4.6 2 C 5.1 2 5.6 2.5 5.6 3 C 5.6 3.6 5.1 4.1 4.3 4.8 L 4.1 5 Z" }, // Heart
        ball13: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Pointed (Placeholder: Square)
        ball14: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Thin (Placeholder: Square)
        ball15: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Wide (Placeholder: Square)
        ball16: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Small (Placeholder: Square)
        ball17: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Ring (Placeholder: Square)
        ball18: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Inverted (Placeholder: Square)
        ball19: { frame: "M 0 0 H 7 V 7 H 0 Z M 1 1 V 6 H 6 V 1 H 1 Z", ball: "M 2 2 H 5 V 5 H 2 Z" }, // Split (Placeholder: Square)
    }
    const [errorCorrection, setErrorCorrection] = useState('Q')
    const [qrVersion, setQrVersion] = useState(0)
    const [activeTab, setActiveTab] = useState('content') // content, style, technical

    // Advanced shapes mapping for dots options
    const getSafeDotType = (type) => {
        const supported = ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'];
        if (supported.includes(type)) return type;
        const mapping = {
            'mosaic': 'square',
            'dot': 'dots',
            'circle': 'dots',
            'circle-zebra': 'dots',
            'circle-zebra-vertical': 'dots',
            'circular': 'rounded',
            'edge-cut': 'square',
            'edge-cut-smooth': 'rounded',
            'japanese': 'classy',
            'leaf': 'classy-rounded',
            'pointed': 'classy',
            'pointed-edge-cut': 'square',
            'pointed-in': 'classy',
            'pointed-in-smooth': 'classy-rounded',
            'pointed-smooth': 'classy-rounded',
            'round': 'rounded',
            'rounded-in': 'rounded',
            'rounded-in-smooth': 'rounded',
            'rounded-pointed': 'classy-rounded',
            'star': 'classy',
            'diamond': 'square'
        };
        return mapping[type] || 'square';
    };

    // Frame/Border State
    const [frameEnabled, setFrameEnabled] = useState(false)
    const [frameStyle, setFrameStyle] = useState('solid') // solid, dashed
    const [frameColor, setFrameColor] = useState('#000000')
    const [frameThickness, setFrameThickness] = useState(10)
    const [frameMargin, setFrameMargin] = useState(0)
    const [frameRadius, setFrameRadius] = useState(0)

    // UI States
    const [sections, setSections] = useState({
        logo: true,
        design: true,
        eyes: true,
        frame: false, // New section
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
            if (EYE_SHAPE_PATHS[cornerType] || EYE_SHAPE_PATHS[cornerDotType] || BODY_SHAPE_PATHS[dotsType]) {
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
            margin: margin + (frameEnabled ? frameThickness + frameMargin : 0),
            qrOptions: { typeNumber: qrVersion, mode: 'Byte', errorCorrectionLevel: errorCorrection },
            imageOptions: { hideBackgroundDots: removeLogoBackground, imageSize: logoSize, margin: logoMargin },
            dotsOptions: {
                color: BODY_SHAPE_PATHS[dotsType] ? 'transparent' : dotsColor,
                type: BODY_SHAPE_PATHS[dotsType] ? 'square' : getSafeDotType(dotsType),
                gradient: (!BODY_SHAPE_PATHS[dotsType] && dotsGradient.enabled) ? {
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
                type: EYE_SHAPE_PATHS[cornerType] ? undefined : (getSafeDotType(cornerType) === 'square' ? 'square' : 'extra-rounded'),
                gradient: (!EYE_SHAPE_PATHS[cornerType] && cornerGradient.enabled) ? {
                    type: cornerGradient.type,
                    rotation: (cornerGradient.rotation * Math.PI) / 180,
                    colorStops: [{ offset: 0, color: cornerGradient.color1 }, { offset: 1, color: cornerGradient.color2 }]
                } : undefined
            },
            cornersDotOptions: {
                color: EYE_SHAPE_PATHS[cornerDotType] ? 'transparent' : cornerDotColor,
                type: EYE_SHAPE_PATHS[cornerDotType] ? undefined : 'dot',
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
        const size_mod = (options.width - (options.margin * 2)) / count;

        // FRAME LOGIC
        if (frameEnabled) {
            const totalSize = size;
            const borderW = frameThickness;
            const radius = frameRadius;

            if (isSvg) {
                const defs = content.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
                if (!content.querySelector('defs')) content.insertBefore(defs, content.firstChild);

                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", (borderW / 2));
                rect.setAttribute("y", (borderW / 2));
                rect.setAttribute("width", totalSize - borderW);
                rect.setAttribute("height", totalSize - borderW);
                rect.setAttribute("rx", radius);
                rect.setAttribute("ry", radius);
                rect.setAttribute("fill", "none");
                rect.setAttribute("stroke", frameColor);
                rect.setAttribute("stroke-width", borderW);
                if (frameStyle === 'dashed') {
                    rect.setAttribute("stroke-dasharray", `${borderW * 2} ${borderW}`);
                }
                content.insertBefore(rect, content.firstChild);
            } else {
                const ctx = content;
                ctx.save();
                ctx.strokeStyle = frameColor;
                ctx.lineWidth = borderW;
                if (frameStyle === 'dashed') {
                    ctx.setLineDash([borderW * 2, borderW]);
                }
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(borderW / 2, borderW / 2, totalSize - borderW, totalSize - borderW, radius);
                } else {
                    ctx.rect(borderW / 2, borderW / 2, totalSize - borderW, totalSize - borderW);
                }
                ctx.stroke();
                ctx.restore();
            }
        }

        const margin = options.margin;

        const createSvgGradient = (id, grad) => {
            const defs = content.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
            if (!content.querySelector('defs')) content.insertBefore(defs, content.firstChild);

            let gradient = document.getElementById(id);
            if (!gradient) {
                gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                gradient.setAttribute("id", id);
                gradient.setAttribute("x1", "0%");
                gradient.setAttribute("y1", "0%");
                gradient.setAttribute("x2", "100%");
                gradient.setAttribute("y2", "0%");
                gradient.setAttribute("gradientTransform", `rotate(${grad.rotation})`);

                const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop1.setAttribute("offset", "0%");
                stop1.setAttribute("stop-color", grad.color1);

                const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop2.setAttribute("offset", "100%");
                stop2.setAttribute("stop-color", grad.color2);

                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
                defs.appendChild(gradient);
            }
            return `url(#${id})`;
        };

        // BODY LOGIC (Custom Shapes)
        if (BODY_SHAPE_PATHS[dotsType]) {
            const pathData = BODY_SHAPE_PATHS[dotsType];

            for (let r = 0; r < count; r++) {
                for (let c = 0; c < count; c++) {
                    if (qrCode._qr.isDark(r, c)) {
                        // Skip Eyes (7x7 corners)
                        if ((r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7)) continue;

                        const xPos = margin + c * size_mod;
                        const yPos = margin + r * size_mod;

                        if (isSvg) {
                            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                            path.setAttribute("d", pathData);
                            path.setAttribute("transform", `translate(${xPos}, ${yPos}) scale(${size_mod})`);

                            if (dotsGradient.enabled) {
                                path.setAttribute("fill", createSvgGradient('dot-body-grad-' + r + '-' + c, dotsGradient));
                            } else {
                                path.setAttribute("fill", dotsColor);
                            }
                            content.appendChild(path);
                        } else {
                            const ctx = content;
                            ctx.save();
                            ctx.translate(xPos, yPos);
                            ctx.scale(size_mod, size_mod);
                            const p = new Path2D(pathData);
                            if (dotsGradient.enabled) {
                                // Canvas Gradient (Local 0-1)
                                const grad = ctx.createLinearGradient(0, 0, 1, 1);
                                grad.addColorStop(0, dotsGradient.color1);
                                grad.addColorStop(1, dotsGradient.color2);
                                ctx.fillStyle = grad;
                            } else {
                                ctx.fillStyle = dotsColor;
                            }
                            ctx.fill(p);
                            ctx.restore();
                        }
                    }
                }
            }
        }

        const drawEye = (x, y, rotation) => {
            const eyeSize = 7 * size_mod;
            const innerSpacing = (eyeSpacing / 10) * size_mod;
            const effectiveSize = eyeSize - (innerSpacing * 2);
            const scaleFactor = effectiveSize / 7;

            if (isSvg) {
                const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                const xPos = margin + x * size_mod + innerSpacing;
                const yPos = margin + y * size_mod + innerSpacing;

                group.setAttribute("transform", `translate(${xPos}, ${yPos}) rotate(${rotation}, ${3.5 * scaleFactor}, ${3.5 * scaleFactor}) scale(${scaleFactor})`);

                if (EYE_SHAPE_PATHS[cornerType]) {
                    const frame = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    frame.setAttribute("d", EYE_SHAPE_PATHS[cornerType].frame);

                    if (cornerGradient.enabled) {
                        frame.setAttribute("fill", createSvgGradient('eye-frame-grad-' + x + y, cornerGradient));
                    } else {
                        frame.setAttribute("fill", cornerColor);
                    }

                    if (eyeBorderThickness > 1) {
                        frame.setAttribute("stroke", cornerGradient.enabled ? cornerGradient.color1 : cornerColor);
                        frame.setAttribute("stroke-width", ((eyeBorderThickness - 1) * 0.1).toString());
                    }
                    group.appendChild(frame);
                }

                if (EYE_SHAPE_PATHS[cornerDotType]) {
                    const ball = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    ball.setAttribute("d", EYE_SHAPE_PATHS[cornerDotType].ball);

                    if (cornerDotGradient.enabled) {
                        ball.setAttribute("fill", createSvgGradient('eye-ball-grad-' + x + y, cornerDotGradient));
                    } else {
                        ball.setAttribute("fill", cornerDotColor);
                    }
                    group.appendChild(ball);
                }

                content.appendChild(group);
            } else {
                const ctx = content;
                ctx.save();
                ctx.translate(margin + x * size_mod + 3.5 * size_mod, margin + y * size_mod + 3.5 * size_mod);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.scale(scaleFactor, scaleFactor);
                ctx.translate(-3.5, -3.5);

                if (EYE_SHAPE_PATHS[cornerType]) {
                    if (cornerGradient.enabled) {
                        const grad = ctx.createLinearGradient(0, 0, 7, 7);
                        grad.addColorStop(0, cornerGradient.color1);
                        grad.addColorStop(1, cornerGradient.color2);
                        ctx.fillStyle = grad;
                    } else {
                        ctx.fillStyle = cornerColor;
                    }

                    const p = new Path2D(EYE_SHAPE_PATHS[cornerType].frame);
                    ctx.fill(p);
                    if (eyeBorderThickness > 1) {
                        ctx.strokeStyle = cornerGradient.enabled ? cornerGradient.color1 : cornerColor;
                        ctx.lineWidth = (eyeBorderThickness - 1) * 0.1;
                        ctx.stroke(p);
                    }
                }
                if (EYE_SHAPE_PATHS[cornerDotType]) {
                    if (cornerDotGradient.enabled) {
                        const grad = ctx.createLinearGradient(1.5, 1.5, 5.5, 5.5);
                        grad.addColorStop(0, cornerDotGradient.color1);
                        grad.addColorStop(1, cornerDotGradient.color2);
                        ctx.fillStyle = grad;
                    } else {
                        ctx.fillStyle = cornerDotColor;
                    }
                    const p = new Path2D(EYE_SHAPE_PATHS[cornerDotType].ball);
                    ctx.fill(p);
                }
                ctx.restore();
            }
        };

        // Top Left
        drawEye(0, 0, 0);
        // Top Right
        drawEye(count - 7, 0, 90);
        // Bottom Left
        drawEye(0, count - 7, -90);
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
        { id: 'square', name: 'Square', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteSquare}`}></div> },
        { id: 'mosaic', name: 'Mosaic', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteMosaic}`}></div> },
        { id: 'dot', name: 'Dot', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteDot}`}></div> },
        { id: 'circle', name: 'Circle', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteCircle}`}></div> },
        { id: 'circle-zebra', name: 'Circle Zebra', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteCircleZebra}`}></div> },
        { id: 'circle-zebra-vertical', name: 'Zebra Vertical', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteCircleZebraVertical}`}></div> },
        { id: 'circular', name: 'Circular', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteCircular}`}></div> },
        { id: 'edge-cut', name: 'Edge Cut', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteEdgeCut}`}></div> },
        { id: 'edge-cut-smooth', name: 'Edge Cut Smooth', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteEdgeCutSmooth}`}></div> },
        { id: 'japanese', name: 'Japanese', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteJapnese}`}></div> },
        { id: 'leaf', name: 'Leaf', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteLeaf}`}></div> },
        { id: 'pointed', name: 'Pointed', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spritePointed}`}></div> },
        { id: 'pointed-edge-cut', name: 'Pointed Edge', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spritePointedEdgeCut}`}></div> },
        { id: 'pointed-in', name: 'Pointed In', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spritePointedIn}`}></div> },
        { id: 'pointed-in-smooth', name: 'Pointed Smooth', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spritePointedInSmooth}`}></div> },
        { id: 'pointed-smooth', name: 'Pointed Smooth 2', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spritePointedSmooth}`}></div> },
        { id: 'round', name: 'Round', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteRound}`}></div> },
        { id: 'rounded-in', name: 'Rounded In', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteRoundedIn}`}></div> },
        { id: 'rounded-in-smooth', name: 'Rounded Smooth', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteRoundedInSmooth}`}></div> },
        { id: 'rounded-pointed', name: 'Rounded Pointed', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteRoundedPointed}`}></div> },
        { id: 'star', name: 'Star', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteStar}`}></div> },
        { id: 'diamond', name: 'Diamond', icon: <div className={`${styles.sprite} ${styles.spriteBody} ${styles.spriteDiamond}`}></div> }
    ];

    const cornerTypes = [
        { id: 'frame0', name: 'Simple', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame0}`}></div> },
        { id: 'frame1', name: 'Rounded', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame1}`}></div> },
        { id: 'frame2', name: 'Circle', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame2}`}></div> },
        { id: 'frame3', name: 'Rounded In', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame3}`}></div> },
        { id: 'frame4', name: 'Leaf', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame4}`}></div> },
        { id: 'frame5', name: 'Edge Cut', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame5}`}></div> },
        { id: 'frame6', name: 'Shield', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame6}`}></div> },
        { id: 'frame7', name: 'Star', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame7}`}></div> },
        { id: 'frame8', name: 'Diamond', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame8}`}></div> },
        { id: 'frame9', name: 'Rotated', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame9}`}></div> },
        { id: 'frame10', name: 'Hook', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame10}`}></div> },
        { id: 'frame11', name: 'Japanese', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame11}`}></div> },
        { id: 'frame12', name: 'Bubble', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame12}`}></div> },
        { id: 'frame13', name: 'Square Dot', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame13}`}></div> },
        { id: 'frame14', name: 'Small Dot', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame14}`}></div> },
        { id: 'frame15', name: 'Empty', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame15}`}></div> },
        { id: 'frame16', name: 'Bold', icon: <div className={`${styles.sprite} ${styles.spriteFrame} ${styles.spriteFrame16}`}></div> }
    ];

    const cornerDotTypes = [
        { id: 'ball0', name: 'Square', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall0}`}></div> },
        { id: 'ball1', name: 'Dot', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall1}`}></div> },
        { id: 'ball2', name: 'Rounded', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall2}`}></div> },
        { id: 'ball3', name: 'Extra Rounded', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall3}`}></div> },
        { id: 'ball4', name: 'Leaf', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall4}`}></div> },
        { id: 'ball5', name: 'Shield', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall5}`}></div> },
        { id: 'ball6', name: 'Star', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall6}`}></div> },
        { id: 'ball7', name: 'Diamond', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall7}`}></div> },
        { id: 'ball8', name: 'Hexagon', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall8}`}></div> },
        { id: 'ball9', name: 'Flower', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall9}`}></div> },
        { id: 'ball10', name: 'Liquid', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall10}`}></div> },
        { id: 'ball11', name: 'Japanese', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall11}`}></div> },
        { id: 'ball12', name: 'Heart', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall12}`}></div> },
        { id: 'ball13', name: 'Pointed', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall13}`}></div> },
        { id: 'ball14', name: 'Thin', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall14}`}></div> },
        { id: 'ball15', name: 'Wide', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall15}`}></div> },
        { id: 'ball16', name: 'Small', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall16}`}></div> },
        { id: 'ball17', name: 'Ring', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall17}`}></div> },
        { id: 'ball18', name: 'Inverted', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall18}`}></div> },
        { id: 'ball19', name: 'Split', icon: <div className={`${styles.sprite} ${styles.spriteBall} ${styles.spriteBall19}`}></div> }
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
                                                            <button className={styles.btnUploadPremium} onClick={() => document.getElementById('logo-upload').click()}>
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
                                                            <p className={styles.blockTitle}>Warna & Gradient (Body)</p>
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
                                                                <div className={styles.gradientControls}>
                                                                    <div className={styles.fieldsGrid}>
                                                                        <input type="color" value={dotsGradient.color1} onChange={(e) => setDotsGradient({ ...dotsGradient, color1: e.target.value })} />
                                                                        <input type="color" value={dotsGradient.color2} onChange={(e) => setDotsGradient({ ...dotsGradient, color2: e.target.value })} />
                                                                    </div>
                                                                    <div className={styles.inputGroupSmall}>
                                                                        <label>Rotasi: {dotsGradient.rotation}°</label>
                                                                        <input type="range" min="0" max="360" value={dotsGradient.rotation} onChange={(e) => setDotsGradient({ ...dotsGradient, rotation: parseInt(e.target.value) })} />
                                                                    </div>
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
                                                            <div className={styles.designSubBlock}>
                                                                <div className={styles.inputGroup}>
                                                                    <label>Warna Bingkai</label>
                                                                    <div className={styles.colorInputWrapper}>
                                                                        <input type="color" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} />
                                                                        <span className={styles.colorHex}>{cornerColor.toUpperCase()}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.checkboxGroupInline}>
                                                                    <input type="checkbox" id="frame-grad" checked={cornerGradient.enabled} onChange={(e) => setCornerGradient({ ...cornerGradient, enabled: e.target.checked })} />
                                                                    <label htmlFor="frame-grad">Gradient pada Bingkai</label>
                                                                </div>
                                                                {cornerGradient.enabled && (
                                                                    <div className={styles.fieldsGrid}>
                                                                        <input type="color" value={cornerGradient.color1} onChange={(e) => setCornerGradient({ ...cornerGradient, color1: e.target.value })} />
                                                                        <input type="color" value={cornerGradient.color2} onChange={(e) => setCornerGradient({ ...cornerGradient, color2: e.target.value })} />
                                                                    </div>
                                                                )}
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
                                                            <div className={styles.designSubBlock}>
                                                                <div className={styles.inputGroup}>
                                                                    <label>Warna Titik Mata</label>
                                                                    <div className={styles.colorInputWrapper}>
                                                                        <input type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} />
                                                                        <span className={styles.colorHex}>{cornerDotColor.toUpperCase()}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.checkboxGroupInline}>
                                                                    <input type="checkbox" id="ball-grad" checked={cornerDotGradient.enabled} onChange={(e) => setCornerDotGradient({ ...cornerDotGradient, enabled: e.target.checked })} />
                                                                    <label htmlFor="ball-grad">Gradient pada Titik Mata</label>
                                                                </div>
                                                                {cornerDotGradient.enabled && (
                                                                    <div className={styles.fieldsGrid}>
                                                                        <input type="color" value={cornerDotGradient.color1} onChange={(e) => setCornerDotGradient({ ...cornerDotGradient, color1: e.target.value })} />
                                                                        <input type="color" value={cornerDotGradient.color2} onChange={(e) => setCornerDotGradient({ ...cornerDotGradient, color2: e.target.value })} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={styles.designBlock}>
                                                            <p className={styles.blockTitle}>Detail Bingkai & Jarak</p>
                                                            <div className={styles.fieldsGrid}>
                                                                <div className={styles.inputGroupSmall}>
                                                                    <label>Thickness: {eyeBorderThickness}</label>
                                                                    <input type="range" min="1" max="10" step="1" value={eyeBorderThickness} onChange={(e) => setEyeBorderThickness(parseInt(e.target.value))} />
                                                                </div>
                                                                <div className={styles.inputGroupSmall}>
                                                                    <label>Spacing: {eyeSpacing}</label>
                                                                    <input type="range" min="0" max="10" step="1" value={eyeSpacing} onChange={(e) => setEyeSpacing(parseInt(e.target.value))} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${styles.accordionSection} ${sections.frame ? styles.expanded : ''}`}>
                                                <button className={styles.accordionHeader} onClick={() => toggleSection('frame')}>
                                                    <div className={styles.headerLeft}><Layout size={20} /> <span>Bingkai (Frame)</span></div>
                                                    {sections.frame ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                                <div className={styles.accordionContent}>
                                                    <div className={styles.customCardBody}>
                                                        <div className={styles.checkboxGroupInline}>
                                                            <input type="checkbox" id="frame-enable" checked={frameEnabled} onChange={(e) => setFrameEnabled(e.target.checked)} />
                                                            <label htmlFor="frame-enable">Aktifkan Bingkai</label>
                                                        </div>
                                                        {frameEnabled && (
                                                            <div className={styles.designBlock}>
                                                                <div className={styles.inputGroup}>
                                                                    <label>Warna Bingkai</label>
                                                                    <div className={styles.colorInputWrapper}>
                                                                        <input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} />
                                                                        <span className={styles.colorHex}>{frameColor.toUpperCase()}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.inputGroup}>
                                                                    <label>Gaya Bingkai</label>
                                                                    <div className={styles.typeSelector}>
                                                                        <button className={frameStyle === 'solid' ? styles.typeActive : ''} onClick={() => setFrameStyle('solid')}>Solid</button>
                                                                        <button className={frameStyle === 'dashed' ? styles.typeActive : ''} onClick={() => setFrameStyle('dashed')}>Dashed</button>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.fieldsGrid}>
                                                                    <div className={styles.inputGroupSmall}>
                                                                        <label>Tebal: {frameThickness}</label>
                                                                        <input type="range" min="1" max="50" value={frameThickness} onChange={(e) => setFrameThickness(parseInt(e.target.value))} />
                                                                    </div>
                                                                    <div className={styles.inputGroupSmall}>
                                                                        <label>Radius: {frameRadius}</label>
                                                                        <input type="range" min="0" max="200" value={frameRadius} onChange={(e) => setFrameRadius(parseInt(e.target.value))} />
                                                                    </div>
                                                                </div>
                                                                <div className={styles.inputGroup}>
                                                                    <label>Jarak Margin: {frameMargin}</label>
                                                                    <input type="range" min="0" max="100" value={frameMargin} onChange={(e) => setFrameMargin(parseInt(e.target.value))} />
                                                                </div>
                                                            </div>
                                                        )}
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
