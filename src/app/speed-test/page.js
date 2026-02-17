'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
    Activity, ArrowDown, ArrowUp, Zap, RotateCw, Play, Shield,
    Globe, Smartphone, Wifi, Server, Info, MapPin, Cpu, Laptop, Gamepad2, PlayCircle, Radio
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function SpeedTestPage() {
    const [isRunning, setIsRunning] = useState(false)
    const [currentPhase, setCurrentPhase] = useState('idle') // idle, ping, download, upload, complete

    // Metrics
    const [downloadSpeed, setDownloadSpeed] = useState(0)
    const [uploadSpeed, setUploadSpeed] = useState(0)
    const [ping, setPing] = useState(0)
    const [jitter, setJitter] = useState(0)
    const [progress, setProgress] = useState(0)
    
    // UI states
    const [gaugeValue, setGaugeValue] = useState(0)
    const [ipInfo, setIpInfo] = useState(null)
    const [location, setLocation] = useState(null)
    const [isp, setIsp] = useState(null)

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                setIpInfo(data.ip)
                setLocation(`${data.city}, ${data.region}`)
                setIsp(data.org)
            })
            .catch(err => console.error('Failed to fetch IP info', err))
    }, [])

    const runTest = async () => {
        setIsRunning(true)
        setCurrentPhase('ping')
        setDownloadSpeed(0)
        setUploadSpeed(0)
        setPing(0)
        setJitter(0)
        setProgress(0)
        setGaugeValue(0)

        try {
            await measureLatency()
            setCurrentPhase('download')
            await measureDownload()
            setCurrentPhase('upload')
            setIsRunning(true) // Keep pulse active
            await measureUpload()
            setCurrentPhase('complete')
            setGaugeValue(0)
        } catch (error) {
            console.error(error)
        } finally {
            setIsRunning(false)
        }
    }

    const measureLatency = async () => {
        const pings = []
        const endpoint = '/favicon.ico'

        for (let i = 0; i < 15; i++) {
            const start = performance.now()
            try {
                // Fixed: Ensure we don't hit local API if it doesn't exist
                await fetch(`${endpoint}?t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' })
                const end = performance.now()
                pings.push(end - start)
            } catch (e) { }
            await new Promise(r => setTimeout(r, 60))
        }

        if (pings.length > 0) {
            const avg = pings.reduce((a, b) => a + b, 0) / pings.length
            const jitterVal = pings.reduce((acc, curr) => acc + Math.abs(curr - avg), 0) / pings.length
            setPing(Math.round(Math.min(...pings)))
            setJitter(Math.round(jitterVal))
        }
    }

    // Fast.com discovery helpers with robust fallback
    const fetchFastUrls = async () => {
        const proxies = [
            'https://api.allorigins.win/get?url=',
            'https://corsproxy.io/?',
            'https://cors.lol/?url='
        ]

        const tryDiscovery = async (proxy) => {
            const appUrl = encodeURIComponent('https://fast.com/app-a.js')
            const appRes = await fetch(`${proxy}${appUrl}`)
            
            let appContent = ''
            if (proxy.includes('allorigins')) {
                const data = await appRes.json()
                appContent = data.contents
            } else {
                appContent = await appRes.text()
            }

            const tokenMatch = appContent.match(/token:"([^"]+)"/)
            if (!tokenMatch) throw new Error('Token not found')
            const token = tokenMatch[1]

            const authUrl = encodeURIComponent(`https://api.fast.com/netflix/speedtest/v2?https=true&token=${token}&urlCount=5`)
            const authRes = await fetch(`${proxy}${authUrl}`)
            
            let authContent = ''
            if (proxy.includes('allorigins')) {
                const data = await authRes.json()
                authContent = data.contents
            } else {
                authContent = await authRes.text()
            }

            const targets = JSON.parse(authContent).targets
            return targets.map(t => t.url)
        }

        for (const proxy of proxies) {
            try {
                console.log(`Attempting discovery via ${proxy}`)
                return await tryDiscovery(proxy)
            } catch (e) {
                console.warn(`Discovery failed for ${proxy}, trying next...`, e)
            }
        }

        return [
            'https://upload.wikimedia.org/wikipedia/commons/3/3a/A_vivid_sunset_on_the_Pacific_Ocean._(5_MB).jpg',
            'https://upload.wikimedia.org/wikipedia/commons/e/ea/The_Earth_at_Night_-_View_from_Space_Panorama.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/b2/City_of_Ottawa_Skyline_Panoramic_2019.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/b6/F-15C_Eagle_Sand_and_Sky.jpg'
        ]
    }

    const average = (arr) => {
        const filtered = arr.filter(e => e !== null)
        if (filtered.length === 0) return 0
        return filtered.reduce((a, b) => a + b) / filtered.length
    }

    const measureDownload = async () => {
        const duration = 15000 
        const bufferSize = 10
        const maxCheckInterval = 200
        const interval = Math.min(duration / bufferSize, maxCheckInterval)
        
        const startTime = performance.now()
        let bytesSinceLastCheck = 0

        const resources = await fetchFastUrls()

        return new Promise((resolve) => {
            let running = true
            const maxParallel = 4
            const recents = new Array(bufferSize).fill(null)
            let recentsIdx = 0

            const updateSpeed = setInterval(() => {
                if (!running) {
                    clearInterval(updateSpeed)
                    return
                }

                const now = performance.now()
                const elapsed = (now - startTime) / 1000

                const bytesInThisInterval = bytesSinceLastCheck
                bytesSinceLastCheck = 0 

                const bps = bytesInThisInterval / (interval / 1000)
                const mbps = (bps * 8) / 1000000

                recents[recentsIdx] = mbps
                recentsIdx = (recentsIdx + 1) % bufferSize

                const avgMbps = average(recents)
                setDownloadSpeed(parseFloat(avgMbps.toFixed(2)))
                setGaugeValue(avgMbps)
                setProgress(Math.min((elapsed / 15) * 100, 100))

                if (elapsed >= 15) {
                    running = false
                    clearInterval(updateSpeed)
                    resolve()
                }
            }, interval)

            const startRequest = (id) => {
                if (!running) return
                const xhr = new XMLHttpRequest()
                const url = resources[Math.floor(Math.random() * resources.length)]
                const finalUrl = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`
                
                xhr.open('GET', finalUrl, true)
                xhr.responseType = 'arraybuffer'
                
                let lastLoaded = 0
                xhr.onprogress = (event) => {
                    if (running) {
                        const delta = event.loaded - lastLoaded
                        bytesSinceLastCheck += delta
                        lastLoaded = event.loaded
                    }
                }
                xhr.onload = xhr.onerror = () => {
                    if (running) {
                        startRequest(id)
                    }
                }
                xhr.send()
            }

            for (let i = 0; i < maxParallel; i++) {
                startRequest(i)
            }
        })
    }

    const measureUpload = async () => {
        const duration = 10000
        const bufferSize = 10
        const maxCheckInterval = 200
        const interval = Math.min(duration / bufferSize, maxCheckInterval)
        
        const startTime = performance.now()
        let bytesSinceLastCheck = 0

        return new Promise((resolve) => {
            let running = true
            const recents = new Array(bufferSize).fill(null)
            let recentsIdx = 0

            const updateSpeed = setInterval(() => {
                if (!running) {
                    clearInterval(updateSpeed)
                    return
                }

                const now = performance.now()
                const elapsed = (now - startTime) / 1000

                const bytesInThisInterval = bytesSinceLastCheck
                bytesSinceLastCheck = 0

                const bps = bytesInThisInterval / (interval / 1000)
                const mbps = (bps * 8) / 1000000

                recents[recentsIdx] = mbps
                recentsIdx = (recentsIdx + 1) % bufferSize

                const avgMbps = average(recents)
                setUploadSpeed(parseFloat(avgMbps.toFixed(2)))
                setGaugeValue(avgMbps)
                setProgress(Math.min((elapsed / 10) * 100, 100))

                if (elapsed >= 10) {
                    running = false
                    clearInterval(updateSpeed)
                    resolve()
                }
            }, interval)

            const sendData = () => {
                if (!running) return
                const size = 1024 * 1024
                const blob = new Blob([new Uint8Array(size).map(() => Math.floor(Math.random() * 255))])
                const xhr = new XMLHttpRequest()
                
                xhr.open('POST', `https://speed.cloudflare.com/__up?t=${Date.now()}`, true)
                
                let lastLoaded = 0
                xhr.upload.onprogress = (event) => {
                    if (running) {
                        const delta = event.loaded - lastLoaded
                        bytesSinceLastCheck += delta
                        lastLoaded = event.loaded
                    }
                }
                xhr.onload = xhr.onerror = () => {
                    if (running) {
                        sendData()
                    }
                }
                xhr.send(blob)
            }

            for (let i = 0; i < 2; i++) {
                sendData()
            }
        })
    }

    // CUSTOM GAUGE LOGIC FOR NON-LINEAR SCALE (0, 5, 10, 50, 100, 250, 500, 750, 1000)
    const markers = [0, 5, 10, 50, 100, 250, 500, 750, 1000]
    const getMarkerAngle = (val) => {
        // Map markers to 0 - 240 degrees (3/4 circle)
        // Markers: 0(0), 5(30), 10(60), 50(90), 100(120), 250(150), 500(180), 750(210), 1000(240)
        if (val <= 0) return 0
        if (val >= 1000) return 240

        for (let i = 0; i < markers.length - 1; i++) {
            if (val >= markers[i] && val <= markers[i+1]) {
                const rangeStart = markers[i]
                const rangeEnd = markers[i+1]
                const angleStart = i * 30
                const angleEnd = (i + 1) * 30
                const percent = (val - rangeStart) / (rangeEnd - rangeStart)
                return angleStart + percent * (angleEnd - angleStart)
            }
        }
        return 240
    }

    const getGaugeRotation = () => {
        return getMarkerAngle(gaugeValue) - 120 // Starting at -120 to center the 240deg arc top-wise
    }

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        ⚡ Speed Test <span>Internet</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Ukur kecepatan internet Anda secara akurat dengan teknologi Fast.com-style.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={14} /> Premium Cyber-Measurement Engine
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>
                        
                        {/* Download/Upload Top Cards */}
                        <div className={styles.headerMetrics}>
                            <div className={`${styles.mainMetric} ${currentPhase === 'download' ? styles.mainMetricActive : ''} ${styles.downloadMetricActive}`}>
                                <div className={styles.mainMetricLabel}>
                                    <ArrowDown className={styles.downloadIcon} size={18} /> DOWNLOAD <span>Mbps</span>
                                </div>
                                <div className={styles.metricValue} style={{ color: '#22d3ee', fontSize: '2.5rem' }}>
                                    {downloadSpeed || '—'}
                                </div>
                            </div>
                            <div className={`${styles.mainMetric} ${currentPhase === 'upload' ? styles.mainMetricActive : ''} ${styles.uploadMetricActive}`}>
                                <div className={styles.mainMetricLabel}>
                                    <ArrowUp className={styles.uploadIcon} size={18} /> UPLOAD <span>Mbps</span>
                                </div>
                                <div className={styles.metricValue} style={{ color: '#a78bfa', fontSize: '2.5rem' }}>
                                    {uploadSpeed || '—'}
                                </div>
                            </div>
                        </div>

                        {/* Ping/Jitter Metrics */}
                        <div className={styles.subMetrics}>
                            <div className={styles.subMetric}>
                                <div className={styles.subMetricLabel}>Ping <span>ms</span></div>
                                <div className={styles.subMetricValue}>
                                    <Activity className={styles.pingIcon} size={16} /> {ping || '—'}
                                </div>
                            </div>
                            <div className={styles.subMetric}>
                                <div className={styles.subMetricLabel}>Jitter <span>ms</span></div>
                                <div className={styles.subMetricValue}>
                                    <RotateCw className={styles.jitterIcon} size={16} /> {jitter || '—'}
                                </div>
                            </div>
                        </div>

                        {/* Activity Icons (Mockup features like in screenshot) */}
                        <div style={{ display: 'flex', gap: '2rem', opacity: 0.4, margin: '0.5rem 0' }}>
                            <Laptop size={20} color="#94a3b8" />
                            <Gamepad2 size={20} color="#94a3b8" />
                            <PlayCircle size={20} color="#94a3b8" />
                            <Radio size={20} color="#94a3b8" />
                        </div>

                        {/* Main Gauge */}
                        <div className={styles.gaugeWrapper}>
                            <svg className={styles.gaugeSvg} viewBox="0 0 200 200">
                                <defs>
                                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22d3ee88" />
                                        <stop offset="100%" stopColor="#0ea5e9" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    className={styles.gaugeTrack} 
                                    d="M 40 160 A 85 85 0 1 1 160 160" 
                                />
                                <path 
                                    className={styles.gaugeProgress}
                                    d="M 40 160 A 85 85 0 1 1 160 160"
                                    style={{ 
                                        strokeDashoffset: 440 - (getMarkerAngle(gaugeValue) / 240) * 440,
                                        stroke: currentPhase === 'download' ? '#22d3ee' : currentPhase === 'upload' ? '#a78bfa' : '#38bdf8'
                                    }}
                                />
                                <path 
                                    className={`${styles.gaugeProgress} ${styles.gaugeGlow}`}
                                    d="M 40 160 A 85 85 0 1 1 160 160"
                                    style={{ 
                                        strokeDashoffset: 440 - (getMarkerAngle(gaugeValue) / 240) * 440,
                                        stroke: currentPhase === 'download' ? '#22d3ee' : currentPhase === 'upload' ? '#a78bfa' : '#38bdf8'
                                    }}
                                />
                                
                                {/* Label Text Markers */}
                                <g className={styles.gaugeLabels} fontSize="7" fill="#64748b">
                                    <text x="35" y="165" textAnchor="middle">0</text>
                                    <text x="25" y="115" textAnchor="middle">5</text>
                                    <text x="40" y="75" textAnchor="middle">10</text>
                                    <text x="75" y="45" textAnchor="middle">50</text>
                                    <text x="125" y="45" textAnchor="middle">100</text>
                                    <text x="160" y="75" textAnchor="middle">250</text>
                                    <text x="175" y="115" textAnchor="middle">500</text>
                                    <text x="165" y="165" textAnchor="middle">1000</text>
                                </g>

                                <g className={styles.gaugeNeedle} transform={`rotate(${getGaugeRotation()} 100 100)`}>
                                    <path className={styles.needleBody} d="M 98 100 L 100 35 L 102 100 Z" />
                                    <circle className={styles.needleCore} cx="100" cy="100" r="4" />
                                </g>
                            </svg>

                            <div className={styles.gaugeCenter}>
                                <div className={styles.currentSpeed}>
                                    {currentPhase === 'idle' ? '0.00' : gaugeValue ? gaugeValue.toFixed(2) : '0.00'}
                                </div>
                                <div className={styles.currentUnit}>
                                    <Activity size={12} /> Mbps
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info Section */}
                        <div className={styles.networkInfo}>
                            <div className={styles.infoBlock}>
                                <div className={styles.infoIconWrapper}>
                                    <Wifi size={20} />
                                </div>
                                <div className={styles.infoText}>
                                    <span className={styles.infoTitle}>{isp || 'Detecting ISP...'}</span>
                                    <span className={styles.infoSubtitle}>{ipInfo || 'Detecting IP...'}</span>
                                </div>
                            </div>
                            <div className={styles.infoBlock}>
                                <div className={styles.infoIconWrapper}>
                                    <Server size={20} />
                                </div>
                                <div className={styles.infoText}>
                                    <span className={styles.infoTitle}>SBN Bekasi by GMDP</span>
                                    <span className={styles.infoSubtitle}>{location || 'West Java, ID'}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className={styles.startButton}
                            onClick={runTest}
                            disabled={isRunning}
                        >
                            {isRunning ? (
                                <> <RotateCw className={styles.spin} size={20} /> MENGUKUR KECEPATAN... </>
                            ) : (
                                <> <Play size={20} fill="currentColor" /> MULAI TEST </>
                            )}
                        </button>
                    </div>
                </div>

                <TrustSection />
                <GuideSection toolId="speed-test" />
            </main>
            <Footer />
        </div>
    )
}
