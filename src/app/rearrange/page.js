'use client'

import dynamic from 'next/dynamic'

const RearrangeClient = dynamic(() => import('./RearrangeClient'), {
    ssr: false,
    loading: () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
            <div className="spinner"></div>
            <p style={{ marginLeft: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Loading Rearrange PDF...</p>
            <style jsx>{`
                .spinner {
                    width: 30px;
                    height: 30px;
                    border: 4px solid var(--border-color);
                    border-top-color: var(--primary-dark);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    )
})

export default function Page() {
    return <RearrangeClient />
}
