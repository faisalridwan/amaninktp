import { Poppins } from 'next/font/google'
import '@/styles/globals.css'
import Script from 'next/script'
import ConsentModal from '@/components/ConsentModal'
import JsonLd from '@/components/JsonLd'
import { ThemeProvider } from '@/context/ThemeContext'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins',
})

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
}

export const metadata = {
    metadataBase: new URL('https://amanindata.qreatip.com'),
    title: {
        template: '%s | Amanin Data',
        default: 'Amanin Data - Watermark Dokumen, Tanda Tangan Digital & Edit PDF Aman' // Fallback title
    },
    description: 'Platform privasi digital #1 di Indonesia. Edit PDF, Watermark Dokumen, Tanda Tangan Digital, Hapus Background, dan Kompres Foto secara aman. 100% diproses di browser (Client-Side) tanpa upload ke server. Gratis & Tanpa Batas.',
    keywords: 'watermark ktp, tanda tangan digital, edit pdf, hapus background, kompres pdf, kompres foto, sensor data, redact pdf, amanin data, privasi data, client-side, tanpa upload, gratis, pdf tools indonesia, keamanan data pribadi',
    authors: [{ name: 'Faisal Ridwan', url: 'https://qreatip.com' }],
    creator: 'Faisal Ridwan',
    publisher: 'Amanin Data',
    applicationName: 'Amanin Data',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    referrer: 'origin-when-cross-origin',
    // viewport moved to separate export
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: {
            template: '%s | Amanin Data',
            default: 'Amanin Data - Platform Privasi & Edit Dokumen Aman'
        },
        description: 'Edit PDF, Watermark Dokumen, dan Tanda Tangan Digital langsung di browser. Data Anda tidak pernah dikirim ke server kami. 100% Aman & Gratis.',
        url: 'https://amanindata.qreatip.com',
        siteName: 'Amanin Data',
        locale: 'id_ID',
        type: 'website',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Amanin Data Open Graph Image',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: {
            template: '%s | Amanin Data',
            default: 'Amanin Data - Edit Dokumen Aman & Privat'
        },
        description: 'Watermark Dokumen, TTD Digital, dan Edit PDF tanpa upload data. 100% Client-Side.',
        creator: '@faisalridwan', // Adjust if needed
        images: ['/images/og-image.jpg'],
    },
    icons: {
        icon: [
            { url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>', type: 'image/svg+xml' },
        ],
        shortcut: ['data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>'],
        apple: [
            { url: '/apple-touch-icon.png' }, // Ensure this exists or use text SVG fallback if needed
        ],
    },
    manifest: '/manifest.webmanifest',
    verification: {
        google: 'google-site-verification-code', // Update this with real code if available
        'google-adsense-account': 'ca-pub-9738454984006701',
    },
    alternates: {
        canonical: './', // Will resolve relative to metadataBase
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={poppins.className}>
                <ThemeProvider>
                    <Script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9738454984006701"
                        crossOrigin="anonymous"
                        strategy="afterInteractive"
                    />
                    <Script
                        src="https://www.googletagmanager.com/gtag/js?id=G-YN17XSBEMY"
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-YN17XSBEMY');
                        `}
                    </Script>
                    <JsonLd />
                    <ConsentModal />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
