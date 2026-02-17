'use client'

import { useState, useEffect } from 'react'
import {
    Globe, Smartphone, Monitor, MapPin, Cpu, Wifi, Copy, Check, Shield
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function IPCheckPage() {
    const [ipData, setIpData] = useState(null)
    const [deviceInfo, setDeviceInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get IP Data
                const res = await fetch('https://ipapi.co/json/')
                if (!res.ok) throw new Error('Failed to fetch IP data')
                const data = await res.json()
                setIpData(data)
            } catch (err) {
                console.error(err)
                // Fallback if ipapi.co fails (e.g. adblocker)
                try {
                    const res2 = await fetch('https://api.ipify.org?format=json')
                    const data2 = await res2.json()
                    setIpData({ ip: data2.ip })
                } catch (err2) {
                    setError('Gagal memuat data IP. Pastikan tidak ada AdBlocker.')
                }
            } finally {
                setLoading(false)
            }

            // 2. Get Device Info
            const ua = navigator.userAgent
            let os = "Unknown OS"
            if (ua.indexOf("Win") !== -1) os = "Windows"
            if (ua.indexOf("Mac") !== -1) os = "MacOS"
            if (ua.indexOf("Linux") !== -1) os = "Linux"
            if (ua.indexOf("Android") !== -1) os = "Android"
            if (ua.indexOf("like Mac") !== -1) os = "iOS"

            let browser = "Unknown Browser"
            if (ua.indexOf("Chrome") !== -1) browser = "Chrome"
            if (ua.indexOf("Firefox") !== -1) browser = "Firefox"
            if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) browser = "Safari"
            if (ua.indexOf("Edge") !== -1) browser = "Edge"

            setDeviceInfo({
                os: os,
                browser: browser,
                screen: `${window.screen.width} x ${window.screen.height}`,
                userAgent: ua
            })
        }

        fetchData()
    }, [])

    const copyIP = () => {
        if (ipData?.ip) {
            navigator.clipboard.writeText(ipData.ip)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        🌐 Cek Alamat <span>IP</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Lihat alamat IP publik dan informasi perangkat yang Anda gunakan saat ini.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> Data hanya ditampilkan, tidak disimpan.
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>
                        {loading && <div className={styles.loading}></div>}

                        {error && <div style={{ color: 'red' }}>{error}</div>}

                        {!loading && ipData && (
                            <>
                                <div className={styles.ipDisplay}>
                                    <div className={styles.ipLabel}>Public IP Address</div>
                                    <div className={styles.ipAddress}>{ipData.ip}</div>
                                    <button className={styles.copyBtn} onClick={copyIP}>
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? 'Disalin' : 'Salin IP'}
                                    </button>
                                </div>

                                <div className={styles.infoGrid}>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><MapPin size={24} /></div>
                                        <div className={styles.cardLabel}>Lokasi</div>
                                        <div className={styles.cardValue}>
                                            {ipData.city || '-'}, {ipData.region || '-'}, {ipData.country_name || '-'}
                                        </div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Wifi size={24} /></div>
                                        <div className={styles.cardLabel}>ISP / Provider</div>
                                        <div className={styles.cardValue}>{ipData.org || ipData.asn || '-'}</div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Monitor size={24} /></div>
                                        <div className={styles.cardLabel}>Sistem Operasi</div>
                                        <div className={styles.cardValue}>{deviceInfo?.os}</div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Globe size={24} /></div>
                                        <div className={styles.cardLabel}>Browser</div>
                                        <div className={styles.cardValue}>{deviceInfo?.browser}</div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Smartphone size={24} /></div>
                                        <div className={styles.cardLabel}>Resolusi Layar</div>
                                        <div className={styles.cardValue}>{deviceInfo?.screen}</div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Cpu size={24} /></div>
                                        <div className={styles.cardLabel}>User Agent</div>
                                        <div className={styles.cardValue} style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                                            {deviceInfo?.userAgent.substring(0, 50)}...
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <TrustSection />
                    <GuideSection toolId="ip-check" />
                </div>
            </main>
            <Footer />
        </>
    )
}
