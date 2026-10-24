// import React, { useState } from 'react';
// import {
//   X,
//   Check,
//   ShieldCheck,
//   CreditCard,
//   Truck,
//   ArrowRight,
//   Lock,
//   Sparkles,
//   CheckCircle2,
//   Mail,
//   RotateCcw
// } from 'lucide-react';
// import { DeliveryAddress, Order } from '../types/index.ts';
// import { storeService, DispatchedEmail } from '../services/storeService.ts';
// import { formatPriceINR } from '../utils/formatters.ts';
// import { EmailInboxPreviewModal } from './EmailInboxPreviewModal.tsx';

// interface CheckoutModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   couponCodeApplied?: string;
//   onOrderSuccess: (order: Order) => void;
// }

// export const CheckoutModal: React.FC<CheckoutModalProps> = ({
//   isOpen,
//   onClose,
//   couponCodeApplied,
//   onOrderSuccess
// }) => {
//   const session = storeService.getSession();
//   const cart = storeService.getCart();
//   const savedAddresses = storeService.getAddresses();

//   const [step, setStep] = useState<1 | 2 | 3 | 4>(session ? 2 : 1);
//   const [email, setEmail] = useState(session?.email || '');
//   const [customerName, setCustomerName] = useState(session?.fullName || 'Pooja Kulkarni');
//   const [mobileNumber, setMobileNumber] = useState('9096863092');

//   // OTP flow for email verification
//   const [challengeId, setChallengeId] = useState('');
//   const [otpInput, setOtpInput] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpError, setOtpError] = useState('');
//   const [resendCooldown, setResendCooldown] = useState(0);
//   const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
//   const [lastEmail, setLastEmail] = useState<DispatchedEmail | null>(null);

//   React.useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (resendCooldown > 0) {
//       timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCooldown]);

//   // Address
//   const [address, setAddress] = useState<DeliveryAddress>(
//     savedAddresses[0] || {
//       id: `addr-${Date.now()}`,
//       fullName: customerName,
//       mobileNumber: mobileNumber,
//       email: email,
//       addressLine1: 'Shivaji Nagar, Unchgaon',
//       addressLine2: '',
//       landmark: 'Near Mahalaxmi Temple road',
//       city: 'Kolhapur',
//       state: 'Maharashtra',
//       pinCode: '416005',
//       country: 'India',
//       isDefault: true
//     }
//   );

//   // Razorpay payment simulation state
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

//   if (!isOpen) return null;

//   // Quote calculation
//   const quote = storeService.calculateQuote({
//     items: cart.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
//     couponCode: couponCodeApplied
//   });

//   const handleSendOtp = () => {
//     if (!email || !email.includes('@')) {
//       setOtpError('Please enter a valid email address.');
//       return;
//     }
//     const res = storeService.requestOTP(email);
//     setChallengeId(res.challengeId);
//     setOtpSent(true);
//     setOtpError('');
//     setResendCooldown(30);
//     setLastEmail(storeService.getLastDispatchedEmail(email));
//   };

//   const handleVerifyOtp = () => {
//     if (!otpInput || otpInput.length < 6) {
//       setOtpError('Please enter the 6-digit verification code.');
//       return;
//     }
//     const res = storeService.verifyOTP(challengeId, otpInput);
//     if (res.success && res.session) {
//       storeService.setSession(res.session);
//       setStep(2);
//     } else {
//       setOtpError(res.message);
//     }
//   };

//   const handleProceedToPayment = () => {
//     // Validate address
//     if (!address.fullName || !address.addressLine1 || !address.city || !address.pinCode) {
//       alert('Please fill out all mandatory delivery address fields.');
//       return;
//     }

//     // Step 1: Create pending order in authoritative backend store
//     const result = storeService.createPendingOrder({
//       userId: email,
//       customerName: address.fullName,
//       customerEmail: email,
//       customerPhone: address.mobileNumber || mobileNumber,
//       items: cart.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
//       shippingAddress: address,
//       couponCode: couponCodeApplied
//     });

