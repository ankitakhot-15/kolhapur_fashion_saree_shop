// import React, { useMemo, useRef, useState } from "react";
// // @ts-ignore xlsx types may not be installed in every deployment environment.
// import * as XLSX from "xlsx";
// import { FileSpreadsheet, FileText, Download, X } from "lucide-react";
// import type { SareeProduct } from "../../types/index.ts";
// import { storeService } from "../../services/storeService.ts";

// /* -------------------------------------------------------------------------- */
// /* Types & helpers                                                            */
// /* -------------------------------------------------------------------------- */

// type Mode = "add" | "set";
// type FileSource = "excel" | "bill" | "";

// type ExcelCellValue = string | number | boolean | null | undefined;

// interface ExcelRecord {
//   [key: string]: ExcelCellValue;
// }

// interface ExcelJsonRow extends ExcelRecord {}

// interface Row {
//   id: string;
//   sku: string;
//   text: string; // description from the sheet / bill
//   qty: number; // NaN when invalid
//   reason: string;
//   variantKey: string; // "productId|variantId" or ''
//   include: boolean;
// }

// interface Option {
//   key: string;
//   productId: string;
//   variantId: string;
//   label: string;
//   search: string;
//   sku: string;
//   stock: number;
// }

// interface PreviewRow extends Row {
//   opt?: Option;
//   before: number;
//   after: number;
//   delta: number;
//   problem: string;
// }

// interface BillLine {
//   sku?: string;
//   description?: string;
//   quantity?: number | string;
// }

// interface BillResponse {
//   lines?: BillLine[];
//   error?: string;
// }

// interface BillRequestBody {
//   mimeType: string;
//   data: string;
// }

// interface ImportResult {
//   ok: number;
//   errors: string[];
// }

// interface Props {
//   products: SareeProduct[];
//   by: string;
//   /** Optional: return a Firebase ID token so the bill-reading function can verify the owner. */
//   getAuthToken?: () => Promise<string | undefined>;
// }

// const BILL_URL = import.meta.env.VITE_BILL_PARSER_URL as string | undefined;
// const MAX_BILL_MB = 6;

// const norm = (s: unknown): string =>
//   String(s ?? "")
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, "");
// const tokens = (s: string): Set<string> =>
//   new Set(
//     s
//       .toLowerCase()
//       .split(/[^a-z0-9]+/)
//       .filter((w) => w.length > 2),
//   );

// const SKU_KEYS = ["sku", "skucode", "itemcode", "code", "variantsku"];
// const QTY_KEYS = [
//   "quantity",
//   "qty",
//   "pcs",
//   "pieces",
//   "units",
//   "stock",
//   "count",
// ];
// const REASON_KEYS = ["reason", "note", "notes", "remarks", "remark"];
// const NAME_KEYS = ["name", "product", "item", "description", "sareename"];

// function pick(rec: Record<string, unknown>, names: string[]): string {
//   for (const k of Object.keys(rec)) {
//     if (names.includes(norm(k))) return String(rec[k] ?? "").trim();
//   }
//   return "";
// }

// const toQty = (raw: string): number => {
//   const cleaned = raw.replace(/,/g, "").trim();
//   return cleaned === "" ? NaN : Number(cleaned);
// };

// const fileToBase64 = (file: File): Promise<string> =>
//   new Promise<string>((resolve, reject) => {
//     const r = new FileReader();
//     r.onload = () => resolve(String(r.result).split(",")[1] || "");
//     r.onerror = () => reject(new Error("Could not read the file."));
//     r.readAsDataURL(file);
//   });

// /* -------------------------------------------------------------------------- */
// /* Component                                                                  */
// /* -------------------------------------------------------------------------- */

// const StockImport: React.FC<Props> = ({ products, by, getAuthToken }) => {
//   const excelRef = useRef<HTMLInputElement>(null);
//   const billRef = useRef<HTMLInputElement>(null);

//   const [mode, setMode] = useState<Mode>("add");
//   const [rows, setRows] = useState<Row[]>([]);
//   const [fileName, setFileName] = useState<string>("");
//   const [source, setSource] = useState<FileSource>("");
//   const [busy, setBusy] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [result, setResult] = useState<ImportResult | null>(null);

