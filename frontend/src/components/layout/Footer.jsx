import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4">CILIADE</h3>
            <p className="text-gray-400 text-sm mb-6">
              Custom Tailoring. Premium Ready-to-Wear. Crafted for You.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/16zhCsr63t/?mibextid=wwXIfr"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/ciliade5?igsh=bnlkMDd6bTRqN3Rr&utm_source=qr"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/AdebisiAze41330?t=bs7nM-oJJDRtEa7ZmyXSpQ&s=09"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@ciliadeglobalservice"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/custom-tailoring"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Custom Tailoring
                </Link>
              </li>
              <li>
                <Link
                  href="/ready-to-wear"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Ready-to-Wear
                </Link>
              </li>
              <li>
                <Link
                  href="/lookbook"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Lookbook
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/measurements"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Measurements Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  {" "}
                  No 57 kajola road obawole, ifako-Ijaiye ogba, Lagos,300001,
                  Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+234 (0) 9066165373</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@ciliade.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Ciliade Tailoring Company. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