//     if (!result.success || !result.order) {
//       alert(result.message || 'Failed to initiate order.');
//       return;
//     }

//     setCreatedOrder(result.order);
//     setStep(3); // Razorpay modal step
//   };

//   const handleConfirmRazorpayPayment = () => {
//     if (!createdOrder) return;
//     setIsProcessingPayment(true);

//     // Simulate real Razorpay checkout completion & server signature verification
//     setTimeout(() => {
//       const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 12)}`;
//       storeService.finalizeOrderPayment(createdOrder.id, paymentId);
//       storeService.clearCart();

//       const finalOrder = storeService.getOrderById(createdOrder.id);
//       setIsProcessingPayment(false);
//       setStep(4); // Success step
//       if (finalOrder) {
//         onOrderSuccess(finalOrder);
//       }
//     }, 1800);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
//       <div
//         className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#E6E0D8] max-h-[95vh] flex flex-col"
//         role="dialog"
//         aria-modal="true"
//       >
//         {/* Header */}
//         <div className="p-4 sm:p-5 border-b border-[#E6E0D8] bg-[#FAF7F0] flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Lock className="w-4 h-4 text-[#641D32]" />
//             <span className="text-base font-serif font-bold text-[#292522]">
//               Secure Handloom Checkout
//             </span>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1 text-[#766B61] hover:text-[#292522] rounded transition-colors"
//             aria-label="Close checkout"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Stepper Progress */}
//         <div className="bg-white border-b border-[#E6E0D8] px-6 py-3 flex items-center justify-between text-xs font-semibold text-[#766B61]">
//           <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#641D32]' : ''}`}>
//             <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
//             <span>Verification</span>
//           </div>
//           <span className="text-[#E6E0D8]">───</span>
//           <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#641D32]' : ''}`}>
//             <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
//             <span>Address</span>
//           </div>
//           <span className="text-[#E6E0D8]">───</span>
//           <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#641D32]' : ''}`}>
//             <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
//             <span>Razorpay</span>
//           </div>
//           <span className="text-[#E6E0D8]">───</span>
//           <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-emerald-700' : ''}`}>
//             <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">4</span>
//             <span>Confirmed</span>
//           </div>
//         </div>

//         {/* Step Content */}
//         <div className="p-6 overflow-y-auto flex-1">

//           {/* STEP 1: Email OTP */}
//           {step === 1 && (
//             <div className="space-y-4 max-w-md mx-auto py-4">
//               <div className="text-center space-y-1">
//                 <h3 className="text-lg font-serif font-bold text-[#292522]">Customer Verification</h3>
//                 <p className="text-xs text-[#766B61]">Enter your email address to receive a secure 6-digit OTP code.</p>
//               </div>

//               {!otpSent ? (
//                 <div className="space-y-3 pt-2">
//                   <div>
//                     <label className="text-xs font-semibold text-[#292522] block mb-1">Email Address</label>
//                     <input
//                       type="email"
//                       placeholder="e.g. yourname@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full px-3 py-2 text-sm bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                     />
//                   </div>
//                   {otpError && <p className="text-xs text-red-600">{otpError}</p>}
//                   <button
//                     onClick={handleSendOtp}
//                     className="w-full py-2.5 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
//                   >
//                     Send 6-Digit OTP
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-3 pt-2">
//                   <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 space-y-1">
//                     <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
//                       <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
//                       <span>OTP Sent to {email}</span>
//                     </div>
//                     <p className="text-[11px] text-emerald-800/80 leading-relaxed">
//                       We've dispatched a 6-digit verification code to your email address. Please check your inbox (and spam folder) to enter the code below.
//                     </p>
//                   </div>