//   const options = useMemo<Option[]>(
//     () =>
//       products.flatMap((p) =>
//         p.variants.map((v) => ({
//           key: `${p.id}|${v.variantId}`,
//           productId: p.id,
//           variantId: v.variantId,
//           label: `${p.name} — ${v.colorName} (${v.sku})`,
//           search: `${p.name} ${v.colorName}`,
//           sku: v.sku,
//           stock: v.inventoryStock,
//         })),
//       ),
//     [products],
//   );

//   const optMap = useMemo(
//     () => new Map(options.map((o) => [o.key, o])),
//     [options],
//   );
//   const skuMap = useMemo(
//     () => new Map(options.map((o) => [norm(o.sku), o.key])),
//     [options],
//   );

//   /** SKU match first; otherwise a name/colour match that must be clearly the best. */
//   const matchVariant = (sku: string, text: string): string => {
//     if (sku && skuMap.has(norm(sku))) return skuMap.get(norm(sku))!;
//     const t = tokens(`${text} ${sku}`);
//     if (t.size === 0) return "";
//     let best = "";
//     let bestScore = 0;
//     let second = 0;
//     for (const o of options) {
//       const ot = tokens(o.search);
//       let score = 0;
//       t.forEach((w) => ot.has(w) && score++);
//       if (score > bestScore) {
//         second = bestScore;
//         bestScore = score;
//         best = o.key;
//       } else if (score > second) {
//         second = score;
//       }
//     }
//     return bestScore >= 2 && bestScore > second ? best : "";
//   };

//   const makeRow = (
//     i: number,
//     sku: string,
//     text: string,
//     qtyRaw: string,
//     reason: string,
//   ): Row => ({
//     id: `${Date.now()}-${i}`,
//     sku,
//     text,
//     qty: toQty(qtyRaw),
//     reason,
//     variantKey: matchVariant(sku, text),
//     include: true,
//   });

//   /* ------------------------------ File readers ------------------------------ */

//   const readExcel = async (file: File) => {
//     const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
//     const ws = wb.Sheets[wb.SheetNames[0]];
//     if (!ws) throw new Error("The file has no sheet.");
//     const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws, {
//       defval: "",
//     });
//     const out: Row[] = [];
//     json.forEach((rec: Record<string, unknown>, i: number) => {
//       const sku = pick(rec, SKU_KEYS);
//       const name = pick(rec, NAME_KEYS);
//       const qty = pick(rec, QTY_KEYS);
//       if (!sku && !name && !qty) return; // blank line
//       out.push(makeRow(i, sku, name, qty, pick(rec, REASON_KEYS)));
//     });
//     if (!out.length) {
//       throw new Error(
//         "No rows found. Use columns named SKU and Quantity (download the template).",
//       );
//     }
//     return out;
//   };

//   const readBill = async (file: File) => {
//     if (!BILL_URL) {
//       throw new Error(
//         "Bill reading is not set up yet. Deploy the parseBill function and set VITE_BILL_PARSER_URL in .env.",
//       );
//     }
//     if (file.size > MAX_BILL_MB * 1024 * 1024) {
//       throw new Error(`Bill is too large. Maximum size is ${MAX_BILL_MB} MB.`);
//     }
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     };
//     const token = await getAuthToken?.();
//     if (token) headers.Authorization = `Bearer ${token}`;

//     const res = await fetch(BILL_URL, {
//       method: "POST",
//       headers,
//       body: JSON.stringify({
//         mimeType: file.type,
//         data: await fileToBase64(file),
//       }),
//     });
//     const data = await res.json().catch(() => null);
//     if (!res.ok || !Array.isArray(data?.lines)) {
//       throw new Error(
//         data?.error || `Could not read the bill (HTTP ${res.status}).`,
//       );
//     }
//     const out: Row[] = (data.lines as any[]).map((l, i) =>
//       makeRow(
//         i,
//         String(l.sku ?? ""),
//         String(l.description ?? ""),
//         String(l.quantity ?? ""),
//         "Supplier bill",
//       ),
//     );
//     if (!out.length) throw new Error("No items were found on this bill.");
//     return out;
//   };

