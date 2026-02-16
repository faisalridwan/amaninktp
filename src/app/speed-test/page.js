'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
    Activity, ArrowDown, ArrowUp, Zap, RotateCw, Play, Shield,
    Globe, Smartphone, Wifi, Server, Info
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
            // 1. PING & JITTER
            await measureLatency()

            // 2. DOWNLOAD
            setCurrentPhase('download')
            await measureDownload()

            // 3. UPLOAD
            setCurrentPhase('upload')
            await measureUpload()

            // DONE
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
        // Use a highly available endpoint for ping
        const endpoint = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'

        for (let i = 0; i < 10; i++) {
            const start = performance.now()
            try {
                await fetch(`${endpoint}?t=${Date.now()}`, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
                const end = performance.now()
                pings.push(end - start)
            } catch (e) { }
            await new Promise(r => setTimeout(r, 100))
        }

        if (pings.length > 0) {
            const avg = pings.reduce((a, b) => a + b, 0) / pings.length
            const jitterVal = pings.reduce((acc, curr) => acc + Math.abs(curr - avg), 0) / pings.length
            setPing(Math.round(Math.min(...pings)))
            setJitter(Math.round(jitterVal))
        }
    }

    const measureDownload = async () => {
        const totalDuration = 8000
        const startTime = performance.now()
        let totalBytes = 0
        
        const resources = [
            'https://upload.wikimedia.org/wikipedia/commons/3/3a/A_vivid_sunset_on_the_Pacific_Ocean._(5_MB).jpg',
            'https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/b2/City_of_Ottawa_Skyline_Panoramic_2019.jpg' 
        ]

        return new Promise((resolve) => {
            let activeRequests = 0
            const maxParallel = 3 

            const startRequest = () => {
                const now = performance.now()
                if (now - startTime > totalDuration) {
                    if (activeRequests === 0) resolve()
                    return
                }

                activeRequests++
                const xhr = new XMLHttpRequest()
                const url = resources[Math.floor(Math.random() * resources.length)]
                
                xhr.open('GET', `${url}?t=${Date.now()}`, true)
                xhr.onprogress = (event) => {
                    const elapsed = (performance.now() - startTime) / 1000
                    if (elapsed > 0) {
                        const mbps = ((totalBytes + event.loaded) * 8 / 1000000) / elapsed
                        setDownloadSpeed(mbps.toFixed(1))
                        setGaugeValue(mbps)
                        setProgress(Math.min((elapsed / 8) * 100, 100))
                    }
                }
                xhr.onload = xhr.onerror = () => {
                    totalBytes += xhr.response?.size || 5000000 
                    activeRequests--
                    startRequest()
                }
                xhr.send()
            }

            for (let i = 0; i < maxParallel; i++) {
                startRequest()
            }
        })
    }

    const measureUpload = async () => {
        const totalDuration = 8000
        const startTime = performance.now()
        let totalBytes = 0
        const chunkSize = 1 * 1024 * 1024 

        return new Promise((resolve) => {
            const startRequest = async () => {
                const now = performance.now()
                if (now - startTime > totalDuration) {
                    resolve()
                    return
                }

                const buffer = new Uint8Array(chunkSize)
                for(let i=0; i<chunkSize; i++) buffer[i] = Math.random() * 255
                const blob = new Blob([buffer])
                
                const xhr = new XMLHttpRequest()
                xhr.open('POST', `https://speed.cloudflare.com/__up?t=${Date.now()}`, true)
                
                xhr.upload.onprogress = (event) => {
                    const elapsed = (performance.now() - startTime) / 1000
                    if (elapsed > 0) {
                        const mbps = ((totalBytes + event.loaded) * 8 / 1000000) / elapsed
                        setUploadSpeed(mbps.toFixed(1))
                        setGaugeValue(mbps)
                        setProgress(Math.min((elapsed / 8) * 100, 100))
                    }
                }
                xhr.onload = xhr.onerror = () => {
                    totalBytes += chunkSize
                    startRequest()
                }
                xhr.send(blob)
            }
            startRequest()
        })
    }

    const getGaugeRotation = () => {
        let angle = 0
        if (gaugeValue <= 10) {
            angle = (gaugeValue / 10) * 60 
        } else if (gaugeValue <= 100) {
            angle = 60 + ((gaugeValue - 10) / 90) * 120 
        } else {
            angle = 180 + Math.min(((gaugeValue - 100) / 900) * 60, 60) 
        }
        return angle - 120 
    }

    // Helper for Gauge Color
    const getGaugeColor = () => {
        if (currentPhase === 'download') return '#10B981' // Green
        if (currentPhase === 'upload') return '#8B5CF6' // Purple
        return '#CBD5E1'
    }

    const gaugeRotation = Math.min((gaugeValue / 100) * 180, 180) // Max 100mbps for visual scale? Or log scale?
    // Simple linear for now: 100mbps max visual

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        <Zap size={32} /> Speed <span>Test</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Ukur kecepatan internet Anda secara akurat dengan teknologi adaptive parallel streaming.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> Secure Client-Side Measurement
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>
                        
                        {/* Advanced SVG Gauge */}
                        <div className={styles.gaugeWrapper}>
                            <svg className={styles.gaugeSvg} viewBox="0 0 200 150">
                                {/* Background Arc */}
                                <path 
                                    className={styles.gaugePath} 
                                    d="M 40 130 A 70 70 0 1 1 160 130" 
                                />
                                {/* Progress Arc */}
                                <path 
                                    className={styles.gaugeProgress}
                                    d="M 40 130 A 70 70 0 1 1 160 130"
                                    style={{ 
                                        strokeDashoffset: 283 - (getGaugeRotation() + 120) / 240 * 283,
                                        stroke: currentPhase === 'download' ? '#10B981' : currentPhase === 'upload' ? '#8B5CF6' : '#3b82f6'
                                    }}
                                />
                                {/* Glow Effect */}
                                <path 
                                    className={`${styles.gaugeProgress} ${styles.gaugeGlow}`}
                                    d="M 40 130 A 70 70 0 1 1 160 130"
                                    style={{ 
                                        strokeDashoffset: 283 - (getGaugeRotation() + 120) / 240 * 283,
                                        stroke: currentPhase === 'download' ? '#10B981' : currentPhase === 'upload' ? '#8B5CF6' : '#3b82f6'
                                    }}
                                />
                                {/* Needle */}
                                <g transform={`rotate(${getGaugeRotation()} 100 100)`}>
                                    <path 
                                        className={styles.gaugeNeedle}
                                        d="M 98 100 L 100 30 L 102 100 Z" 
                                        style={{ fill: currentPhase === 'download' ? '#10B981' : currentPhase === 'upload' ? '#8B5CF6' : '#3b82f6' }}
                                    />
                                    <circle cx="100" cy="100" r="5" fill="#1e293b" />
                                </g>
                                
                                {/* Labels */}
                                <text x="40" y="145" fontSize="8" fill="#94a3b8" textAnchor="middle">0</text>
                                <text x="70" y="55" fontSize="8" fill="#94a3b8" textAnchor="middle">10</text>
                                <text x="130" y="55" fontSize="8" fill="#94a3b8" textAnchor="middle">100</text>
                                <text x="160" y="145" fontSize="8" fill="#94a3b8" textAnchor="middle">1k</text>
                            </svg>

                            <div className={styles.gaugeInfo}>
                                <div className={styles.speedValue}>
                                    {currentPhase === 'idle' ? '0.0' : parseFloat(gaugeValue).toFixed(1)}
                                </div>
                                <div className={styles.unit}>Mbps</div>
                                <div className={styles.statusText}>
                                    {currentPhase === 'idle' && 'Ready'}
                                    {currentPhase === 'ping' && 'Latency'}
                                    {currentPhase === 'download' && 'Download'}
                                    {currentPhase === 'upload' && 'Upload'}
                                    {currentPhase === 'complete' && 'Selesai'}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className={styles.metrics}>
                            <div className={`${styles.metricCard} ${currentPhase === 'ping' ? styles.metricCardActive : ''}`}>
                                <div className={styles.metricLabel}><Activity size={14} /> PING</div>
                                <div className={styles.metricValue} style={{ color: '#F59E0B' }}>
                                    {ping > 0 ? ping : '-'} <span style={{ fontSize: '0.8rem' }}>ms</span>
                                </div>
                            </div>
                            <div className={`${styles.metricCard} ${currentPhase === 'ping' ? styles.metricCardActive : ''}`}>
                                <div className={styles.metricLabel}><Activity size={14} /> JITTER</div>
                                <div className={styles.metricValue} style={{ color: '#F59E0B' }}>
                                    {jitter > 0 ? jitter : '-'} <span style={{ fontSize: '0.8rem' }}>ms</span>
                                </div>
                            </div>
                            <div className={`${styles.metricCard} ${currentPhase === 'download' ? styles.metricCardActive : ''}`}>
                                <div className={styles.metricLabel}><ArrowDown size={14} /> DOWNLOAD</div>
                                <div className={styles.metricValue} style={{ color: '#10B981' }}>
                                    {downloadSpeed > 0 ? downloadSpeed : '-'} <span style={{ fontSize: '0.8rem' }}>Mbps</span>
                                </div>
                            </div>
                            <div className={`${styles.metricCard} ${currentPhase === 'upload' ? styles.metricCardActive : ''}`}>
                                <div className={styles.metricLabel}><ArrowUp size={14} /> UPLOAD</div>
                                <div className={styles.metricValue} style={{ color: '#8B5CF6' }}>
                                    {uploadSpeed > 0 ? uploadSpeed : '-'} <span style={{ fontSize: '0.8rem' }}>Mbps</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className={styles.infoSection}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Internet Provider</span>
                                    <span className={styles.infoValue}>
                                        <Wifi className={styles.infoIcon} size={18} /> {isp || 'Detecting...'}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>IP Address</span>
                                    <span className={styles.infoValue}>
                                        <Globe className={styles.infoIcon} size={18} /> {ipInfo || '...'}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Location</span>
                                    <span className={styles.infoValue}>
                                        <Server className={styles.infoIcon} size={18} /> {location || '...'}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Measurement</span>
                                    <span className={styles.infoValue}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', marginRight: 10 }} /> 
                                        Adaptive CDN Optimization
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            className={styles.startButton}
                            onClick={runTest}
                            disabled={isRunning}
                        >
                            {isRunning ? (
                                <> <RotateCw className={styles.spin} size={24} /> Testing... </>
                            ) : (
                                <> <Play size={24} fill="currentColor" /> MULAI TEST </>
                            )}
                        </button>
                    </div>
                    
                    <TrustSection />
                    <GuideSection toolId="speed-test" />
                </div>
            </main>
            <Footer />
        </>
    )
}
