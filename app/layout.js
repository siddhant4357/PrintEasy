import "./globals.css";

export const metadata = {
  title: "PrintEasy — Print Configuration",
  description:
    "Configure print settings for multiple documents. Set copies, sides, and per-file overrides with real-time duplex validation.",
  keywords: ["PrintEasy", "print configuration", "document printing"],
  authors: [{ name: "PrintEasy" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
