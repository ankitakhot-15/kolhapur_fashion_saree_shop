// import React from 'react';
// import {
//   Phone,
//   MapPin,
//   Mail,
//   ShieldCheck,
//   Truck,
//   CreditCard,
//   RefreshCw,
//   ExternalLink
// } from 'lucide-react';

// interface FooterProps {
//   onNavigate: (view: string, param?: string) => void;
// }

// export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
//   return (
//     <footer className="bg-[#292522] text-[#FAF7F0] mt-24 border-t border-[#3F3935]">
//       {/* Trust & Guarantee Banner */}
//       <div className="border-b border-[#3F3935]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div className="flex items-start gap-4">
//               <div className="w-10 h-10 rounded-full bg-[#641D32] flex items-center justify-center shrink-0 text-[#C7A66A]">
//                 <ShieldCheck className="w-5 h-5" />
//               </div>
//               <div>
//                 <h4 className="text-sm font-semibold text-white">100% Authentic Weaves</h4>
//                 <p className="text-xs text-[#E6E0D8]/70 mt-1">Direct from master weavers of Kolhapur and Paithan with handloom quality check.</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <div className="w-10 h-10 rounded-full bg-[#641D32] flex items-center justify-center shrink-0 text-[#C7A66A]">
//                 <Truck className="w-5 h-5" />
//               </div>
//               <div>
//                 <h4 className="text-sm font-semibold text-white">Insured Express Shipping</h4>
//                 <p className="text-xs text-[#E6E0D8]/70 mt-1">Tamper-proof protective packaging with Blue Dart and Delhivery tracking.</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <div className="w-10 h-10 rounded-full bg-[#641D32] flex items-center justify-center shrink-0 text-[#C7A66A]">
//                 <CreditCard className="w-5 h-5" />
//               </div>
//               <div>
//                 <h4 className="text-sm font-semibold text-white">Secure Razorpay Payments</h4>
//                 <p className="text-xs text-[#E6E0D8]/70 mt-1">256-bit encrypted UPI, Net Banking, and Credit Card checkout verification.</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <div className="w-10 h-10 rounded-full bg-[#641D32] flex items-center justify-center shrink-0 text-[#C7A66A]">
//                 <RefreshCw className="w-5 h-5" />
//               </div>
//               <div>
//                 <h4 className="text-sm font-semibold text-white">Transparent Support</h4>
//                 <p className="text-xs text-[#E6E0D8]/70 mt-1">Easy pre-shipment cancellation and verified bank refund workflows.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Footer Links */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

//           {/* Brand Info */}
//           <div className="lg:col-span-2 space-y-4">
//             <div className="flex items-center gap-2.5">
//               <div className="w-8 h-8 rounded-full bg-[#641D32] flex items-center justify-center text-[#C7A66A] font-serif font-bold text-base border border-[#C7A66A]/40">
//                 K
//               </div>
//               <span className="text-xl font-bold font-serif tracking-tight text-white">
//                 Kolhapuri Fashion Saree
//               </span>
//             </div>
//             <p className="text-xs text-[#E6E0D8]/80 leading-relaxed max-w-sm">
//               Celebrating the majestic royal textiles of Maharashtra. Every Paithani, Kanjivaram, and Banarasi saree is woven with generational devotion, pure silk, and traditional zari art.
//             </p>

//             <div className="pt-2 space-y-2 text-xs text-[#E6E0D8]/90">
//               <div className="flex items-start gap-2.5">
//                 <MapPin className="w-4 h-4 text-[#C7A66A] shrink-0 mt-0.5" />
//                 <span>Shivaji Nagar, Unchgaon, Kolhapur, Maharashtra, India.</span>
//               </div>
//               <div className="flex items-center gap-2.5">
//                 <Phone className="w-4 h-4 text-[#C7A66A] shrink-0" />
//                 <a href="tel:9096863092" className="hover:text-white transition-colors">9096863092</a>
//               </div>
//               <div className="flex items-center gap-2.5">
//                 <Mail className="w-4 h-4 text-[#C7A66A] shrink-0" />
//                 <a href="mailto:ankitakhot015@gmail.com" className="hover:text-white transition-colors">ankitakhot015@gmail.com</a>
//               </div>
//             </div>

