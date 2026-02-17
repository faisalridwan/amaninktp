'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Copy, RefreshCw, Shield, Check, Lock, Settings, History
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrustSection from '@/components/TrustSection'
import GuideSection from '@/components/GuideSection'
import styles from './page.module.css'

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('')
    const [length, setLength] = useState(16)
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    })
    const [strength, setStrength] = useState(0)
    const [copied, setCopied] = useState(false)
    const [history, setHistory] = useState([])

    const generatePassword = useCallback(() => {
        let charset = ''
        if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
        if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (options.numbers) charset += '0123456789'
        if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-='

        if (charset === '') {
            setPassword('')
            setStrength(0)
            return
        }

        let newPassword = ''
        const cryptoObj = window.crypto || window.msCrypto
        const randomValues = new Uint32Array(length)
        cryptoObj.getRandomValues(randomValues)

        for (let i = 0; i < length; i++) {
            newPassword += charset[randomValues[i] % charset.length]
        }

        setPassword(newPassword)
        calculateStrength(newPassword)
        // Add to history
        setHistory(prev => [newPassword, ...prev.slice(0, 4)])
    }, [length, options])

    useEffect(() => {
        generatePassword()
    }, [generatePassword])

    const calculateStrength = (pass) => {
        let score = 0
        if (pass.length > 8) score += 1
        if (pass.length > 12) score += 1
        if (/[A-Z]/.test(pass)) score += 1
        if (/[0-9]/.test(pass)) score += 1
        if (/[^A-Za-z0-9]/.test(pass)) score += 1
        setStrength(score)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getStrengthColor = () => {
        if (strength <= 2) return '#ef4444' // red
        if (strength <= 3) return '#eab308' // yellow
        return '#22c55e' // green
    }

    const getStrengthText = () => {
        if (strength <= 2) return 'Lemah'
        if (strength <= 3) return 'Sedang'
        return 'Kuat'
    }

    const toggleOption = (key) => {
        const newOptions = { ...options, [key]: !options[key] }
        // Prevent unchecking all options
        if (!Object.values(newOptions).some(Boolean)) return
        setOptions(newOptions)
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        🔑 Password Generator <span>Kuat</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Buat password super kuat & aman secara instan. 100% Client-side.
                    </p>
                    <div className={styles.trustBadge}>
                        <Shield size={16} /> 100% Client-Side Encryption
                    </div>
                </header>

                <div className={styles.workspace}>
                    <div className={styles.card}>
                        <div className={styles.resultContainer}>
                            <input
                                type="text"
                                className={styles.resultInput}
                                value={password}
                                readOnly
                            />
                            <button
                                className={styles.copyButton}
                                onClick={copyToClipboard}
                                title="Copy to Clipboard"
                            >
                                {copied ? <Check size={24} color="#22c55e" /> : <Copy size={24} />}
                            </button>

                            <div className={styles.strengthMeter}>
                                <div
                                    className={styles.strengthBar}
                                    style={{
                                        width: `${(strength / 5) * 100}%`,
                                        backgroundColor: getStrengthColor()
                                    }}
                                />
                            </div>
                            <div className={styles.strengthText} style={{ color: getStrengthColor() }}>
                                {getStrengthText()}
                            </div>
                        </div>

                        <div className={styles.controls}>
                            <div className={styles.controlGroup}>
                                <div className={styles.label}>
                                    <span>Panjang Karakter</span>
                                    <span className={styles.rangeValue}>{length}</span>
                                </div>
                                <div className={styles.rangeContainer}>
                                    <input
                                        type="range"
                                        min="6"
                                        max="64"
                                        value={length}
                                        onChange={(e) => setLength(parseInt(e.target.value))}
                                        className={styles.rangeSlider}
                                    />
                                </div>
                            </div>

                            <div className={styles.optionsGrid}>
                                <label className={styles.optionCard} onClick={() => toggleOption('uppercase')}>
                                    <span className={styles.optionLabel}>Huruf Besar (A-Z)</span>
                                    <input
                                        type="checkbox"
                                        checked={options.uppercase}
                                        onChange={() => toggleOption('uppercase')}
                                    />
                                </label>
                                <label className={styles.optionCard} onClick={() => toggleOption('lowercase')}>
                                    <span className={styles.optionLabel}>Huruf Kecil (a-z)</span>
                                    <input
                                        type="checkbox"
                                        checked={options.lowercase}
                                        onChange={() => toggleOption('lowercase')}
                                    />
                                </label>
                                <label className={styles.optionCard} onClick={() => toggleOption('numbers')}>
                                    <span className={styles.optionLabel}>Angka (0-9)</span>
                                    <input
                                        type="checkbox"
                                        checked={options.numbers}
                                        onChange={() => toggleOption('numbers')}
                                    />
                                </label>
                                <label className={styles.optionCard} onClick={() => toggleOption('symbols')}>
                                    <span className={styles.optionLabel}>Simbol (!@#$)</span>
                                    <input
                                        type="checkbox"
                                        checked={options.symbols}
                                        onChange={() => toggleOption('symbols')}
                                    />
                                </label>
                            </div>

                            <button className={styles.generateBtn} onClick={generatePassword}>
                                <RefreshCw size={20} /> Generate Password Baru
                            </button>
                        </div>
                    </div>

                    {history.length > 1 && (
                        <div style={{ marginTop: '40px' }}>
                            <h3 className={styles.label} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <History size={16} /> Riwayat Terakhir
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {history.slice(1).map((pass, index) => (
                                    <div key={index} className={styles.optionCard} style={{ cursor: 'default' }}>
                                        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{pass}</span>
                                        <button
                                            className={styles.copyButton}
                                            style={{ position: 'static', padding: '4px' }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(pass);
                                                // We could add a local copied state for history items if we wanted
                                            }}
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <TrustSection />
                    <GuideSection toolId="password-generator" />
                </div>
            </main>
            <Footer />
        </>
    )
}