//                   <div>
//                     <div className="flex items-center justify-between mb-1">
//                       <label className="text-xs font-semibold text-[#292522]">Enter 6-Digit OTP</label>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setLastEmail(storeService.getLastDispatchedEmail(email));
//                           setIsInboxModalOpen(true);
//                         }}
//                         className="text-[11px] text-[#641D32] hover:underline font-semibold flex items-center gap-1"
//                       >
//                         <Mail className="w-3 h-3" />
//                         <span>Check Dispatched Email</span>
//                       </button>
//                     </div>

//                     <input
//                       type="text"
//                       maxLength={6}
//                       placeholder="• • • • • •"
//                       value={otpInput}
//                       onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
//                       className="w-full text-center tracking-widest text-xl font-mono px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                       autoFocus
//                     />
//                   </div>
//                   {otpError && <p className="text-xs text-red-600">{otpError}</p>}

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setOtpSent(false)}
//                       className="flex-1 py-2 border border-[#E6E0D8] text-xs font-medium rounded-md hover:bg-[#FAF7F0]"
//                     >
//                       Change Email
//                     </button>
//                     <button
//                       onClick={handleVerifyOtp}
//                       className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md transition-colors"
//                     >
//                       Verify & Continue
//                     </button>
//                   </div>

//                   {/* Resend Cooldown */}
//                   <div className="text-center pt-1">
//                     {resendCooldown > 0 ? (
//                       <span className="text-[11px] text-[#766B61]">
//                         Resend code in {resendCooldown}s
//                       </span>
//                     ) : (
//                       <button
//                         type="button"
//                         onClick={handleSendOtp}
//                         className="text-[11px] text-[#641D32] hover:underline font-semibold inline-flex items-center gap-1"
//                       >
//                         <RotateCcw className="w-3 h-3" />
//                         <span>Resend Code to Email</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* STEP 2: Address */}
//           {step === 2 && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-serif font-bold text-[#292522]">Shipping Delivery Address</h3>
//                 <span className="text-xs text-[#766B61]">{email}</span>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
//                 <div className="sm:col-span-2">
//                   <label className="font-semibold text-[#292522] block mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     value={address.fullName}
//                     onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
//                     className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                   />
//                 </div>

//                 <div>
//                   <label className="font-semibold text-[#292522] block mb-1">Mobile Contact</label>
//                   <input
//                     type="tel"
//                     value={address.mobileNumber}
//                     onChange={(e) => setAddress({ ...address, mobileNumber: e.target.value })}
//                     className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                   />
//                 </div>

//                 <div>
//                   <label className="font-semibold text-[#292522] block mb-1">Postal PIN Code</label>
//                   <input
//                     type="text"
//                     maxLength={6}
//                     value={address.pinCode}
//                     onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
//                     className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="font-semibold text-[#292522] block mb-1">Street Address Line 1</label>
//                   <input
//                     type="text"
//                     value={address.addressLine1}
//                     onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
//                     placeholder="House / Flat No., Road, Area"
//                     className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                   />
//                 </div>

//                 <div>
//                   <label className="font-semibold text-[#292522] block mb-1">City</label>
//                   <input
//                     type="text"
//                     value={address.city}
//                     onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                     className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                   />
//                 </div>

//                 <div>
//                   <label className="font-semibold text-[#292522] block mb-1">State</label>
//                   <input
//                     type="text"
//                     value={address.state}
//                     onChange={(e) => setAddress({ ...address, state: e.target.value })}
//                     className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="font-semibold text-[#292522] block mb-1">Landmark (Optional)</label>
//                   <input
//                     type="text"
//                     value={address.landmark || ''}
//                     onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
//                     placeholder="e.g. Near Mahalaxmi Temple"
//                     className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
//                   />
//                 </div>
//               </div>