//   const handleFile = async (file: File | undefined, kind: "excel" | "bill") => {
//     if (!file) return;
//     setError("");
//     setResult(null);
//     setBusy(true);
//     try {
//       const parsed =
//         kind === "excel" ? await readExcel(file) : await readBill(file);
//       setRows(parsed);
//       setFileName(file.name);
//       setSource(kind);
//       if (kind === "bill") setMode("add"); // a supplier bill means new stock arrived
//     } catch (e: any) {
//       setRows([]);
//       setSource("");
//       setError(e?.message || "Could not read this file.");
//     } finally {
//       setBusy(false);
//       if (excelRef.current) excelRef.current.value = "";
//       if (billRef.current) billRef.current.value = "";
//     }
//   };

//   const downloadTemplate = () => {
//     const ws = XLSX.utils.aoa_to_sheet([
//       ["SKU", "Quantity", "Reason"],
//       [options[0]?.sku || "KFS-SILK-101", 10, "New shipment from weaver"],
//     ]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Stock");
//     XLSX.writeFile(wb, "stock-import-template.xlsx");
//   };

//   /* --------------------------------- Preview -------------------------------- */

//   const preview = useMemo(() => {
//     const running = new Map(options.map((o) => [o.key, o.stock]));
//     return rows.map((r) => {
//       const opt = optMap.get(r.variantKey);
//       let problem = "";
//       let before = 0;
//       let after = 0;
//       let delta = 0;
//       if (!Number.isInteger(r.qty)) problem = "Invalid quantity";
//       else if (!opt) problem = "Choose the saree colour";
//       else {
//         before = running.get(opt.key) ?? 0;
//         if (mode === "set" && r.qty < 0) problem = "Stock cannot be negative";
//         else if (mode === "add" && r.qty === 0) problem = "Quantity is 0";
//         else {
//           delta = mode === "add" ? r.qty : r.qty - before;
//           if (delta === 0) problem = "No change";
//           else if (before + delta < 0) problem = "Would make stock negative";
//           else after = before + delta;
//         }
//       }
//       if (!problem && r.include && opt) running.set(opt.key, after);
//       return { ...r, opt, before, after, delta, problem };
//     });
//   }, [rows, mode, options, optMap]);

//   const applicable = preview.filter((r) => r.include && !r.problem && r.opt);

//   const updateRow = (id: string, patch: Partial<Row>) =>
//     setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

//   const clearAll = () => {
//     setRows([]);
//     setFileName("");
//     setSource("");
//     setError("");
//   };

//   /* ---------------------------------- Apply --------------------------------- */

//   const apply = () => {
//     if (!applicable.length) return;
//     if (!confirm(`Update stock for ${applicable.length} item(s)?`)) return;
//     const done = new Set<string>();
//     const errors: string[] = [];
//     for (const r of applicable) {
//       const res = storeService.adjustStock({
//         productId: r.opt!.productId,
//         variantId: r.opt!.variantId,
//         adjustment: r.delta,
//         reason: `Import (${fileName}): ${r.reason || "stock update"}`,
//         performedBy: by,
//       });
//       if (res.success) done.add(r.id);
//       else errors.push(`${r.opt!.label}: ${res.message}`);
//     }
//     setRows((prev) => prev.filter((r) => !done.has(r.id)));
//     setResult({ ok: done.size, errors });
//   };

//   /* --------------------------------- Render --------------------------------- */

//   const btn =
//     "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border border-[#E6E0D8] bg-[#FAF7F0] hover:bg-white disabled:opacity-50";

