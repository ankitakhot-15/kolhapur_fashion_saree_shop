
import React, { useState } from "react";
import { X, Mail, Check, Copy, ShieldAlert, Sparkles } from "lucide-react";
import {
  DispatchedEmail,
  OTP_VALIDITY_MINUTES,
} from "../services/storeService.ts";

interface EmailInboxPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: DispatchedEmail | null;
  onAutoFillOtp: (otp: string) => void;
}

export const EmailInboxPreviewModal: React.FC<EmailInboxPreviewModalProps> = ({
  isOpen,
  onClose,
  emailData,
  onAutoFillOtp,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !emailData) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(emailData.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFill = () => {
    onAutoFillOtp(emailData.otp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#E6E0D8] flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Email Client Window Header */}
        <div className="bg-[#292522] text-[#FAF7F0] px-5 py-3.5 flex items-center justify-between border-b border-[#3F3935]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#C7A66A]" />
            <span className="text-xs font-semibold tracking-wide font-sans">
              Email Dispatch Viewer (dev only) · {emailData.to}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:text-[#C7A66A] rounded transition-colors"
            aria-label="Close email preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Metadata Header */}
        <div className="p-4 sm:p-5 bg-[#FAF7F0] border-b border-[#E6E0D8] text-xs space-y-1.5">
          <div className="flex justify-between items-start">
            <h2 className="text-sm font-bold text-[#292522] font-serif">
              {emailData.subject}
            </h2>
            <span className="text-[11px] text-[#766B61] tabular-nums shrink-0 ml-2">
              Just now
            </span>
          </div>
          <div className="text-[11px] text-[#766B61] space-y-0.5">
            <div>
              <strong className="text-[#292522]">From:</strong> {emailData.from}
            </div>
            <div>
              <strong className="text-[#292522]">To:</strong> {emailData.to}
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
          {/* Brand Header */}
          <div className="text-center pb-4 border-b border-[#E6E0D8] space-y-1">
            <div className="w-10 h-10 rounded-full bg-[#641D32] text-[#C7A66A] font-serif font-bold text-lg flex items-center justify-center mx-auto border border-[#C7A66A]/40">
              K
            </div>
            <h3 className="text-lg font-serif font-bold text-[#641D32]">
              Kolhapuri Fashion Saree
            </h3>
            <p className="text-[11px] tracking-widest uppercase text-[#766B61]">
              Authentic Handloom Heritage · Kolhapur
            </p>
          </div>

          <div className="space-y-3 text-xs text-[#292522] leading-relaxed">
            <p>Namaste,</p>
            <p>
              Thank you for visiting Kolhapuri Fashion Saree. Use the following
              single-use 6-digit code to complete your verification and securely
              place your order:
            </p>

            {/* OTP Display Box */}
            <div className="my-6 p-6 bg-[#FAF7F0] border-2 border-dashed border-[#C7A66A] rounded-xl text-center space-y-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#766B61] block">
                Your 6-Digit Verification Code
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.25em] text-[#641D32]">
                {emailData.otp}
              </div>
              <p className="text-[11px] text-[#766B61]">
                (This code expires in {OTP_VALIDITY_MINUTES} minutes · One-time
                use only)
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[11px] text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                For security reasons, never share this OTP with anyone. Our
                weavers and store representatives will never ask for your
                verification code.
              </span>
            </div>
          </div>

          {/* Saree Boutique Footer */}
          <div className="pt-4 border-t border-[#E6E0D8] text-[11px] text-[#766B61] text-center space-y-1">
            <p className="font-semibold text-[#292522]">
              Kolhapuri Fashion Saree
            </p>
            <p>Shivaji Nagar, Unchgaon, Kolhapur, Maharashtra, India</p>
            <p>WhatsApp & Phone: 9096863092</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E6E0D8] flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-white hover:bg-[#FAF7F0] border border-[#E6E0D8] text-xs font-semibold text-[#292522] rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy 6-Digit Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleFill}
            className="px-5 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
            <span>Auto-Fill Code & Verify</span>
          </button>
        </div>
      </div>
    </div>
  );
};