//               {/* Order Quotation Preview */}
//               <div className="bg-[#FAF7F0] rounded-lg p-3 border border-[#E6E0D8] space-y-1.5 text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-[#766B61]">Subtotal ({cart.length} sarees)</span>
//                   <span className="tabular-nums font-semibold">{formatPriceINR(quote.subtotalPaise)}</span>
//                 </div>
//                 {quote.couponDiscountPaise > 0 && (
//                   <div className="flex justify-between text-emerald-800">
//                     <span>Coupon ({quote.couponApplied?.code})</span>
//                     <span className="tabular-nums font-semibold">-{formatPriceINR(quote.couponDiscountPaise)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between">
//                   <span className="text-[#766B61]">Express Delivery</span>
//                   <span className="tabular-nums">{quote.shippingChargePaise === 0 ? 'FREE' : formatPriceINR(quote.shippingChargePaise)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-sm text-[#641D32] pt-1 border-t border-[#E6E0D8]">
//                   <span>Total Amount</span>
//                   <span className="tabular-nums">{formatPriceINR(quote.finalPayablePaise)}</span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleProceedToPayment}
//                 className="w-full py-3 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
//               >
//                 <span>Continue to Razorpay Payment</span>
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </div>
//           )}

//           {/* STEP 3: Razorpay Payment Simulation */}
//           {step === 3 && createdOrder && (
//             <div className="space-y-5 text-center py-4">
//               <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#E6E0D8] flex items-center justify-center mx-auto text-[#641D32]">
//                 <CreditCard className="w-7 h-7" />
//               </div>

//               <div className="space-y-1">
//                 <h3 className="text-lg font-serif font-bold text-[#292522]">Razorpay Orders Gateway</h3>
//                 <p className="text-xs text-[#766B61]">
//                   Order #{createdOrder.orderNumber} · Total: <strong className="text-[#641D32]">{formatPriceINR(createdOrder.finalPayablePaise)}</strong>
//                 </p>
//               </div>

//               <div className="p-4 bg-[#FAF7F0] border border-[#E6E0D8] rounded-lg text-left text-xs space-y-2 max-w-md mx-auto">
//                 <div className="flex justify-between">
//                   <span className="text-[#766B61]">Merchant:</span>
//                   <span className="font-semibold text-[#292522]">Kolhapuri Fashion Saree</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#766B61]">Razorpay Order ID:</span>
//                   <span className="font-mono text-[11px]">{createdOrder.paymentDetails?.razorpayOrderId}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#766B61]">Mode:</span>
//                   <span className="text-emerald-700 font-semibold">Test Sandbox Verified</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#766B61]">Customer:</span>
//                   <span>{createdOrder.customerName} ({createdOrder.customerEmail})</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-center gap-2 text-xs text-[#766B61]">
//                 <ShieldCheck className="w-4 h-4 text-emerald-600" />
//                 <span>256-Bit SSL Encrypted Razorpay Checkout</span>
//               </div>

//               <div className="max-w-md mx-auto">
//                 <button
//                   onClick={handleConfirmRazorpayPayment}
//                   disabled={isProcessingPayment}
//                   className="w-full py-3.5 bg-[#641D32] hover:bg-[#4A1223] text-white text-sm font-semibold rounded-md shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
//                 >
//                   {isProcessingPayment ? (
//                     <span>Verifying Signature & Reserving Weave...</span>
//                   ) : (
//                     <>
//                       <span>Pay {formatPriceINR(createdOrder.finalPayablePaise)}</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* STEP 4: Confirmed Order Receipt */}
//           {step === 4 && (
//             <div className="text-center py-6 space-y-4">
//               <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
//                 <Check className="w-8 h-8" />
//               </div>

//               <div className="space-y-1">
//                 <span className="text-xs font-semibold text-[#641D32] tracking-wider uppercase">Order Placed</span>
//                 <h3 className="text-2xl font-serif font-bold text-[#292522]">Thank You for Your Order!</h3>
//                 <p className="text-xs text-[#766B61] max-w-sm mx-auto">
//                   Your handloom saree order has been confirmed. A receipt and confirmation email has been dispatched.
//                 </p>
//               </div>

