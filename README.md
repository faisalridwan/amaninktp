# AmaninKTP 📄 — Secure & Local KTP Watermarking & Digital Signature

**AmaninKTP** is a free, secure, and open-source web-based tool that allows you to protect your sensitive documents (ID Cards/KTP, Driver's License, Passport, etc.) by adding custom watermarks and precise digital signatures.

> [!IMPORTANT]  
> **Official Website:** [https://amanindata.qreatip.com/](https://amanindata.qreatip.com/)

Every document manipulation process is performed **100% locally in your browser**. Your data and documents are never sent to our servers, ensuring absolute confidentiality of your personal information.

---

[![Main Website](https://img.shields.io/badge/Main%20Website-amanindata.qreatip.com-4CAF50?style=for-the-badge&logo=google-chrome&logoColor=white)](https://amanindata.qreatip.com/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 Why AmaninKTP? (Problem Statement)

In today's digital age, identity theft and the misuse of personal data through scans of ID cards (KTP) or other important documents are increasingly common in Indonesia. Raw documents are often misappropriated for illegal online loan registrations or other fraudulent activities.

**AmaninKTP** serves as a practical solution to:
1.  **Provide Context**: Add specific watermark text such as *"For E-wallet Verification Only - 08/02/2026"* so the document cannot be used for unintended purposes.
2.  **Legality & Personalization**: Attach digital signatures directly to PDF documents quickly and easily.
3.  **Uncompromising Security**: Eliminate concerns about document "leaks" during editing, as your browser is the only place the document exists.

---

## ✨ Key Features (Deep Dive)

### 🛡️ Smart Watermarking
*   **Tiled Mode**: Automatically covers the entire document area with repeating watermark text.
*   **Single Mode (Manual)**: Specifically place one or more watermarks in designated areas.
*   **Full Customization**: Adjust font size, text color, opacity levels, rotation, and line spacing.

### ✍️ Digital Signature (TTD)
*   **Responsive Drawing Pad**: Create smooth signatures using a mouse, trackpad, or touch screen.
*   **Local Signature Library**: Save your favorite signatures in the browser (localStorage) for future use without redraws.
*   **Drag-and-Drop Placement**: Pixel-perfect precision for positioning signatures on PDF files.

### 🔄 Efficient Workflow
*   **Insta-Reset**: Revert all changes to default with a single click if a mistake occurs.
*   **Real-Time Preview**: See every change you make instantly before saving the document.
*   **Multi-Export**: Save the final result in high-quality **PNG** format or secure **PDF**.

---

## � Privacy & Security Architecture

AmaninKTP is built on the principle of **Privacy by Design**:

1.  **Zero Server Upload**: We do not have a backend that stores files. When you select a file, the browser only reads the data locally into the application's memory.
2.  **Client-Side Rendering**: `jsPDF` and `pdfjs-dist` libraries are used to manipulate images and text directly on your device's CPU.
3.  **Ephemeral Storage**: The original document and edited results are immediately cleared from the browser's memory when the tab or browser is closed.
4.  **No Tracking**: We do not use trackers that inspect your document's content.

---

## 🛠️ Tech Stack & Dependencies

The project utilizes modern web technologies for high performance and security:

*   **Next.js 15**: The latest React framework for fast and SEO-friendly application performance.
*   **React 19**: A component-based UI library for interactive interfaces.
*   **Lucide React**: A consistent and elegant collection of open-source icons.
*   **jsPDF**: The primary engine for generating and manipulating PDF documents on the client side.
*   **PDF.js**: Used for high-performance rendering of PDF files into the browser canvas.
*   **Vanilla CSS (CSS Modules)**: A calming **Neumorphic** design without heavy CSS library dependencies.

---

## � Local Development Guide

Want to run AmaninKTP on your own computer or contribute?

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (Recommended v18 or higher)
*   `npm` or `yarn`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/faisalridwan/amaninktp.git

# Enter the directory
cd amaninktp

# Install dependencies
npm install
```

### 3. NPM Commands
*   `npm run dev`: Starts the development server at `http://localhost:3000`.
*   `npm run build`: Creates an optimized production build.
*   `npm run start`: Runs the production-built application.
*   `npm run lint`: Checks code quality with ESLint.

---

## 📜 Changelog

Want to know about the latest updates? Visit our changelog page directly in the application:
[**Changelog - AmaninKTP**](https://amanindata.qreatip.com/changelog)

---

## 💖 Contributing & Support

We are very open to contributions! Please create an **Issue** to report bugs or a **Pull Request** to add new features.

If you find this tool helpful, help us keep the server (hosting) and development running by making a donation:
👉 [**Support AmaninKTP via Donation**](https://amanindata.qreatip.com/donate)

---

<p align="center">
  Made with ❤️ by <a href="https://qreatip.com">Faisal Ridwan</a> & the Qreatip Studio Team.
</p>
