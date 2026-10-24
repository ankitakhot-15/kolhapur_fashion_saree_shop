import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Upload,
  Sparkles,
  Download,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface TryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentImageUrl: string;
  productName: string;
}

// Free public Hugging Face Space (no key needed)
const SPACE_ID = "yisol/IDM-VTON";

// Optional free Hugging Face token for a bigger GPU quota.
// WARNING: anything starting with VITE_ is PUBLIC in the browser.
// Use a throw-away read-only token, never your main one.
const HF_TOKEN: string | undefined =
  (import.meta as any).env?.VITE_HF_TOKEN || undefined;

// The model works on 3:4 pictures
const W = 768;
const H = 1024;

const fixSrc = (url?: string) =>
  url && url.startsWith("/src/assets/images/")
    ? url.replace("/src/assets/images/", "/images/")
    : url || "";

const loadImage = (src: string, cors = false) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = src;
  });

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not read the image."))),
      "image/jpeg",
      0.92,
    ),
  );

// Customer photo -> 768x1024 canvas, anchored at the top so the head is never cut
const preparePerson = async (file: File) => {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (W - dw) / 2;
    const dy = dh > H ? 0 : (H - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
};

// Saree picture -> JPEG (max 1024px) so every format works
const prepareGarment = async (url: string) => {
  const img = await loadImage(fixSrc(url), true);
  const scale = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas);
};