//               <div className="p-4 bg-[#FAF7F0] border border-[#E6E0D8] rounded-lg max-w-md mx-auto text-left text-xs space-y-2">
//                 <div className="flex justify-between font-bold text-[#292522]">
//                   <span>Order Number:</span>
//                   <span className="font-mono text-[#641D32]">{createdOrder?.orderNumber}</span>
//                 </div>
//                 <div className="flex justify-between text-[#766B61]">
//                   <span>Payment Status:</span>
//                   <span className="text-emerald-700 font-semibold">Razorpay Confirmed (Paid)</span>
//                 </div>
//                 <div className="flex justify-between text-[#766B61]">
//                   <span>Dispatch Window:</span>
//                   <span>24-48 Hours from Kolhapur</span>
//                 </div>
//                 <div className="flex justify-between text-[#766B61]">
//                   <span>Ship to:</span>
//                   <span className="truncate max-w-[200px]">{address.fullName}, {address.city}</span>
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <button
//                   onClick={onClose}
//                   className="px-6 py-2.5 bg-[#641D32] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#4A1223] transition-colors"
//                 >
//                   View My Orders & Track Delivery
//                 </button>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>

//       <EmailInboxPreviewModal
//         isOpen={isInboxModalOpen}
//         onClose={() => setIsInboxModalOpen(false)}
//         emailData={lastEmail}
//         onAutoFillOtp={(code) => setOtpInput(code)}
//       />
//     </div>
//   );
// };
import React, { useState } from "react";
import {
  X,
  Check,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Lock,
  CheckCircle2,
  Mail,
  RotateCcw,
  Tag,
} from "lucide-react";
import { DeliveryAddress, Order } from "../types/index.ts";
import { storeService, DispatchedEmail } from "../services/storeService.ts";
import { formatPriceINR } from "../utils/formatters.ts";
import { EmailInboxPreviewModal } from "./EmailInboxPreviewModal.tsx";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCodeApplied?: string;
  onOrderSuccess: (order: Order) => void;
}

