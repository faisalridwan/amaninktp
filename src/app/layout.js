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

export const metadata = {
    title: 'Watermark Dokumen Online & TTD Digital – Aman & Lokal | Amanin Data',
    description: 'Lindungi dokumen Anda dengan Watermark KTP, Tanda Tangan Digital, Hapus Background, dan Kompres Foto online gratis. Diproses 100% di browser (Client-Side), tanpa upload data ke server. Aman dan terpercaya.',
    keywords: 'watermark ktp, watermark online, tanda tangan online, ttd digital, hapus background, remove bg, kompres foto, cek nik, pdf editor, client-side, next.js 16, amanin data, qreatip',
    authors: [{ name: 'Faisal Ridwan', url: 'https://qreatip.com' }],
    creator: 'Faisal Ridwan',
    publisher: 'Amanin Data',
    metadataBase: new URL('https://amanindata.qreatip.com'),

    openGraph: {
        title: 'Watermark Dokumen Online & TTD Digital – Aman & Lokal',
        description: 'Cara aman buat Watermark Dokumen dan tanda tangan digital langsung di browser tanpa upload data.',
        type: 'website',
        url: 'https://amanindata.qreatip.com',
        siteName: 'Amanin Data',
        locale: 'id_ID',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Amanin Data Preview',
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>',
    },
    verification: {
        google: 'google-site-verification-code',
        'google-adsense-account': 'ca-pub-9738454984006701',
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