export const TryOnModal: React.FC<TryOnModalProps> = ({
  isOpen,
  onClose,
  garmentImageUrl,
  productName,
}) => {
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [keepPct, setKeepPct] = useState(26);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const personCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rawBitmapRef = useRef<ImageBitmap | null>(null);
  const submissionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Paste the customer's ORIGINAL top part (face + hair) over the AI picture
  const renderBlend = useCallback((pct: number) => {
    const person = personCanvasRef.current;
    const bmp = rawBitmapRef.current;
    if (!person || !bmp) return;

    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(bmp, 0, 0, W, H);

    const layer = document.createElement("canvas");
    layer.width = W;
    layer.height = H;
    const lctx = layer.getContext("2d")!;
    lctx.drawImage(person, 0, 0, W, H);

    const solid = pct / 100;
    const fade = Math.min(1, solid + 0.1);
    const gradient = lctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(solid, "rgba(0,0,0,1)");
    gradient.addColorStop(fade, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    lctx.globalCompositeOperation = "destination-in";
    lctx.fillStyle = gradient;
    lctx.fillRect(0, 0, W, H);

    ctx.drawImage(layer, 0, 0);
    setResultUrl(out.toDataURL("image/jpeg", 0.92));
  }, []);

  // Slider moves the blend line instantly, no new AI call needed
  useEffect(() => {
    if (rawBitmapRef.current) renderBlend(keepPct);
  }, [keepPct, renderBlend]);

  const cancelRunning = () => {
    try {
      submissionRef.current?.cancel?.();
    } catch {
      /* ignore */
    }
    submissionRef.current = null;
  };

  const handleClose = () => {
    cancelRunning();
    setBusy(false);
    setStatus("");
    onClose();
  };

  // Escape key + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => () => cancelRunning(), []);

  if (!isOpen) return null;

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setError("Please choose a JPG, PNG or WebP photo (iPhone HEIC is not supported).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("This photo is too large. Please choose one under 12 MB.");
      return;
    }
    try {
      const canvas = await preparePerson(file);
      personCanvasRef.current = canvas;
      rawBitmapRef.current = null;
      setPersonPreview(canvas.toDataURL("image/jpeg", 0.85));
      setResultUrl(null);
      setNote("");
      setError("");
    } catch {
      setError("Could not read this photo. Please try another one.");
    }
  };

  const handleGenerate = async () => {
    if (!personCanvasRef.current) {
      setError("Please upload your photo first.");
      return;
    }
    if (!consent) {
      setError("Please tick the consent box to continue.");
      return;
    }

    setBusy(true);
    setError("");
    setNote("");
    setResultUrl(null);
    rawBitmapRef.current = null;

    try {
      setStatus("Preparing your photo and the saree...");
      const personBlob = await canvasToBlob(personCanvasRef.current);
      const garmentBlob = await prepareGarment(garmentImageUrl);

      setStatus("Connecting to the free AI server...");
      const { Client, handle_file } = await import("@gradio/client");
      const app: any = await (Client as any).connect(
        SPACE_ID,
        HF_TOKEN ? { hf_token: HF_TOKEN } : {},
      );

      setStatus("Waiting in the queue...");
      const submission = app.submit("/tryon", {
        dict: {
          background: handle_file(personBlob),
          layers: [],
          composite: null,
        },
        garm_img: handle_file(garmentBlob),
        garment_des: `${productName} saree`,
        is_checked: true, // auto-detect the clothing area, face is left alone
        is_checked_crop: false,
        denoise_steps: 30,
        seed: 42,
      });
      submissionRef.current = submission;

      let output: any = null;
      for await (const msg of submission) {
        if (msg.type === "status") {
          if (msg.stage === "error") {
            throw new Error(msg.message || "The AI server returned an error.");
          }
          if (msg.stage === "pending") {
            setStatus(
              typeof msg.position === "number"
                ? `In the queue... position ${msg.position + 1}`
                : "Waiting in the queue...",
            );
          }
          if (msg.stage === "generating") {
            setStatus("Creating your preview... this can take 30 to 90 seconds.");
          }
        }
        if (msg.type === "data") output = msg.data;
      }

      const url: string | undefined = output?.[0]?.url;
      if (!url) throw new Error("No picture came back from the AI server.");

      setStatus("Keeping your original face...");
      try {
        const res = await fetch(url);
        const bmp = await createImageBitmap(await res.blob());
        rawBitmapRef.current = bmp;
        renderBlend(keepPct);
      } catch {
        setNote(
          "Face protection could not run in this browser, so the AI picture is shown as it is. Please check that the face looks right.",
        );
        setResultUrl(url);
      }
      setStatus("");
    } catch (err: any) {
      const text = String(err?.message || err || "");
      if (/quota/i.test(text)) {
        setError("The free AI quota is used up for now. Please try again in a few minutes.");
      } else if (/cancel/i.test(text)) {
        setError("");
      } else {
        setError(
          "The free AI server is busy or sleeping. Please wait a minute and try again.",
        );
      }
      setStatus("");
    } finally {
      setBusy(false);
      submissionRef.current = null;
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "my-saree-preview.jpg";
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Virtual saree try-on"
    >
      <div className="relative bg-white rounded-2xl w-full max-w-4xl my-auto shadow-2xl border border-[#E6E0D8] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E6E0D8] bg-[#FAF7F0]">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#292522] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C7A66A] shrink-0" />
              <span className="truncate">Try this saree on you</span>
            </h2>
            <p className="text-[11px] text-[#766B61] truncate">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#766B61] hover:text-[#292522]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 sm:p-6">
          {/* Left: controls */}
          <div className="space-y-4 text-xs text-[#292522]">
            <ol className="space-y-1.5 text-[#766B61] list-decimal list-inside">
              <li>Upload a clear, front-facing photo of yourself.</li>
              <li>Tick the consent box and press Create preview.</li>
              <li>Wait up to 90 seconds for the AI picture.</li>
            </ol>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePickFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="w-full py-3 border-2 border-dashed border-[#C7A66A] rounded-lg font-semibold text-[#641D32] hover:bg-[#FAF7F0] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {personPreview ? "Change my photo" : "Upload my photo"}
            </button>

            <div>
              <label className="font-semibold flex items-center justify-between">
                <span>Keep my original face and hair</span>
                <span className="text-[#641D32] tabular-nums">{keepPct}% of the top</span>
              </label>
              <input
                type="range"
                min={15}
                max={45}
                step={1}
                value={keepPct}
                onChange={(e) => setKeepPct(Number(e.target.value))}
                className="w-full accent-[#641D32] mt-1.5"
              />
              <p className="text-[11px] text-[#766B61] mt-1">
                Raise this if your face looks changed. Keep it as low as possible so the saree
                shows near the neck.
              </p>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-[#641D32]"
              />
              <span className="text-[#766B61] leading-relaxed">
                This is my own photo. I understand it is sent to a free third-party AI service
                (Hugging Face) to create the preview. The shop does not store it.
              </span>
            </label>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={busy || !personPreview}
              className="w-full py-3 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Working...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C7A66A]" />
                  Create preview
                </>
              )}
            </button>

            {busy && (
              <button
                type="button"
                onClick={cancelRunning}
                className="w-full py-2 border border-[#E6E0D8] rounded-md text-[#766B61] hover:bg-[#FAF7F0]"
              >
                Cancel
              </button>
            )}

            {status && <p className="text-[#641D32] font-medium">{status}</p>}
            {error && (
              <p className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
                {error}
              </p>
            )}
            {note && (
              <p className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
                {note}
              </p>
            )}
          </div>

          {/* Right: preview / result */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#FAF7F0] border border-[#E6E0D8] flex items-center justify-center">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Your AI saree preview"
                  className="w-full h-full object-cover"
                />
              ) : personPreview ? (
                <img
                  src={personPreview}
                  alt="Your uploaded photo"
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <p className="text-xs text-[#766B61] px-6 text-center">
                  Your photo and the result will appear here.
                </p>
              )}
              {busy && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#641D32] animate-spin" />
                </div>
              )}
              {resultUrl && (
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded">
                  AI preview
                </span>
              )}
            </div>

            {resultUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-2.5 border border-[#641D32] text-[#641D32] hover:bg-[#FAF7F0] rounded-md text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download my preview
              </button>
            )}

            <p className="flex items-start gap-1.5 text-[11px] text-[#766B61] leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 text-[#641D32] shrink-0 mt-0.5" />
              AI preview only. The real drape, pleats and colours of the saree can look different.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};