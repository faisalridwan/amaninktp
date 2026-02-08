# AmaninKTP 📄

Protect your identity documents with local, private watermarking and digital signatures. 100% browser-based.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

**AmaninKTP** (SecureThyIdentity) is a privacy-first web application designed to help users protect their sensitive documents (KTP, SIM, Passports, etc.) by adding custom watermarks and digital signatures. 

Unlike traditional tools, **AmaninKTP processes everything locally in your browser**. No images are ever uploaded to any server. Your data stays on your device.

## ✨ Key Features

- **🛡️ Secure Watermarking**: Add professional, non-removable watermarks to your ID photos.
  - **Tiled Mode**: Fill the whole image for maximum protection.
  - **Single Text Mode**: Place, rotate, and resize a specific watermark anywhere.
  - **Auto-Verification**: One-click add "Verification [Date]" text.
- **✍️ Digital Signatures**: Create and manage signatures for PDF documents or images.
  - **Canvas Drawing**: Draw smooth signatures with your mouse or trackpad.
  - **Drag-to-Select**: Define exact areas on documents to place your signature.
  - **Signature Library**: Save multiple signatures for reuse (stored locally).
- **📂 Multi-Format Support**: Works with JPG, PNG, and multi-page PDF documents.
- **🚀 Ultra Fast & Private**: No latency from server uploads. 100% client-side processing.

## 🔒 Security & Privacy (The Core Promise)

We believe your documents should never leave your sight.
- **No Server Processing**: Every image manipulation, PDF generation, and drawing happens strictly in the browser memory.
- **No Tracking of Documents**: We don't see your KTP. We don't see your signatures.
- **Local Storage**: Your preferences and saved signatures are stored in your browser's `localStorage` only.
- **Open Source Philosophy**: Transparent logic using industry-standard libraries like `jsPDF` and `React`.

## 🛠️ Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS Modules (Neumorphic & Modern Design)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document Logic**: `jsPDF` for PDF generation, Canvas API for image manipulation.
- **Deployment**: Optimized for Cloudflare Pages / Static Hosting.

## 🚀 Getting Started

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/faisalridwan/amaninktp.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Faisal Ridwan](https://qreatip.com)