//   return (
//     <div className="bg-white rounded-xl border border-[#E6E0D8] p-5 shadow-xs space-y-4 text-xs">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h3 className="text-sm font-serif font-bold text-[#292522]">
//             Import stock from Excel or supplier bill
//           </h3>
//           <p className="text-[#766B61] mt-0.5">
//             Upload a file, check the preview, then apply. Nothing changes until
//             you click Apply.
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <button type="button" onClick={downloadTemplate} className={btn}>
//             <Download className="w-4 h-4" /> Template
//           </button>
//           <button
//             type="button"
//             onClick={() => excelRef.current?.click()}
//             disabled={busy}
//             className={btn}
//           >
//             <FileSpreadsheet className="w-4 h-4" />{" "}
//             {busy ? "Reading…" : "Upload Excel / CSV"}
//           </button>
//           <button
//             type="button"
//             onClick={() => billRef.current?.click()}
//             disabled={busy}
//             className={btn}
//           >
//             <FileText className="w-4 h-4" /> Upload bill (PDF / photo)
//           </button>
//         </div>
//         <input
//           ref={excelRef}
//           type="file"
//           hidden
//           accept=".xlsx,.xls,.csv"
//           onChange={(e) => handleFile(e.target.files?.[0], "excel")}
//         />
//         <input
//           ref={billRef}
//           type="file"
//           hidden
//           accept="application/pdf,image/jpeg,image/png,image/webp"
//           onChange={(e) => handleFile(e.target.files?.[0], "bill")}
//         />
//       </div>

//       {error && (
//         <p className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
//           {error}
//         </p>
//       )}

//       {result && (
//         <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-emerald-900 space-y-1">
//           <p className="font-semibold">
//             {result.ok} item(s) updated. See Stock Movement History below.
//           </p>
//           {result.errors.map((m, i) => (
//             <p key={i} className="text-red-700">
//               {m}
//             </p>
//           ))}
//         </div>
//       )}

//       {rows.length > 0 && (
//         <>
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center gap-4">
//               <span className="font-semibold text-[#292522]">
//                 {source === "bill" ? "Bill" : "File"}: {fileName}
//               </span>
//               <label className="flex items-center gap-1.5">
//                 <input
//                   type="radio"
//                   checked={mode === "add"}
//                   onChange={() => setMode("add")}
//                 />
//                 Add to current stock
//               </label>
//               <label className="flex items-center gap-1.5">
//                 <input
//                   type="radio"
//                   checked={mode === "set"}
//                   onChange={() => setMode("set")}
//                 />
//                 Set stock to this number
//               </label>
//             </div>
//             <button
//               type="button"
//               onClick={clearAll}
//               className="flex items-center gap-1 text-[#766B61] hover:text-[#292522]"
//             >
//               <X className="w-3.5 h-3.5" /> Clear
//             </button>
//           </div>

//           {source === "bill" && (
//             <p className="text-[#766B61]">
//               Bill text is read automatically and can be wrong. Check every line
//               and fix the saree colour where needed.
//             </p>
//           )}

