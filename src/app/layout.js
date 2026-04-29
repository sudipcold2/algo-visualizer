import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | AlgoVisual",
    default: "AlgoVisual - Interactive Algorithm Learning",
  },
  description: "Learn algorithms and data structures through stunning, interactive visualizations and line-by-line dry run debugging.",
  keywords: ["algorithms", "data structures", "visualizer", "leetcode", "dry run", "coding interview", "education"],
  authors: [{ name: "Sudip Ghosh" }],
  creator: "Sudip Ghosh",
  openGraph: {
    title: "AlgoVisual - Interactive Algorithm Learning",
    description: "Learn algorithms and data structures through stunning, interactive visualizations.",
    url: "https://algo-visualizer.vercel.app", // Adjust if domain changes
    siteName: "AlgoVisual",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoVisual - Interactive Algorithm Learning",
    description: "Learn algorithms and data structures through stunning, interactive visualizations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-foreground selection:bg-primary-500/30`}>
        <div className="flex flex-col min-h-screen">
          {/* Stunning Navbar */}
          <header className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
                  AV
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  AlgoVisual
                </h1>
              </div>
              <nav className="flex gap-6 text-sm font-medium text-white/70">
                <a href="/" className="hover:text-white transition-colors">Problems</a>
                <a href="#" className="hover:text-white transition-colors">Learning Paths</a>
              </nav>
            </div>
          </header>

          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
