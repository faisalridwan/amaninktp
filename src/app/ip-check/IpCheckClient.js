'use client'

import { useState, useEffect } from 'react'
import {
    Globe, Smartphone, Monitor, MapPin, Cpu, Wifi, Copy, Check, Shield, 
    Clock, Map, Flag, Hash, DollarSign, Languages as LanguagesIcon, Server
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
                // 1. Try freeipapi.com (Primary - Rich Data)
                // Note: Using https to ensure secure connection and avoid mixed content
                const res = await fetch('https://freeipapi.com/api/json')
                
                if (res.ok) {
                    const data = await res.json()
                    setIpData(data)
                    return // Exit if successful
                } else {
                    console.warn('freeipapi.com failed, trying ipapi.co...')
                }
            } catch (err) {
                 console.warn('freeipapi.com error:', err)
            }

            // 2. Fallback: ipapi.co
            try {
                const res = await fetch('https://ipapi.co/json/')
                if (res.ok) {
                    const data = await res.json()
                    // Normalize data structure to match freeipapi as much as possible
                    setIpData({
                        ipAddress: data.ip,
                        ipVersion: data.version === 'IPv6' ? 6 : 4,
                        cityName: data.city,
                        regionName: data.region,
                        zipCode: data.postal,
                        countryName: data.country_name,
                        countryCode: data.country_code,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        asn: data.asn?.replace('AS', ''),
                        asnOrganization: data.org,
                        isProxy: false, // ipapi.co doesn't provide this in free tier easily
                        timeZones: [data.timezone],
                        currencies: [data.currency],
                        languages: [data.languages ? data.languages.split(',')[0] : 'en']
                    })
                    return
                }
            } catch (err) {
                 console.warn('ipapi.co error:', err)
            }

           // 3. Fallback: ipwho.is
           try {
                const res = await fetch('https://ipwho.is/')
                if (res.ok) {
                    const data = await res.json()
                    if (data.success) {
                         setIpData({
                            ipAddress: data.ip,
                            ipVersion: 4, // ipwho.is usually IPv4
                            cityName: data.city,
                            regionName: data.region,
                            zipCode: data.postal,
                            countryName: data.country,
                            countryCode: data.country_code,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            asn: data.connection?.asn,
                            asnOrganization: data.connection?.org,
                            isProxy: false,
                            timeZones: [data.timezone?.id],
                            currencies: [data.currency?.code],
                            languages: ['en']
                        })
                        return
                    }
                }
           } catch (err) {
                 console.warn('ipwho.is error:', err)
           }

            // 4. Final Fallback: ipify (Minimal)
            try {
                const res = await fetch('https://api.ipify.org?format=json')
                if (res.ok) {
                    const data = await res.json()
                    setIpData({ 
                        ipAddress: data.ip,
                        cityName: '-', regionName: '-', countryName: '-', 
                        ipVersion: 4 
                    })
                } else {
                    throw new Error('All IP APIs failed')
                }
            } catch (err) {
                console.error('Final fallback failed', err)
                setError('Gagal memuat data IP. Pastikan koneksi aman dan tidak ada AdBlocker.')
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
        if (ipData?.ipAddress) {
            navigator.clipboard.writeText(ipData.ipAddress)
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
                                    <div className={styles.ipLabel}>Public IP Address ({ipData.ipVersion === 4 ? 'IPv4' : 'IPv6'})</div>
                                    <div className={styles.ipAddress}>{ipData.ipAddress}</div>
                                    <button className={styles.copyBtn} onClick={copyIP}>
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? 'Disalin' : 'Salin IP'}
                                    </button>
                                </div>

                                <div className={styles.infoGrid}>
                                    {/* Location */}
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><MapPin size={24} /></div>
                                        <div className={styles.cardLabel}>Lokasi</div>
                                        <div className={styles.cardValue}>
                                            {ipData.cityName}, {ipData.regionName} {ipData.zipCode}
                                        </div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Flag size={24} /></div>
                                        <div className={styles.cardLabel}>Negara</div>
                                        <div className={styles.cardValue}>
                                            {ipData.countryName} ({ipData.countryCode})
                                        </div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Map size={24} /></div>
                                        <div className={styles.cardLabel}>Koordinat</div>
                                        <div className={styles.cardValue}>
                                            {ipData.latitude}, {ipData.longitude}
                                        </div>
                                    </div>

                                    {/* Network */}
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Server size={24} /></div>
                                        <div className={styles.cardLabel}>ASN / Org</div>
                                        <div className={styles.cardValue}>
                                            AS{ipData.asn} {ipData.asnOrganization}
                                        </div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Shield size={24} /></div>
                                        <div className={styles.cardLabel}>Proxy / VPN</div>
                                        <div className={styles.cardValue} style={{ color: ipData.isProxy ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                                            {ipData.isProxy ? 'Terdeteksi' : 'Aman (Tidak Terdeteksi)'}
                                        </div>
                                    </div>

                                    {/* Regional */}
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><Clock size={24} /></div>
                                        <div className={styles.cardLabel}>Zona Waktu</div>
                                        <div className={styles.cardValue}>
                                            {ipData.timeZones ? ipData.timeZones.join(', ') : '-'}
                                        </div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><DollarSign size={24} /></div>
                                        <div className={styles.cardLabel}>Mata Uang</div>
                                        <div className={styles.cardValue}>
                                            {ipData.currencies ? ipData.currencies.join(', ') : '-'}
                                        </div>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <div className={styles.cardIcon}><LanguagesIcon size={24} /></div>
                                        <div className={styles.cardLabel}>Bahasa</div>
                                        <div className={styles.cardValue}>
                                            {ipData.languages ? ipData.languages.join(', ') : '-'}
                                        </div>
                                    </div>

                                    {/* Device Info (Client Side) */}
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
                                        <div className={styles.cardLabel}>Screen</div>
                                        <div className={styles.cardValue}>{deviceInfo?.screen}</div>
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