//           <div className="overflow-x-auto border border-[#E6E0D8] rounded-lg">
//             <table className="w-full text-left">
//               <thead className="bg-[#FAF7F0] text-[#766B61] font-semibold border-b border-[#E6E0D8]">
//                 <tr>
//                   <th className="p-2.5 w-8"></th>
//                   <th className="p-2.5">From file</th>
//                   <th className="p-2.5 min-w-[260px]">Saree & colour</th>
//                   <th className="p-2.5">Qty</th>
//                   <th className="p-2.5">Stock change</th>
//                   <th className="p-2.5">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#E6E0D8]">
//                 {preview.map((r) => (
//                   <tr key={r.id} className={r.problem ? "bg-amber-50/40" : ""}>
//                     <td className="p-2.5">
//                       <input
//                         type="checkbox"
//                         checked={r.include}
//                         onChange={(e) =>
//                           updateRow(r.id, { include: e.target.checked })
//                         }
//                       />
//                     </td>
//                     <td className="p-2.5">
//                       <span className="font-mono block">{r.sku || "-"}</span>
//                       <span className="text-[#766B61] text-[11px]">
//                         {r.text}
//                       </span>
//                     </td>
//                     <td className="p-2.5">
//                       <select
//                         value={r.variantKey}
//                         onChange={(e) =>
//                           updateRow(r.id, { variantKey: e.target.value })
//                         }
//                         className="w-full p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded"
//                       >
//                         <option value="">— choose —</option>
//                         {options.map((o) => (
//                           <option key={o.key} value={o.key}>
//                             {o.label}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="p-2.5">
//                       <input
//                         type="number"
//                         value={Number.isNaN(r.qty) ? "" : r.qty}
//                         onChange={(e) =>
//                           updateRow(r.id, {
//                             qty:
//                               e.target.value === ""
//                                 ? NaN
//                                 : Number(e.target.value),
//                           })
//                         }
//                         className="w-20 p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded tabular-nums"
//                       />
//                     </td>
//                     <td className="p-2.5 tabular-nums">
//                       {r.opt && !r.problem ? (
//                         <span>
//                           {r.before} → <strong>{r.after}</strong>{" "}
//                           <span
//                             className={
//                               r.delta > 0 ? "text-emerald-700" : "text-red-700"
//                             }
//                           >
//                             ({r.delta > 0 ? `+${r.delta}` : r.delta})
//                           </span>
//                         </span>
//                       ) : (
//                         "-"
//                       )}
//                     </td>
//                     <td className="p-2.5">
//                       {r.problem ? (
//                         <span className="text-amber-800 font-semibold">
//                           {r.problem}
//                         </span>
//                       ) : (
//                         <span className="text-emerald-700 font-semibold">
//                           Ready
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex items-center justify-between">
//             <span className="text-[#766B61]">
//               {applicable.length} of {rows.length} line(s) ready to apply
//             </span>
//             <button
//               type="button"
//               onClick={apply}
//               disabled={!applicable.length}
//               className="px-4 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded disabled:opacity-50"
//             >
//               Apply {applicable.length} change
//               {applicable.length === 1 ? "" : "s"}
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default StockImport;
import React, { useMemo, useRef, useState } from "react";
// @ts-ignore xlsx types may not be installed in every deployment environment.
import * as XLSX from "xlsx";
import { FileSpreadsheet, FileText, Download, X } from "lucide-react";
import type { SareeProduct } from "../../types/index.ts";
import { storeService } from "../../services/storeService.ts";

/* -------------------------------------------------------------------------- */
/* Types & helpers                                                            */
/* -------------------------------------------------------------------------- */

type Mode = "add" | "set";
type FileSource = "excel" | "bill" | "";

interface Row {
  id: string;
  sku: string;
  text: string; // saree name + colour from the sheet / bill
  qty: number; // NaN when invalid
  reason: string;
  variantKey: string; // "productId|variantId" or ''
  include: boolean;
}

interface Option {
  key: string;
  productId: string;
  variantId: string;
  label: string;
  search: string;
  sku: string;
  stock: number;
}

interface ImportResult {
  ok: number;
  errors: string[];
}

interface Props {
  products: SareeProduct[];
  by: string;
  /** Optional: return a Firebase ID token so the bill-reading function can verify the owner. */
  getAuthToken?: () => Promise<string | undefined>;
}

const BILL_URL = import.meta.env.VITE_BILL_PARSER_URL as string | undefined;
const MAX_BILL_MB = 6;

const norm = (s: unknown): string =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const tokens = (s: string): Set<string> =>
  new Set(
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2),
  );

// Accepted column headers (compared after removing spaces and symbols).
const SKU_KEYS = ["sku", "skucode", "itemcode", "code", "variantsku"];
const QTY_KEYS = [
  "quantity",
  "qty",
  "pcs",
  "pieces",
  "units",
  "stock",
  "count",
];
const REASON_KEYS = ["reason", "note", "notes", "remarks", "remark"];
const NAME_KEYS = [
  "name",
  "product",
  "productname",
  "item",
  "itemname",
  "description",
  "sareename",
  "saree",
  "title",
];
const COLOR_KEYS = ["color", "colour", "shade", "variant", "variantname"];

function pick(rec: Record<string, unknown>, names: string[]): string {
  for (const k of Object.keys(rec)) {
    if (names.includes(norm(k))) return String(rec[k] ?? "").trim();
  }
  return "";
}

