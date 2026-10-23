import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck, ArrowRight, KeyRound, CheckCircle2, RotateCcw } from 'lucide-react';
import { storeService, DispatchedEmail } from '../services/storeService.ts';
import { EmailInboxPreviewModal } from './EmailInboxPreviewModal.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [lastEmail, setLastEmail] = useState<DispatchedEmail | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = storeService.requestOTP(email);
      setChallengeId(res.challengeId);
      setOtpSent(true);
      setIsLoading(false);
      setResendCooldown(30);
      setLastEmail(storeService.getLastDispatchedEmail(email));
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.length < 6) {
      setErrorMsg('Please enter the 6-digit code received on your email.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = storeService.verifyOTP(challengeId, otpInput);
      setIsLoading(false);

      if (res.success && res.session) {
        storeService.setSession(res.session);
        onSuccess(res.session.email);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleOwnerQuickLogin = () => {
    const session = {
      email: 'ankitakhot015@gmail.com',
      fullName: 'Ankita Khot (Owner)',
      phone: '9096863092',
      role: 'admin' as const,
      token: 'adm_kfs_' + Date.now()
    };
    storeService.setSession(session);
    onSuccess(session.email);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div 
          className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-[#E6E0D8] p-6 sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#766B61] hover:text-[#292522] rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F0] border border-[#E6E0D8] flex items-center justify-center mx-auto text-[#641D32]">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#292522]">
              Sign In with Email OTP
            </h2>
            <p className="text-xs text-[#766B61]">
              Enter your email address to receive a secure 6-digit verification code.
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#292522] block mb-1">
                  Your Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
                    autoFocus
                  />
                  <Mail className="w-4 h-4 text-[#766B61] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Code...' : 'Send 6-Digit OTP to Email'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Notification without showing the OTP directly */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>OTP Sent to {email}</span>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  We've sent a 6-digit verification code to your email address. Please check your inbox (and spam folder) to enter the code below.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#292522]">
                    Enter 6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLastEmail(storeService.getLastDispatchedEmail(email));
                      setIsInboxModalOpen(true);
                    }}
                    className="text-[11px] text-[#641D32] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Check Dispatched Email</span>
                  </button>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full text-center tracking-widest text-xl font-mono px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
                  autoFocus
                />
              </div>

              {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 py-2 border border-[#E6E0D8] text-xs font-medium rounded-md hover:bg-[#FAF7F0]"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-xs transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code & Sign In'}
                </button>
              </div>

              {/* Resend Cooldown */}
              <div className="text-center pt-1">
                {resendCooldown > 0 ? (
                  <span className="text-[11px] text-[#766B61]">
                    Resend code in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-[11px] text-[#641D32] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend Code to Email</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Quick Owner Switch for Testing / Evaluation */}
          <div className="mt-6 pt-4 border-t border-[#E6E0D8] text-center">
            <button
              onClick={handleOwnerQuickLogin}
              className="text-[11px] text-[#641D32] hover:underline font-semibold inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sign In as Store Owner (Ankita Khot)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dispatched Email Viewer Modal */}
      <EmailInboxPreviewModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        emailData={lastEmail}
        onAutoFillOtp={(code) => setOtpInput(code)}
      />
    </>
  );
};
