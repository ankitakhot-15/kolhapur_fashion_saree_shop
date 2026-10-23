// // import React, { useState, useEffect } from 'react';
// // import { ChevronLeft, ChevronRight, X } from 'lucide-react';
// // import { storeService } from '../services/storeService.ts';

// // export const AnnouncementBar: React.FC = () => {
// //   const [messages, setMessages] = useState<string[]>([]);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [isPaused, setIsPaused] = useState(false);
// //   const [isDismissed, setIsDismissed] = useState(false);

// //   useEffect(() => {
// //     const update = () => {
// //       const settings = storeService.getSettings();
// //       setMessages(settings.announcementMessages || []);
// //     };
// //     update();
// //     return storeService.subscribe(update);
// //   }, []);

// //   useEffect(() => {
// //     if (messages.length <= 1 || isPaused || isDismissed) return;
// //     const interval = setInterval(() => {
// //       setCurrentIndex((prev) => (prev + 1) % messages.length);
// //     }, 4500);
// //     return () => clearInterval(interval);
// //   }, [messages, isPaused, isDismissed]);

// //   if (isDismissed || messages.length === 0) return null;

// //   return (
// //     <div
// //       className="bg-[#641D32] text-[#FAF7F0] text-xs font-medium py-2 px-4 transition-colors relative z-40"
// //       onMouseEnter={() => setIsPaused(true)}
// //       onMouseLeave={() => setIsPaused(false)}
// //       role="region"
// //       aria-label="Promotions and Announcements"
// //     >
// //       <div className="max-w-7xl mx-auto flex items-center justify-between">
// //         <button
// //           onClick={() => setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)}
// //           className="p-1 hover:text-[#C7A66A] transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C7A66A]"
// //           aria-label="Previous announcement"
// //         >
// //           <ChevronLeft className="w-3.5 h-3.5" />
// //         </button>

// //         <div className="text-center truncate px-2 tracking-wide font-sans">
// //           <span>{messages[currentIndex]}</span>
// //         </div>

// //         <div className="flex items-center gap-2 shrink-0">
// //           <button
// //             onClick={() => setCurrentIndex((prev) => (prev + 1) % messages.length)}
// //             className="p-1 hover:text-[#C7A66A] transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C7A66A]"
// //             aria-label="Next announcement"
// //           >
// //             <ChevronRight className="w-3.5 h-3.5" />
// //           </button>
// //           <button
// //             onClick={() => setIsDismissed(true)}
// //             className="p-1 hover:text-[#C7A66A] transition-colors rounded ml-1"
// //             aria-label="Dismiss banner"
// //           >
// //             <X className="w-3.5 h-3.5" />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { storeService } from "../services/storeService.ts";

// export const AnnouncementBar: React.FC = () => {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [speedSeconds, setSpeedSeconds] = useState(4);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isDismissed, setIsDismissed] = useState(false);

//   useEffect(() => {
//     const update = () => {
//       const settings = storeService.getSettings();
//       setMessages(settings.announcementMessages || []);
//       setSpeedSeconds(settings.announcementRotationSpeedSeconds || 4);
//     };
//     update();
//     return storeService.subscribe(update);
//   }, []);

//   if (isDismissed || messages.length === 0) return null;

//   // Longer content / more messages => longer loop so the speed stays readable.
//   const totalChars = messages.reduce((sum, m) => sum + m.length, 0);
//   const duration = Math.max(totalChars * 0.22 * (speedSeconds / 4), 20);

//   const renderTrack = (key: string) => (
//     <div
//       className="flex shrink-0 items-center"
//       aria-hidden={key === "b"}
//       key={key}
//     >
//       {messages.map((m, i) => (
//         <span
//           key={`${key}-${i}`}
//           className="flex items-center whitespace-nowrap"
//         >
//           <span className="px-6">{m}</span>
//           <span className="text-[#C7A66A] px-6">◆</span>
//         </span>
//       ))}
//     </div>
//   );

//   return (
//     <div
//       className="bg-[#641D32] text-[#FAF7F0] text-xs font-medium py-2 relative z-40"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//       role="region"
//       aria-label="Promotions and Announcements"
//     >
//       <style>{`
//         @keyframes kfs-marquee {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .kfs-marquee-inner { animation: none !important; }
//         }
//       `}</style>

//       <div className="overflow-hidden pr-10 font-sans tracking-wide">
//         <div
//           className="kfs-marquee-inner flex w-max"
//           style={{
//             animation: `kfs-marquee ${duration}s linear infinite`,
//             animationPlayState: isPaused ? "paused" : "running",
//           }}
//         >
//           {/* Rendered twice so the loop is seamless */}
//           {renderTrack("a")}
//           {renderTrack("b")}
//         </div>
//       </div>

//       <button
//         onClick={() => setIsDismissed(true)}
//         className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-[#641D32] hover:text-[#C7A66A] transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C7A66A]"
//         aria-label="Dismiss banner"
//       >
//         <X className="w-3.5 h-3.5" />
//       </button>
//     </div>
//   );
// };
import React, { useState, useEffect } from "react";
import { storeService } from "../services/storeService.ts";

export const AnnouncementBar: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [speedSeconds, setSpeedSeconds] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      const settings = storeService.getSettings();
      setMessages(settings.announcementMessages || []);
      setSpeedSeconds(settings.announcementRotationSpeedSeconds || 4);
    };
    update();
    return storeService.subscribe(update);
  }, []);

  if (messages.length === 0) return null;

  // Longer content / more messages => longer loop so the speed stays readable.
  const totalChars = messages.reduce((sum, m) => sum + m.length, 0);
  const duration = Math.max(totalChars * 0.22 * (speedSeconds / 4), 20);

  const renderTrack = (key: string) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={key === "b"}
      key={key}
    >
      {messages.map((m, i) => (
        <span
          key={`${key}-${i}`}
          className="flex items-center whitespace-nowrap"
        >
          <span className="px-6">{m}</span>
          <span className="text-[#C7A66A] px-6">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="bg-[#641D32] text-[#FAF7F0] text-xs font-medium py-2 relative z-40 w-full min-w-0 max-w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Promotions and Announcements"
    >
      <style>{`
        @keyframes kfs-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .kfs-marquee-inner { animation: none !important; }
        }
      `}</style>

      <div
        className="overflow-hidden font-sans tracking-wide"
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
        }}
      >
        <div
          className="kfs-marquee-inner flex w-max"
          style={{
            animation: `kfs-marquee ${duration}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* Rendered twice so the loop is seamless */}
          {renderTrack("a")}
          {renderTrack("b")}
        </div>
      </div>
    </div>
  );
};
