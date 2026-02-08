import '@/styles/globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata = {
    title: 'Watermark KTP Online & TTD Digital – Aman & Lokal | AmaninKTP',
    description: 'Buat watermark KTP dan tanda tangan online tanpa upload data ke server. Aman, gratis, dan mudah digunakan.',
    keywords: 'watermark ktp, tanda tangan online, ttd digital, watermark online, keamanan ktp, amanin ktp',
    authors: [{ name: 'AmaninKTP' }],
    metadataBase: new URL('https://amaninktp.qreatip.com'),
    openGraph: {
        title: 'Watermark KTP Online & TTD Digital – Aman & Lokal',
        description: 'Buat watermark KTP dan tanda tangan online tanpa upload data ke server.',
        type: 'website',
        url: 'https://amaninktp.qreatip.com',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <GoogleAnalytics />
                {children}
            </body>
        </html>
    )
}