//             {/* Social Links */}
//             <div className="flex items-center gap-3 pt-3">
//               <a
//                 href="https://wa.me/919096863092"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors border border-[#25D366]/40"
//               >
//                 <span>WhatsApp: 9096863092</span>
//                 <ExternalLink className="w-3 h-3" />
//               </a>

//               <a
//                 href="https://www.instagram.com/ankita_wavecode/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#E1306C]/20 text-[#FF758F] hover:bg-[#E1306C]/30 transition-colors border border-[#E1306C]/40"
//               >
//                 <span>@ankita_wavecode</span>
//                 <ExternalLink className="w-3 h-3" />
//               </a>
//             </div>
//           </div>

//           {/* Quick Collections */}
//           <div>
//             <h5 className="text-xs font-bold uppercase tracking-wider text-[#C7A66A] mb-4">Collections</h5>
//             <ul className="space-y-2.5 text-xs text-[#E6E0D8]/80">
//               <li>
//                 <button onClick={() => onNavigate('catalog', 'Paithani Sarees')} className="hover:text-white transition-colors">
//                   Paithani Silk Sarees
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => onNavigate('catalog', 'Wedding Sarees')} className="hover:text-white transition-colors">
//                   Bridal Silk Ensembles
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => onNavigate('catalog', 'Silk Sarees')} className="hover:text-white transition-colors">
//                   Pure Katan Silks
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => onNavigate('catalog', 'Designer Sarees')} className="hover:text-white transition-colors">
//                   Designer Festive Sarees
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => onNavigate('catalog', 'Cotton Sarees')} className="hover:text-white transition-colors">
//                   Handloom Cotton Sarees
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Customer Care */}
//           <div>
//             <h5 className="text-xs font-bold uppercase tracking-wider text-[#C7A66A] mb-4">Customer Care</h5>
//             <ul className="space-y-2.5 text-xs text-[#E6E0D8]/80">
//               <li>
//                 <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
//                   Track Your Order
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
//                   Saree Care & Storage Guide
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
//                   Blouse Piece Details
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
//                   Cancellation & Refunds
//                 </button>
//               </li>
//               <li>
//                 <a href="https://wa.me/919096863092" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
//                   Personal Saree Consultation
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Quick Links & Admin */}
//           <div>
//             <h5 className="text-xs font-bold uppercase tracking-wider text-[#C7A66A] mb-4">Store Access</h5>
//             <ul className="space-y-2.5 text-xs text-[#E6E0D8]/80">
//               <li>
//                 <button onClick={() => onNavigate('admin')} className="text-[#C7A66A] hover:underline font-semibold flex items-center gap-1">
//                   <span>Owner Admin Portal</span>
//                   <ExternalLink className="w-3 h-3" />
//                 </button>
//               </li>
//               <li>
//                 <span className="text-[#E6E0D8]/50 block">GST: 27AABCK9012M1Z8</span>
//               </li>
//               <li>
//                 <span className="text-[#E6E0D8]/50 block">Handloom Mark Certified</span>
//               </li>
//               <li>
//                 <span className="text-[#E6E0D8]/50 block">Silk Mark India Assured</span>
//               </li>
//             </ul>
//           </div>

//         </div>
//       </div>

