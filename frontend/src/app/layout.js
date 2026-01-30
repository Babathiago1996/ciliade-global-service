import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ToastProvider } from "@/components/ui/use-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Ciliade Global Service| Luxury Bespoke Tailoring",
  description: "Custom Tailoring. Premium Ready-to-Wear. Crafted for You.",
   icons: {
    icon: "/ciliade-favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
