// import React, { useRef, useState } from "react";
// import { cld } from "../../lib/cloudinaryUrl.ts";

// interface Props {
//   value: string;
//   onChange: (url: string) => void;
//   onUploadingChange?: (u: boolean) => void;
//   label?: string;
// }

// const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// const ImageUploadField: React.FC<Props> = ({
//   value,
//   onChange,
//   onUploadingChange,
//   label = "Image",
// }) => {
//   const ref = useRef<HTMLInputElement>(null);
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");

//   const handleFile = async (file?: File) => {
//     if (!file) return;
//     setErr("");
//     setBusy(true);
//     onUploadingChange?.(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       fd.append("upload_preset", PRESET);
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
//         {
//           method: "POST",
//           body: fd,
//         },
//       );
//       const data = await res.json();
//       if (!data.secure_url)
//         throw new Error(data.error?.message || "Upload failed");
//       onChange(data.secure_url);
//     } catch (e: any) {
//       setErr(e.message || "Upload failed");
//     } finally {
//       setBusy(false);
//       onUploadingChange?.(false);
//       if (ref.current) ref.current.value = "";
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <label className="font-semibold block">{label}</label>
//       <div className="flex items-center gap-3">
//         {value ? (
//           <img
//             src={cld(value, { w: 200, h: 200 })}
//             alt=""
//             className="w-20 h-20 rounded object-cover border"
//           />
//         ) : (
//           <div className="w-20 h-20 rounded border border-dashed border-[#E6E0D8] bg-[#FAF7F0]" />
//         )}
//         <button
//           type="button"
//           onClick={() => ref.current?.click()}
//           disabled={busy}
//           className="px-3 py-1.5 border border-[#E6E0D8] rounded font-medium hover:bg-[#FAF7F0] disabled:opacity-50"
//         >
//           {busy ? "Uploading…" : value ? "Change image" : "Upload image"}
//         </button>
//       </div>
//       <input
//         ref={ref}
//         type="file"
//         accept="image/*"
//         hidden
//         onChange={(e) => handleFile(e.target.files?.[0])}
//       />
//       {err && <p className="text-red-600">{err}</p>}
//     </div>
//   );
// };

// export default ImageUploadField;
import React, { useRef, useState } from "react";
import { cld } from "../../lib/cloudinaryUrl.ts";

interface Props {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (u: boolean) => void;
  label?: string;
}

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
  | string
  | undefined;
const MAX_MB = 10;

const ImageUploadField: React.FC<Props> = ({
  value,
  onChange,
  onUploadingChange,
  label = "Image",
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const resetInput = () => {
    if (ref.current) ref.current.value = "";
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setErr("");

    if (!CLOUD || !PRESET) {
      setErr(
        "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env, then restart the dev server.",
      );
      resetInput();
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErr("Please choose an image file (JPG, PNG or WebP).");
      resetInput();
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErr(`Image is too large. Maximum size is ${MAX_MB} MB.`);
      resetInput();
      return;
    }

    setBusy(true);
    onUploadingChange?.(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
        { method: "POST", body: fd },
      );

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        /* response was not JSON */
      }

      if (!res.ok || !data?.secure_url) {
        throw new Error(
          data?.error?.message || `Upload failed (HTTP ${res.status}).`,
        );
      }
      onChange(data.secure_url);
    } catch (e: any) {
      setErr(e?.message || "Upload failed. Check your internet connection.");
    } finally {
      setBusy(false);
      onUploadingChange?.(false);
      resetInput();
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold block">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={cld(value, { w: 200, h: 200 })}
            alt=""
            className="w-20 h-20 rounded object-cover border"
          />
        ) : (
          <div className="w-20 h-20 rounded border border-dashed border-[#E6E0D8] bg-[#FAF7F0]" />
        )}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="px-3 py-1.5 border border-[#E6E0D8] rounded font-medium hover:bg-[#FAF7F0] disabled:opacity-50"
        >
          {busy ? "Uploading…" : value ? "Change image" : "Upload image"}
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {err && <p className="text-red-600">{err}</p>}
    </div>
  );
};

export default ImageUploadField;