//       {/* Copyright Bar */}
//       <div className="border-t border-[#3F3935] py-6 text-center text-xs text-[#E6E0D8]/60">
//         <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
//           <p>© 2026 Kolhapuri Fashion Saree. All rights reserved. Crafted in Kolhapur, Maharashtra.</p>
//           <div className="flex items-center gap-4 text-[11px]">
//             <span>Privacy Policy</span>
//             <span>·</span>
//             <span>Terms of Service</span>
//             <span>·</span>
//             <span>Shipping Policy</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };
import React from "react";
import {
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Truck,
  CreditCard,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { STORE } from "../config/storeInfo.ts";

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

const linkBtn = "hover:text-white transition-colors text-left";

const TRUST = [
  {
    icon: ShieldCheck,
    title: "100% Authentic Weaves",
    text: "Direct from master weavers of Kolhapur and Paithan with handloom quality check.",
  },
  {
    icon: Truck,
    title: "Safe Pan-India Shipping",
    text: "Tamper-evident packaging with DTDC Express and India Post tracking.",
  },
  {
    icon: CreditCard,
    title: "Secure Online Payments",
    text: "Encrypted UPI, Net Banking and Card payments through RBI-authorized gateways.",
  },
  {
    icon: RefreshCw,
    title: "7-Day Defect Exchange",
    text: "Replacement for verified company damage or manufacturing defects.",
  },
];

const COLLECTIONS: [string, string][] = [
  ["Paithani Sarees", "Paithani Silk Sarees"],
  ["Wedding Sarees", "Bridal Silk Ensembles"],
  ["Silk Sarees", "Pure Katan Silks"],
  ["Designer Sarees", "Designer Festive Sarees"],
  ["Cotton Sarees", "Handloom Cotton Sarees"],
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#292522] text-[#FAF7F0] mt-24 border-t border-[#3F3935]">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-[#3F3935]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#641D32] flex items-center justify-center shrink-0 text-[#C7A66A]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{title}</h4>
                  <p className="text-xs text-[#E6E0D8]/70 mt-1">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#641D32] flex items-center justify-center text-[#C7A66A] font-serif font-bold text-base border border-[#C7A66A]/40">
                K
              </div>
              <span className="text-xl font-bold font-serif tracking-tight text-white">
                {STORE.brandName}
              </span>
            </div>
            <p className="text-xs text-[#E6E0D8]/80 leading-relaxed max-w-sm">
              Celebrating the majestic royal textiles of Maharashtra. Every
              Paithani, Kanjivaram, and Banarasi saree is woven with
              generational devotion, pure silk, and traditional zari art.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#E6E0D8]/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C7A66A] shrink-0 mt-0.5" />
                <span>{STORE.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C7A66A] shrink-0" />
                <a
                  href={`tel:${STORE.phoneTel}`}
                  className="hover:text-white transition-colors"
                >
                  {STORE.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C7A66A] shrink-0" />
                <a
                  href={`mailto:${STORE.email}`}
                  className="hover:text-white transition-colors"
                >
                  {STORE.email}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={STORE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors border border-[#25D366]/40"
              >
                <span>WhatsApp: {STORE.phoneDisplay}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={STORE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#E1306C]/20 text-[#FF758F] hover:bg-[#E1306C]/30 transition-colors border border-[#E1306C]/40"
              >
                <span>@ankita_wavecode</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C7A66A] mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-[#E6E0D8]/80">
              {COLLECTIONS.map(([category, label]) => (
                <li key={category}>
                  <button
                    onClick={() => onNavigate("catalog", category)}
                    className={linkBtn}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C7A66A] mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-[#E6E0D8]/80">
              <li>
                <button
                  onClick={() => onNavigate("orders")}
                  className={linkBtn}
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("shipping")}
                  className={linkBtn}
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("exchange")}
                  className={linkBtn}
                >
                  Exchange & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("privacy")}
                  className={linkBtn}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <a
                  href={STORE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Personal Saree Consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Store Access */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C7A66A] mb-4">
              Store Access
            </h5>
            <ul className="space-y-2.5 text-xs text-[#E6E0D8]/80">
              <li>
                <button
                  onClick={() => onNavigate("admin")}
                  className="text-[#C7A66A] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Owner Admin Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <span className="text-[#E6E0D8]/50 block">
                  GST: 27AABCK9012M1Z8
                </span>
              </li>
              <li>
                <span className="text-[#E6E0D8]/50 block">
                  Handloom Mark Certified
                </span>
              </li>
              <li>
                <span className="text-[#E6E0D8]/50 block">
                  Silk Mark India Assured
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#3F3935] py-6 text-center text-xs text-[#E6E0D8]/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 {STORE.brandName}. All rights reserved. Crafted in Kolhapur,
            Maharashtra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => onNavigate("privacy")}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate("exchange")}
              className="hover:text-white transition-colors"
            >
              Exchange Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate("shipping")}
              className="hover:text-white transition-colors"
            >
              Shipping Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