const toQty = (raw: string): number => {
  const cleaned = raw.replace(/,/g, "").trim();
  return cleaned === "" ? NaN : Number(cleaned);
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = () => reject(new Error("Could not read the file."));
    r.readAsDataURL(file);
  });

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const StockImport: React.FC<Props> = ({ products, by, getAuthToken }) => {
  const excelRef = useRef<HTMLInputElement>(null);
  const billRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>("add");
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [source, setSource] = useState<FileSource>("");
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const options = useMemo<Option[]>(
    () =>
      products.flatMap((p) =>
        p.variants.map((v) => ({
          key: `${p.id}|${v.variantId}`,
          productId: p.id,
          variantId: v.variantId,
          label: `${p.name} — ${v.colorName} (${v.sku})`,
          search: `${p.name} ${v.colorName}`,
          sku: v.sku,
          stock: v.inventoryStock,
        })),
      ),
    [products],
  );

  const optMap = useMemo(
    () => new Map(options.map((o) => [o.key, o])),
    [options],
  );
  const skuMap = useMemo(
    () => new Map(options.map((o) => [norm(o.sku), o.key])),
    [options],
  );

  /** SKU match first; otherwise a name + colour match that must be clearly the best. */
  const matchVariant = (sku: string, text: string): string => {
    if (sku && skuMap.has(norm(sku))) return skuMap.get(norm(sku))!;
    const t = tokens(text);
    if (t.size === 0) return "";
    let best = "";
    let bestScore = 0;
    let second = 0;
    for (const o of options) {
      const ot = tokens(o.search);
      let score = 0;
      t.forEach((w) => {
        if (ot.has(w)) score++;
      });
      if (score > bestScore) {
        second = bestScore;
        bestScore = score;
        best = o.key;
      } else if (score > second) {
        second = score;
      }
    }
    return bestScore >= 2 && bestScore > second ? best : "";
  };

  const makeRow = (
    i: number,
    sku: string,
    text: string,
    qtyRaw: string,
    reason: string,
  ): Row => ({
    id: `${Date.now()}-${i}`,
    sku,
    text,
    qty: toQty(qtyRaw),
    reason,
    variantKey: matchVariant(sku, text),
    include: true,
  });

  /* ------------------------------ File readers ------------------------------ */

  const readExcel = async (file: File): Promise<Row[]> => {
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    if (!ws) throw new Error("The file has no sheet.");
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
    });
    const out: Row[] = [];
    json.forEach((rec, i) => {
      const sku = pick(rec, SKU_KEYS);
      const name = `${pick(rec, NAME_KEYS)} ${pick(rec, COLOR_KEYS)}`.trim();
      const qty = pick(rec, QTY_KEYS);
      if (!sku && !name && !qty) return; // blank line
      out.push(makeRow(i, sku, name, qty, pick(rec, REASON_KEYS)));
    });
    if (!out.length) {
      throw new Error(
        "No rows found. Use columns named SKU and Quantity (download the template).",
      );
    }
    return out;
  };

  const readBill = async (file: File): Promise<Row[]> => {
    if (!BILL_URL) {
      throw new Error(
        "Bill reading is not set up yet. Deploy the parseBill function and set VITE_BILL_PARSER_URL in .env.",
      );
    }
    if (file.size > MAX_BILL_MB * 1024 * 1024) {
      throw new Error(`Bill is too large. Maximum size is ${MAX_BILL_MB} MB.`);
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = await getAuthToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(BILL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        mimeType: file.type,
        data: await fileToBase64(file),
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(data?.lines)) {
      throw new Error(
        data?.error || `Could not read the bill (HTTP ${res.status}).`,
      );
    }
    const out: Row[] = (data.lines as any[]).map((l, i) =>
      makeRow(
        i,
        String(l.sku ?? ""),
        String(l.description ?? ""),
        String(l.quantity ?? ""),
        "Supplier bill",
      ),
    );
    if (!out.length) throw new Error("No items were found on this bill.");
    return out;
  };

  const handleFile = async (file: File | undefined, kind: "excel" | "bill") => {
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const parsed =
        kind === "excel" ? await readExcel(file) : await readBill(file);
      setRows(parsed);
      setFileName(file.name);
      setSource(kind);
      if (kind === "bill") setMode("add"); // a supplier bill means new stock arrived
    } catch (e: any) {
      setRows([]);
      setSource("");
      setError(e?.message || "Could not read this file.");
    } finally {
      setBusy(false);
      if (excelRef.current) excelRef.current.value = "";
      if (billRef.current) billRef.current.value = "";
    }
  };

  /** Template lists every saree colour with its real SKU. Owner only fills Quantity. */
  const downloadTemplate = () => {
    const aoa: (string | number)[][] = [
      ["SKU", "Saree Name", "Colour", "Quantity", "Reason"],
    ];
    products.forEach((p) =>
      p.variants.forEach((v) =>
        aoa.push([v.sku, p.name, v.colorName, "", "New shipment from weaver"]),
      ),
    );
    if (aoa.length === 1) {
      aoa.push(["KFS-SILK-101", "Example Saree", "Red", 10, "Example row"]);
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [
      { wch: 18 },
      { wch: 42 },
      { wch: 24 },
      { wch: 10 },
      { wch: 34 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    XLSX.writeFile(wb, "stock-import-template.xlsx");
  };

  /* --------------------------------- Preview -------------------------------- */

  const preview = useMemo(() => {
    const running = new Map(options.map((o) => [o.key, o.stock]));
    return rows.map((r) => {
      const opt = optMap.get(r.variantKey);
      let problem = "";
      let before = 0;
      let after = 0;
      let delta = 0;
      if (!Number.isInteger(r.qty)) problem = "Invalid quantity";
      else if (!opt) problem = "Choose the saree colour";
      else {
        before = running.get(opt.key) ?? 0;
        if (mode === "set" && r.qty < 0) problem = "Stock cannot be negative";
        else if (mode === "add" && r.qty === 0) problem = "Quantity is 0";
        else {
          delta = mode === "add" ? r.qty : r.qty - before;
          if (delta === 0) problem = "No change";
          else if (before + delta < 0) problem = "Would make stock negative";
          else after = before + delta;
        }
      }
      if (!problem && r.include && opt) running.set(opt.key, after);
      return { ...r, opt, before, after, delta, problem };
    });
  }, [rows, mode, options, optMap]);

  const applicable = preview.filter((r) => r.include && !r.problem && r.opt);

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const clearAll = () => {
    setRows([]);
    setFileName("");
    setSource("");
    setError("");
  };

  /* ---------------------------------- Apply --------------------------------- */

  const apply = () => {
    if (!applicable.length) return;
    if (!confirm(`Update stock for ${applicable.length} item(s)?`)) return;
    const done = new Set<string>();
    const errors: string[] = [];
    for (const r of applicable) {
      const res = storeService.adjustStock({
        productId: r.opt!.productId,
        variantId: r.opt!.variantId,
        adjustment: r.delta,
        reason: `Import (${fileName}): ${r.reason || "stock update"}`,
        performedBy: by,
      });
      if (res.success) done.add(r.id);
      else errors.push(`${r.opt!.label}: ${res.message}`);
    }
    setRows((prev) => prev.filter((r) => !done.has(r.id)));
    setResult({ ok: done.size, errors });
  };

  /* --------------------------------- Render --------------------------------- */

  const btn =
    "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border border-[#E6E0D8] bg-[#FAF7F0] hover:bg-white disabled:opacity-50";

  return (
    <div className="bg-white rounded-xl border border-[#E6E0D8] p-5 shadow-xs space-y-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-serif font-bold text-[#292522]">
            Import stock from Excel or supplier bill
          </h3>
          <p className="text-[#766B61] mt-0.5">
            Download the template, fill in Quantity, upload it, check the
            preview, then apply. Nothing changes until you click Apply.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={downloadTemplate} className={btn}>
            <Download className="w-4 h-4" /> Template
          </button>
          <button
            type="button"
            onClick={() => excelRef.current?.click()}
            disabled={busy}
            className={btn}
          >
            <FileSpreadsheet className="w-4 h-4" />{" "}
            {busy ? "Reading…" : "Upload Excel / CSV"}
          </button>
          <button
            type="button"
            onClick={() => billRef.current?.click()}
            disabled={busy}
            className={btn}
          >
            <FileText className="w-4 h-4" /> Upload bill (PDF / photo)
          </button>
        </div>
        <input
          ref={excelRef}
          type="file"
          hidden
          accept=".xlsx,.xls,.csv"
          onChange={(e) => handleFile(e.target.files?.[0], "excel")}
        />
        <input
          ref={billRef}
          type="file"
          hidden
          accept="application/pdf,image/jpeg,image/png,image/webp"
          onChange={(e) => handleFile(e.target.files?.[0], "bill")}
        />
      </div>

      {error && (
        <p className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-emerald-900 space-y-1">
          <p className="font-semibold">
            {result.ok} item(s) updated. See Stock Movement History below.
          </p>
          {result.errors.map((m, i) => (
            <p key={i} className="text-red-700">
              {m}
            </p>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-[#292522]">
                {source === "bill" ? "Bill" : "File"}: {fileName}
              </span>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={mode === "add"}
                  onChange={() => setMode("add")}
                />
                Add to current stock
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={mode === "set"}
                  onChange={() => setMode("set")}
                />
                Set stock to this number
              </label>
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-[#766B61] hover:text-[#292522]"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          {source === "bill" && (
            <p className="text-[#766B61]">
              Bill text is read automatically and can be wrong. Check every line
              and fix the saree colour where needed.
            </p>
          )}

          <div className="overflow-x-auto border border-[#E6E0D8] rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-[#FAF7F0] text-[#766B61] font-semibold border-b border-[#E6E0D8]">
                <tr>
                  <th className="p-2.5 w-8"></th>
                  <th className="p-2.5">From file</th>
                  <th className="p-2.5 min-w-[260px]">Saree & colour</th>
                  <th className="p-2.5">Qty</th>
                  <th className="p-2.5">Stock change</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D8]">
                {preview.map((r) => (
                  <tr key={r.id} className={r.problem ? "bg-amber-50/40" : ""}>
                    <td className="p-2.5">
                      <input
                        type="checkbox"
                        checked={r.include}
                        onChange={(e) =>
                          updateRow(r.id, { include: e.target.checked })
                        }
                      />
                    </td>
                    <td className="p-2.5">
                      <span className="font-mono block">{r.sku || "-"}</span>
                      <span className="text-[#766B61] text-[11px]">
                        {r.text}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <select
                        value={r.variantKey}
                        onChange={(e) =>
                          updateRow(r.id, { variantKey: e.target.value })
                        }
                        className="w-full p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded"
                      >
                        <option value="">— choose —</option>
                        {options.map((o) => (
                          <option key={o.key} value={o.key}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        value={Number.isNaN(r.qty) ? "" : r.qty}
                        onChange={(e) =>
                          updateRow(r.id, {
                            qty:
                              e.target.value === ""
                                ? NaN
                                : Number(e.target.value),
                          })
                        }
                        className="w-20 p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded tabular-nums"
                      />
                    </td>
                    <td className="p-2.5 tabular-nums">
                      {r.opt && !r.problem ? (
                        <span>
                          {r.before} → <strong>{r.after}</strong>{" "}
                          <span
                            className={
                              r.delta > 0 ? "text-emerald-700" : "text-red-700"
                            }
                          >
                            ({r.delta > 0 ? `+${r.delta}` : r.delta})
                          </span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2.5">
                      {r.problem ? (
                        <span className="text-amber-800 font-semibold">
                          {r.problem}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">
                          Ready
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#766B61]">
              {applicable.length} of {rows.length} line(s) ready to apply
            </span>
            <button
              type="button"
              onClick={apply}
              disabled={!applicable.length}
              className="px-4 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white font-semibold rounded disabled:opacity-50"
            >
              Apply {applicable.length} change
              {applicable.length === 1 ? "" : "s"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StockImport;
