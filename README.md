# AmaninKTP 📄

**AmaninKTP** is a free, secure, and open-source web-based tool that allows you to protect your sensitive documents (KTP, SIM, Passport, etc.) by adding custom watermarks and digital signatures. Every process is done 100% locally in your browser, ensuring your data never leaves your device.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub forks](https://img.shields.io/github/forks/faisalridwan/amaninktp?style=social)](https://github.com/faisalridwan/amaninktp/network)
[![GitHub stars](https://img.shields.io/github/stars/faisalridwan/amaninktp?style=social)](https://github.com/faisalridwan/amaninktp/stargazers)

## 🌟 Overview

**AmaninKTP** is designed to address the growing concern of identity theft and personal data misuse in Indonesia. By allowing users to add a specific watermark (e.g., "Verification for E-wallet, 10-10-2026") or a digital signature directly to their document scans, it renders the documents unusable for unintended purposes. 

Unlike traditional cloud-based tools, **AmaninKTP processes all images locally**. This means your private files are never uploaded to our servers, providing absolute privacy and security.

## 📖 Usage

To learn how to use AmaninKTP effectively, please visit our guide:
[**Cara Pakai - AmaninKTP**](https://amaninktp.com/guide)

## 🛠️ Technical Stack & Dependencies

AmaninKTP is built with modern web technologies to ensure speed, security, and reliability:

- **[Node.js](https://nodejs.org/)**: JavaScript runtime for development and pooling.
- **[Next.js 15](https://nextjs.org/)**: React framework for the core application logic and SEO.
- **[Vanilla CSS & CSS Modules](https://developer.mozilla.org/en-US/docs/Web/CSS)**: For a lightweight, premium, and responsive Neumorphic UI.
- **[jsPDF](https://github.com/parallax/jsPDF)**: Library for generating secure PDF documents with signatures.
- **[PDF.js](https://mozilla.github.io/pdf.js/)**: Used for high-performance PDF rendering directly in the browser.
- **[Lucide React](https://lucide.dev/)**: For clean and consistent visual iconography.

## 🚀 Installation & Local Setup

To run AmaninKTP on your local machine, follow these steps:

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/faisalridwan/amaninktp.git
   ```
3. **Navigate to Directory**:
   ```bash
   cd amaninktp
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Run Development Server**:
   ```bash
   npm run dev
   ```
6. **Build for Production**:
   ```bash
   npm run build
   ```
7. **Production Preview**:
   ```bash
   npm run start
   ```

AmaninKTP will be accessible at `http://localhost:3000`.

## ✨ Key Features

- **🛡️ Multi-Mode Watermarking**: 
  - **Tiled Watermark**: Repeat watermark text across the entire document.
  - **Single Placements**: Position, rotate, and resize watermarks manually.
- **✍️ Digital Signatures**:
  - **Drawing Pad**: Create smooth signatures using a mouse, trackpad, or touch.
  - **Signature Library**: Save and manage multiple signatures (stored locally).
  - **Precise Placement**: Drag and drop signatures onto specific areas of your PDF.
- **🎨 Customization**: Full control over font size, color, opacity, rotation, and line spacing.
- **🔄 Instant Reset**: Revert all changes to default with a single click.
- **� Smart Drag-and-Drop**: Load your ID card scans or PDFs by simply dragging them into the tool.
- **💾 High-Quality Download**: Export your watermarked documents as clean PNG images or secure PDFs.
- **📱 Ultra Responsive**: Works flawlessly on mobile, tablet, and desktop devices.

## 🔒 Privacy Policy

Your privacy is our absolute priority. AmaninKTP adheres to the following principles:

1. **100% Client-Side**: Every image manipulation, text rendering, and PDF generation happens strictly within your browser's memory.
2. **No Data Upload**: We **NEVER** upload, sell, or store your documents. Your files are processed locally and discarded immediately when you close the tab.
3. **No Tracking**: We do not use intrusive tracking or analytics on your documents.
4. **Transparency**: As an open-source project, our security logic is fully auditable by the community.

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing a bug, adding a feature, or improving documentation, please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## 🌍 Translations

AmaninKTP supports Indonesian and English. We are looking for contributors to help translate the tool into other regional or international languages.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

## 💖 Donations

If you find AmaninKTP useful and would like to support its development and maintenance, you can show your appreciation by making a donation. Every contribution helps us keep the tool free and secure for everyone.

[**Support via Donation**](https://amaninktp.qreatip.com/#donate)

---

<p align="center">
  <a href="https://github.com/faisalridwan/amaninktp">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?logo=github&style=for-the-badge" alt="GitHub Repository">
  </a>
</p>

<p align="center">
  Made with ❤️ by <a href="https://qreatip.com">Faisal Ridwan</a>
</p>