const inputCls =
  "w-full px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]";

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  couponCodeApplied,
  onOrderSuccess,
}) => {
  const session = storeService.getSession();
  const cart = storeService.getCart();
  const savedAddresses = storeService.getAddresses();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(session ? 2 : 1);
  const [email, setEmail] = useState(session?.email || "");

  // Coupon (optional) - customer may type a code created by the admin
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(
    (couponCodeApplied || "").toUpperCase(),
  );
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");

  // OTP flow for email verification
  const [challengeId, setChallengeId] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [lastEmail, setLastEmail] = useState<DispatchedEmail | null>(null);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Address: blank for a first-time customer, pre-filled only if a saved address exists
  const [address, setAddress] = useState<DeliveryAddress>(
    savedAddresses[0] || {
      id: `addr-${Date.now()}`,
      fullName: session?.fullName || "",
      mobileNumber: "",
      email: session?.email || "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      isDefault: true,
    },
  );
  const [addressError, setAddressError] = useState("");

  // Razorpay payment simulation state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const cartItems = cart.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    quantity: i.quantity,
  }));

  // Quote calculation (coupon used only if the customer applied one)
  const quote = storeService.calculateQuote({
    items: cartItems,
    couponCode: appliedCoupon || undefined,
  });

  /* ---------------- Coupon handlers ---------------- */
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponMessage("");
    setCouponError("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    // Test the code before accepting it
    const test = storeService.calculateQuote({
      items: cartItems,
      couponCode: code,
    });

    if (test.couponApplied && test.couponDiscountPaise > 0) {
      setAppliedCoupon(code);
      setCouponInput("");
      setCouponMessage(
        `Coupon ${test.couponApplied.code} applied. You saved ${formatPriceINR(test.couponDiscountPaise)}.`,
      );
    } else {
      setCouponError(
        "This coupon is not valid for your cart. It may be expired, fully used, or your order is below the minimum value.",
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponInput("");
    setCouponMessage("");
    setCouponError("");
  };

  /* ---------------- OTP handlers ---------------- */
  const handleSendOtp = () => {
    if (!email || !email.includes("@")) {
      setOtpError("Please enter a valid email address.");
      return;
    }
    const res = storeService.requestOTP(email);
    setChallengeId(res.challengeId);
    setOtpSent(true);
    setOtpError("");
    setResendCooldown(30);
    setLastEmail(storeService.getLastDispatchedEmail(email));
  };

  const handleVerifyOtp = () => {
    if (!otpInput || otpInput.length < 6) {
      setOtpError("Please enter the 6-digit verification code.");
      return;
    }
    const res = storeService.verifyOTP(challengeId, otpInput);
    if (res.success && res.session) {
      storeService.setSession(res.session);
      setStep(2);
    } else {
      setOtpError(res.message);
    }
  };

  /* ---------------- Order / payment ---------------- */
  const handleProceedToPayment = () => {
    setAddressError("");

    if (
      !address.fullName.trim() ||
      !address.addressLine1.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setAddressError(
        "Please fill in your name, street address, city and state.",
      );
      return;
    }
    if (!/^[6-9]\d{9}$/.test((address.mobileNumber || "").trim())) {
      setAddressError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test((address.pinCode || "").trim())) {
      setAddressError("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Create pending order in authoritative backend store.
    // couponCode is sent only when the customer applied a valid coupon.
    const result = storeService.createPendingOrder({
      userId: email,
      customerName: address.fullName.trim(),
      customerEmail: email,
      customerPhone: address.mobileNumber.trim(),
      items: cartItems,
      shippingAddress: { ...address, email },
      couponCode: appliedCoupon || undefined,
    });

    if (!result.success || !result.order) {
      setAddressError(result.message || "Failed to initiate order.");
      return;
    }

    setCreatedOrder(result.order);
    setStep(3); // Razorpay modal step
  };

  const handleConfirmRazorpayPayment = () => {
    if (!createdOrder) return;
    setIsProcessingPayment(true);

    // Simulate real Razorpay checkout completion & server signature verification
    setTimeout(() => {
      const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 12)}`;
      storeService.finalizeOrderPayment(createdOrder.id, paymentId);
      storeService.clearCart();

      const finalOrder = storeService.getOrderById(createdOrder.id);
      setIsProcessingPayment(false);
      setStep(4); // Success step
      if (finalOrder) {
        onOrderSuccess(finalOrder);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#E6E0D8] max-h-[95vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E0D8] bg-[#FAF7F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#641D32]" />
            <span className="text-base font-serif font-bold text-[#292522]">
              Secure Handloom Checkout
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#766B61] hover:text-[#292522] rounded transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="bg-white border-b border-[#E6E0D8] px-6 py-3 flex items-center justify-between text-xs font-semibold text-[#766B61]">
          <div
            className={`flex items-center gap-1.5 ${step >= 1 ? "text-[#641D32]" : ""}`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Verification</span>
          </div>
          <span className="text-[#E6E0D8]">───</span>
          <div
            className={`flex items-center gap-1.5 ${step >= 2 ? "text-[#641D32]" : ""}`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Address</span>
          </div>
          <span className="text-[#E6E0D8]">───</span>
          <div
            className={`flex items-center gap-1.5 ${step >= 3 ? "text-[#641D32]" : ""}`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Razorpay</span>
          </div>
          <span className="text-[#E6E0D8]">───</span>
          <div
            className={`flex items-center gap-1.5 ${step === 4 ? "text-emerald-700" : ""}`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              4
            </span>
            <span>Confirmed</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Email OTP */}
          {step === 1 && (
            <div className="space-y-4 max-w-md mx-auto py-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-serif font-bold text-[#292522]">
                  Customer Verification
                </h3>
                <p className="text-xs text-[#766B61]">
                  Enter your email address to receive a secure 6-digit OTP code.
                </p>
              </div>

              {!otpSent ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[#292522] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. yourname@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
                    />
                  </div>
                  {otpError && (
                    <p className="text-xs text-red-600">{otpError}</p>
                  )}
                  <button
                    onClick={handleSendOtp}
                    className="w-full py-2.5 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
                  >
                    Send 6-Digit OTP
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>OTP Sent to {email}</span>
                    </div>
                    <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                      We've dispatched a 6-digit verification code to your email
                      address. Please check your inbox (and spam folder) to
                      enter the code below.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#292522]">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setLastEmail(
                            storeService.getLastDispatchedEmail(email),
                          );
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
                      onChange={(e) =>
                        setOtpInput(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full text-center tracking-widest text-xl font-mono px-3 py-2 bg-[#FAF7F0] border border-[#E6E0D8] rounded-md focus:outline-none focus:border-[#641D32]"
                      autoFocus
                    />
                  </div>
                  {otpError && (
                    <p className="text-xs text-red-600">{otpError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="flex-1 py-2 border border-[#E6E0D8] text-xs font-medium rounded-md hover:bg-[#FAF7F0]"
                    >
                      Change Email
                    </button>
                    <button
                      onClick={handleVerifyOtp}
                      className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md transition-colors"
                    >
                      Verify & Continue
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
                        onClick={handleSendOtp}
                        className="text-[11px] text-[#641D32] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Resend Code to Email</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Address + optional coupon */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif font-bold text-[#292522]">
                  Shipping Delivery Address
                </h3>
                <span className="text-xs text-[#766B61]">{email}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#292522] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    placeholder="e.g. Priya Patil"
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#292522] block mb-1">
                    Mobile Contact
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={address.mobileNumber}
                    placeholder="10-digit mobile number"
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        mobileNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#292522] block mb-1">
                    Postal PIN Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={address.pinCode}
                    placeholder="6-digit PIN code"
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        pinCode: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={inputCls}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#292522] block mb-1">
                    Street Address Line 1
                  </label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) =>
                      setAddress({ ...address, addressLine1: e.target.value })
                    }
                    placeholder="House / Flat No., Road, Area"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#292522] block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    placeholder="e.g. Kolhapur"
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#292522] block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    placeholder="e.g. Maharashtra"
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#292522] block mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.landmark || ""}
                    onChange={(e) =>
                      setAddress({ ...address, landmark: e.target.value })
                    }
                    placeholder="e.g. Near Mahalaxmi Temple"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Optional Coupon Code */}
              <div className="rounded-lg border border-dashed border-[#C7A66A] bg-[#FAF7F0] p-3 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#292522]">
                  <Tag className="w-3.5 h-3.5 text-[#641D32]" />
                  <span>
                    Have a coupon code?{" "}
                    <span className="font-normal text-[#766B61]">
                      (optional)
                    </span>
                  </span>
                </div>

                {appliedCoupon &&
                quote.couponApplied &&
                quote.couponDiscountPaise > 0 ? (
                  <div className="flex items-center justify-between gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        <b className="font-mono">{quote.couponApplied.code}</b>{" "}
                        applied · you save{" "}
                        <b>{formatPriceINR(quote.couponDiscountPaise)}</b>
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-800 font-semibold shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 bg-white border border-[#E6E0D8] rounded-md font-mono font-bold tracking-wide focus:outline-none focus:border-[#641D32]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#292522] hover:bg-black text-white font-semibold rounded-md shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {couponError && <p className="text-red-600">{couponError}</p>}
                {couponMessage && !couponError && !appliedCoupon && (
                  <p className="text-emerald-700">{couponMessage}</p>
                )}
              </div>

              {/* Order Quotation Preview */}
              <div className="bg-[#FAF7F0] rounded-lg p-3 border border-[#E6E0D8] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#766B61]">
                    Subtotal ({cart.length} sarees)
                  </span>
                  <span className="tabular-nums font-semibold">
                    {formatPriceINR(quote.subtotalPaise)}
                  </span>
                </div>
                {quote.couponDiscountPaise > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Coupon ({quote.couponApplied?.code})</span>
                    <span className="tabular-nums font-semibold">
                      -{formatPriceINR(quote.couponDiscountPaise)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Express Delivery</span>
                  <span className="tabular-nums">
                    {quote.shippingChargePaise === 0
                      ? "FREE"
                      : formatPriceINR(quote.shippingChargePaise)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#641D32] pt-1 border-t border-[#E6E0D8]">
                  <span>Total Amount</span>
                  <span className="tabular-nums">
                    {formatPriceINR(quote.finalPayablePaise)}
                  </span>
                </div>
              </div>

              {addressError && (
                <p className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                  {addressError}
                </p>
              )}

              <button
                onClick={handleProceedToPayment}
                className="w-full py-3 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Razorpay Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Razorpay Payment Simulation */}
          {step === 3 && createdOrder && (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#E6E0D8] flex items-center justify-center mx-auto text-[#641D32]">
                <CreditCard className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-[#292522]">
                  Razorpay Orders Gateway
                </h3>
                <p className="text-xs text-[#766B61]">
                  Order #{createdOrder.orderNumber} · Total:{" "}
                  <strong className="text-[#641D32]">
                    {formatPriceINR(createdOrder.finalPayablePaise)}
                  </strong>
                </p>
              </div>

              <div className="p-4 bg-[#FAF7F0] border border-[#E6E0D8] rounded-lg text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Merchant:</span>
                  <span className="font-semibold text-[#292522]">
                    Kolhapuri Fashion Saree
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Razorpay Order ID:</span>
                  <span className="font-mono text-[11px]">
                    {createdOrder.paymentDetails?.razorpayOrderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Mode:</span>
                  <span className="text-emerald-700 font-semibold">
                    Test Sandbox Verified
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#766B61]">Customer:</span>
                  <span>
                    {createdOrder.customerName} ({createdOrder.customerEmail})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#766B61]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Razorpay Checkout</span>
              </div>

              <div className="max-w-md mx-auto">
                <button
                  onClick={handleConfirmRazorpayPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 bg-[#641D32] hover:bg-[#4A1223] text-white text-sm font-semibold rounded-md shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isProcessingPayment ? (
                    <span>Verifying Signature & Reserving Weave...</span>
                  ) : (
                    <>
                      <span>
                        Pay {formatPriceINR(createdOrder.finalPayablePaise)}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmed Order Receipt */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#641D32] tracking-wider uppercase">
                  Order Placed
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#292522]">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs text-[#766B61] max-w-sm mx-auto">
                  Your handloom saree order has been confirmed. A receipt and
                  confirmation email has been dispatched.
                </p>
              </div>

              <div className="p-4 bg-[#FAF7F0] border border-[#E6E0D8] rounded-lg max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-[#292522]">
                  <span>Order Number:</span>
                  <span className="font-mono text-[#641D32]">
                    {createdOrder?.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-[#766B61]">
                  <span>Payment Status:</span>
                  <span className="text-emerald-700 font-semibold">
                    Razorpay Confirmed (Paid)
                  </span>
                </div>
                <div className="flex justify-between text-[#766B61]">
                  <span>Dispatch Window:</span>
                  <span>24-48 Hours from Kolhapur</span>
                </div>
                <div className="flex justify-between text-[#766B61]">
                  <span>Ship to:</span>
                  <span className="truncate max-w-[200px]">
                    {address.fullName}, {address.city}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#641D32] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#4A1223] transition-colors"
                >
                  View My Orders & Track Delivery
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EmailInboxPreviewModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        emailData={lastEmail}
        onAutoFillOtp={(code) => setOtpInput(code)}
      />
    </div>
  );
};
