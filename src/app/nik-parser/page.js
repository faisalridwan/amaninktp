'use client'

import { useState } from 'react'
import { Search, Shield, Info, MapPin, Calendar, User, Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GuideSection from '@/components/GuideSection'
import TrustSection from '@/components/TrustSection'
import styles from './page.module.css'

export default function NikParserPage() {
    const [nik, setNik] = useState('')
    const [parseResult, setParseResult] = useState(null)
    const [error, setError] = useState(null)

    // Province Codes Mapping
    const provinces = {
        '11': 'Aceh', '12': 'Sumatera Utara', '13': 'Sumatera Barat', '14': 'Riau',
        '15': 'Jambi', '16': 'Sumatera Selatan', '17': 'Bengkulu', '18': 'Lampung',
        '19': 'Kep. Bangka Belitung', '21': 'Kepulauan Riau',
        '31': 'DKI Jakarta', '32': 'Jawa Barat', '33': 'Jawa Tengah', '34': 'DI Yogyakarta',
        '35': 'Jawa Timur', '36': 'Banten',
        '51': 'Bali', '52': 'Nusa Tenggara Barat', '53': 'Nusa Tenggara Timur',
        '61': 'Kalimantan Barat', '62': 'Kalimantan Tengah', '63': 'Kalimantan Selatan',
        '64': 'Kalimantan Timur', '65': 'Kalimantan Utara',
        '71': 'Sulawesi Utara', '72': 'Sulawesi Tengah', '73': 'Sulawesi Selatan',
        '74': 'Sulawesi Tenggara', '75': 'Gorontalo', '76': 'Sulawesi Barat',
        '81': 'Maluku', '82': 'Maluku Utara',
        '91': 'Papua Barat', '92': 'Papua Barat Daya', '94': 'Papua', '95': 'Papua Tengah', '96': 'Papua Pegunungan', '97': 'Papua Selatan' // Updated Papua codes if available, keeping basics
    }

    const handleNikChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 16)
        setNik(val)
        if (val.length < 16) setParseResult(null)
        setError(null)
    }

    const parseNik = () => {
        if (nik.length !== 16) {
            setError('NIK harus 16 digit angka.')
            return
        }

        const provCode = nik.substring(0, 2)
        const cityCode = nik.substring(2, 4)
        const distCode = nik.substring(4, 6)
        const dateCode = parseInt(nik.substring(6, 8))
        const monthCode = parseInt(nik.substring(8, 10))
        const yearCode = parseInt(nik.substring(10, 12))
        const seqCode = nik.substring(12, 16)

        // Validate Province
        const province = provinces[provCode] || 'Tidak Diketahui'

        // Gender & Day
        let gender = 'Laki-laki'
        let day = dateCode
        if (dateCode > 40) {
            gender = 'Perempuan'
            day = dateCode - 40
        }

        // Year (Simple logic: if yearCode + 2000 > currentYear, assume 19xx)
        const currentYearShort = new Date().getFullYear() % 100
        const fullYear = yearCode + (yearCode > currentYearShort ? 1900 : 2000)

        // Validate Date
        const birthDateObj = new Date(fullYear, monthCode - 1, day)
        const isValidDate = birthDateObj.getDate() === day && (birthDateObj.getMonth() + 1) === monthCode

        if (!isValidDate) {
            setError('Format tanggal lahir dalam NIK tidak valid.')
            return
        }

        // Age
        const today = new Date()
        let age = today.getFullYear() - fullYear
        const m = today.getMonth() - (monthCode - 1)
        if (m < 0 || (m === 0 && today.getDate() < day)) {
            age--
        }

        // Zodiac (Horoscope) - Optional fun feature
        const getZodiac = (day, month) => {
            const zodiacs = [
                { char: '♑ Capricorn', start: '01-01', end: '01-19' },
                { char: '♒ Aquarius', start: '01-20', end: '02-18' },
                { char: '♓ Pisces', start: '02-19', end: '03-20' },
                { char: '♈ Aries', start: '03-21', end: '04-19' },
                { char: '♉ Taurus', start: '04-20', end: '05-20' },
                { char: '♊ Gemini', start: '05-21', end: '06-20' },
                { char: '♋ Cancer', start: '06-21', end: '07-22' },
                { char: '♌ Leo', start: '07-23', end: '08-22' },
                { char: '♍ Virgo', start: '08-23', end: '09-22' },
                { char: '♎ Libra', start: '09-23', end: '10-22' },
                { char: '♏ Scorpio', start: '10-23', end: '11-21' },
                { char: '♐ Sagitarius', start: '11-22', end: '12-21' },
                { char: '♑ Capricorn', start: '12-22', end: '12-31' },
            ]
            // Simple string compare MM-DD
            const d = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            return zodiacs.find(z => d >= z.start && d <= z.end)?.char || ''
        }
        const zodiac = getZodiac(day, monthCode)

        // Formatting Date
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const dateStr = `${day} ${months[monthCode - 1]} ${fullYear}`

        setParseResult({
            province,
            regencyCode: `${provCode}.${cityCode}`,
            districtCode: `${provCode}.${cityCode}.${distCode}`,
            gender,
            birthDate: dateStr,
            age,
            zodiac,
            sequence: seqCode
        })
        setError(null)
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <div className={styles.hero}>
                    <h1 className={styles.heroTitle}>🆔 Cek & Parse <span>NIK</span></h1>
                    <p className={styles.heroSubtitle}>Cek daerah, tanggal lahir, dan usia dari NIK KTP Anda. Detail & Akurat.</p>

                </div>

                <div className={styles.workspace}>
                    <div className={styles.inputSection}>
                        <div className={styles.inputLabel}>
                            <span>Masukkan 16 Digit NIK</span>
                            <span className={styles.badge}>🔒 Offline Check</span>
                        </div>
                        <div className={styles.inputWrapper}>
                            <Search className={styles.inputIcon} size={20} />
                            <input
                                type="text"
                                className={styles.input}
                                value={nik}
                                onChange={handleNikChange}
                                placeholder="3204xxxxxxxxxxxx"
                                maxLength={16}
                            />
                            {nik && (
                                <button className={styles.clearBtn} onClick={() => { setNik(''); setParseResult(null); }}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        {error && (
                            <div className={styles.errorMsg}>
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}
                        <button
                            className={styles.btnCheck}
                            onClick={parseNik}
                            disabled={!nik || nik.length < 16}
                        >
                            Cek NIK Sekarang
                        </button>
                    </div>

                    {parseResult && (
                        <div className={styles.resultCard}>
                            <div className={styles.resultHeader}>
                                <div className={styles.validIcon}>
                                    <CheckCircle size={24} />
                                </div>
                                <div className={styles.resultTitle}>
                                    <h3>Struktur NIK Valid</h3>
                                    <p>Informasi berhasil diterjemahkan</p>
                                </div>
                            </div>

                            <div className={styles.dataGrid}>
                                <div className={styles.dataItem}>
                                    <span className={styles.label}><MapPin size={12} /> Provinsi</span>
                                    <span className={`${styles.value} ${styles.highlight}`}>{parseResult.province}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#999' }}>Kode: {nik.substring(0, 2)}</span>
                                </div>

                                <div className={styles.dataItem}>
                                    <span className={styles.label}><User size={12} /> Jenis Kelamin</span>
                                    <span className={styles.value}>{parseResult.gender}</span>
                                </div>

                                <div className={styles.dataItem}>
                                    <span className={styles.label}><Calendar size={12} /> Tanggal Lahir</span>
                                    <span className={styles.value}>{parseResult.birthDate}</span>
                                </div>

                                <div className={styles.dataItem}>
                                    <span className={styles.label}><Clock size={12} /> Usia Saat Ini</span>
                                    <span className={styles.value}>{parseResult.age} Tahun</span>
                                    {parseResult.zodiac && <span style={{ fontSize: '0.8rem', color: '#888' }}>{parseResult.zodiac}</span>}
                                </div>

                                <div className={styles.dataItem}>
                                    <span className={styles.label}><Info size={12} /> Nomor Urut</span>
                                    <span className={styles.value}>#{parseResult.sequence}</span>
                                </div>
                            </div>

                            <div className={styles.privacyNote}>
                                <Shield size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                Catatan: Data ini hasil parsing logika standar NIK. Kami tidak terhubung ke database Dukcapil.
                            </div>
                        </div>
                    )}


                </div>
                <TrustSection />

                {/* Cara Pakai / How To Use */}
                <GuideSection
                    linkHref="/guide#nik-parser"
                    btnColor="green"
                />
            </main>
            <Footer />
        </>
    )
}
