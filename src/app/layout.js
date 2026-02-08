import '@/styles/globals.css'

export const metadata = {
    title: 'Watermark KTP Online & TTD Digital – Aman & Lokal',
    description: 'Buat watermark KTP dan tanda tangan online tanpa upload data ke server. Aman, gratis, dan mudah digunakan.',
    keywords: 'watermark ktp, tanda tangan online, ttd digital, watermark online, keamanan ktp',
    authors: [{ name: 'AmaninKTP' }],
    openGraph: {
        title: 'Watermark KTP Online & TTD Digital – Aman & Lokal',
        description: 'Buat watermark KTP dan tanda tangan online tanpa upload data ke server.',
        type: 'website',
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
                {children}
            </body>
        </html>
    )
}
