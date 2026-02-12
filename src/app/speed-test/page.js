'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Activity, ArrowDown, ArrowUp, Zap, RotateCw, Play, Shield,
    Globe, Smartphone, Wifi, Server
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
    const [logs, setLogs] = useState([])

    // Info
    const [ipInfo, setIpInfo] = useState(null)
    const [location, setLocation] = useState(null)
    const [isp, setIsp] = useState(null)

    // Gauge
    const [gaugeValue, setGaugeValue] = useState(0)

    useEffect(() => {
        // Fetch IP Info on load
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
        setDownloadSpeed(0)
        setUploadSpeed(0)
        setPing(0)
        setJitter(0)
        setProgress(0)
        setGaugeValue(0)
        setLogs([])

        try {
            // 1. PING & JITTER
            setCurrentPhase('ping')
            setStatus('Testing Latency...')
            await measureLatency()

            // 2. DOWNLOAD
            setCurrentPhase('download')
            setStatus('Testing Download...')
            await measureDownload()

            // 3. UPLOAD
            setCurrentPhase('upload')
            setStatus('Testing Upload...')
            await measureUpload()

            // DONE
            setCurrentPhase('complete')
            setStatus('Test Completed')
            setGaugeValue(0)

        } catch (error) {
            console.error(error)
            setStatus('Error: Connection Failed')
        } finally {
            setIsRunning(false)
        }
    }

    const setStatus = (msg) => {
        // Simple log or status update if needed
    }

    const measureLatency = async () => {
        const pings = []
        // Use a lightweight resource, e.g., google favicon or similar small resource with no-cache
        // Or just HEAD request to own server
        const endpoint = '/favicon.ico'

        for (let i = 0; i < 8; i++) {
            const start = performance.now()
            try {
                await fetch(`${endpoint}?t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' })
                const end = performance.now()
                pings.push(end - start)
            } catch (e) { }
            // small delay
            await new Promise(r => setTimeout(r, 50))
        }

        if (pings.length > 0) {
            const min = Math.min(...pings)
            const max = Math.max(...pings)
            const avg = pings.reduce((a, b) => a + b, 0) / pings.length

            // Calculate Jitter (standard deviation or just max-min variance)
            // Typically Jitter is average deviation from the mean
            const jitterVal = pings.reduce((acc, curr) => acc + Math.abs(curr - avg), 0) / pings.length

            setPing(Math.round(min)) // Usually min ping is the "real" latency without queuing
            setJitter(Math.round(jitterVal))
        }
    }

    const measureDownload = async () => {
        // Use a larger file for download test. 
        // 5MB image from wikimedia
        const fileUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg'

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            const startTime = performance.now()
            let lastLoaded = 0

            xhr.open('GET', `${fileUrl}?t=${Date.now()}`, true)
            xhr.responseType = 'blob'

            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    const now = performance.now()
                    const duration = (now - startTime) / 1000 // seconds

                    if (duration > 0) {
                        // Bits loaded
                        const bitsLoaded = event.loaded * 8
                        const speedMbps = (bitsLoaded / 1000000) / duration

                        setDownloadSpeed(speedMbps.toFixed(2))
                        setGaugeValue(speedMbps)

                        // Calculate percentage
                        const percent = (event.loaded / event.total) * 100
                        setProgress(percent)
                    }
                }
            }

            xhr.onload = () => {
                resolve()
                setGaugeValue(0)
            }
            xhr.onerror = reject
            xhr.send()
        })
    }

    const measureUpload = async () => {
        // Upload Speed Simulation
        // We will "upload" a generated blob to a dummy endpoint on our own server (which will 404 but accept body)
        // 2MB Payload
        const size = 2 * 1024 * 1024
        const buffer = new Uint8Array(size) // 2MB dummy data
        const blob = new Blob([buffer], { type: 'application/octet-stream' })

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            const startTime = performance.now()

            // POST to a non-existent endpoint on current origin to test upstream speed
            xhr.open('POST', '/api/upload-test-dummy?t=' + Date.now(), true)

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const now = performance.now()
                    const duration = (now - startTime) / 1000

                    if (duration > 0) {
                        const bitsLoaded = event.loaded * 8
                        const speedMbps = (bitsLoaded / 1000000) / duration

                        setUploadSpeed(speedMbps.toFixed(2))
                        setGaugeValue(speedMbps)

                        const percent = (event.loaded / event.total) * 100
                        setProgress(percent)
                    }
                }
            }

            xhr.onload = () => resolve() // Even if 404, upload happened
            xhr.onerror = () => resolve() // Network error might mean block, but we try
            xhr.upload.onloadend = () => resolve()

            xhr.send(blob)
        })
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
                        Ukur kecepatan internet Anda secara detail. Download, Upload, Ping, dan Jitter.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> Secure Client-Side Test
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>

                        {/* Gauge Visual */}
                        <div className={styles.gaugeContainer}>
                            <div
                                className={styles.gaugeCircle}
                                style={{
                                    background: `conic-gradient(
                                        ${getGaugeColor()} 0% ${Math.min(gaugeValue, 100)}%, 
                                        var(--bg-secondary) ${Math.min(gaugeValue, 100)}% 100%
                                    )`
                                }}
                            />
                            <div className={styles.gaugeInner}>
                                <div className={styles.speedValue}>
                                    {currentPhase === 'download' ? downloadSpeed :
                                        currentPhase === 'upload' ? uploadSpeed :
                                            currentPhase === 'complete' ? downloadSpeed : '0.0'}
                                </div>
                                <div className={styles.unit}>Mbps</div>
                                <div className={styles.statusText}>
                                    {currentPhase === 'idle' && 'Ready'}
                                    {currentPhase === 'ping' && 'Ping...'}
                                    {currentPhase === 'download' && 'Download'}
                                    {currentPhase === 'upload' && 'Upload'}
                                    {currentPhase === 'complete' && 'Selesai'}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className={styles.metrics}>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}><Activity size={14} /> PING</div>
                                <div className={styles.metricValue} style={{ color: '#F59E0B' }}>
                                    {ping > 0 ? ping + ' ms' : '-'}
                                </div>
                            </div>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}><Activity size={14} /> JITTER</div>
                                <div className={styles.metricValue} style={{ color: '#F59E0B' }}>
                                    {jitter > 0 ? jitter + ' ms' : '-'}
                                </div>
                            </div>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}><ArrowDown size={14} /> DOWNLOAD</div>
                                <div className={styles.metricValue} style={{ color: '#10B981' }}>
                                    {downloadSpeed > 0 ? downloadSpeed + ' Mbps' : '-'}
                                </div>
                            </div>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}><ArrowUp size={14} /> UPLOAD</div>
                                <div className={styles.metricValue} style={{ color: '#8B5CF6' }}>
                                    {uploadSpeed > 0 ? uploadSpeed + ' Mbps' : '-'}
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className={styles.infoSection}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Internet Provider</span>
                                    <span className={styles.infoValue}><Wifi size={16} /> {isp || 'Detecting...'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>IP Address</span>
                                    <span className={styles.infoValue}><Globe size={16} /> {ipInfo || '...'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Location</span>
                                    <span className={styles.infoValue}><Server size={16} /> {location || '...'}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Client</span>
                                    <span className={styles.infoValue}><Smartphone size={16} /> Web Browser</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className={styles.startButton}
                            onClick={runTest}
                            disabled={isRunning}
                        >
                            {isRunning ? (
                                <> <RotateCw className="spin" size={20} /> Testing... </>
                            ) : (
                                <> <Play size={20} /> Mulai Test </>
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
