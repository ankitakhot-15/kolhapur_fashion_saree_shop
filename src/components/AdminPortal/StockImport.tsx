// // export default StockImport;
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

// interface Row {
//   id: string;
//   sku: string;
//   text: string; // saree name + colour from the sheet / bill
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

// // Accepted column headers (compared after removing spaces and symbols).
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
// const NAME_KEYS = [
//   "name",
//   "product",
//   "productname",
//   "item",
//   "itemname",
//   "description",
//   "sareename",
//   "saree",
//   "title",
// ];
// const COLOR_KEYS = ["color", "colour", "shade", "variant", "variantname"];

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

//   /** SKU match first; otherwise a name + colour match that must be clearly the best. */
//   const matchVariant = (sku: string, text: string): string => {
//     if (sku && skuMap.has(norm(sku))) return skuMap.get(norm(sku))!;
//     const t = tokens(text);
//     if (t.size === 0) return "";
//     let best = "";
//     let bestScore = 0;
//     let second = 0;
//     for (const o of options) {
//       const ot = tokens(o.search);
//       let score = 0;
//       t.forEach((w) => {
//         if (ot.has(w)) score++;
//       });
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

//   const readExcel = async (file: File): Promise<Row[]> => {
//     const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
//     const ws = wb.Sheets[wb.SheetNames[0]];
//     if (!ws) throw new Error("The file has no sheet.");
//     const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
//       defval: "",
//     });
//     const out: Row[] = [];
//     json.forEach((rec, i) => {
//       const sku = pick(rec, SKU_KEYS);
//       const name = `${pick(rec, NAME_KEYS)} ${pick(rec, COLOR_KEYS)}`.trim();
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

//   const readBill = async (file: File): Promise<Row[]> => {
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

//   /** Template lists every saree colour with its real SKU. Owner only fills Quantity. */
//   const downloadTemplate = () => {
//     const aoa: (string | number)[][] = [
//       ["SKU", "Saree Name", "Colour", "Quantity", "Reason"],
//     ];
//     products.forEach((p) =>
//       p.variants.forEach((v) =>
//         aoa.push([v.sku, p.name, v.colorName, "", "New shipment from weaver"]),
//       ),
//     );
//     if (aoa.length === 1) {
//       aoa.push(["KFS-SILK-101", "Example Saree", "Red", 10, "Example row"]);
//     }
//     const ws = XLSX.utils.aoa_to_sheet(aoa);
//     ws["!cols"] = [
//       { wch: 18 },
//       { wch: 42 },
//       { wch: 24 },
//       { wch: 10 },
//       { wch: 34 },
//     ];
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
//             Download the template, fill in Quantity, upload it, check the
//             preview, then apply. Nothing changes until you click Apply.
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
//             <div className="flex flex-wrap items-center gap-4">
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

//============================
import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { SareeProduct } from "../../types/index.ts";
import { storeService } from "../../services/storeService.ts";

interface StockImportProps {
  products: SareeProduct[];
  by: string;
}

type Mode = "add" | "set";

interface VariantOption {
  key: string; // productId||variantId
  productId: string;
  variantId: string;
  productName: string;
  colorName: string;
  sku: string;
  stock: number;
  label: string;
}

interface ImportRow {
  id: number;
  rowNo: number;
  rawName: string;
  rawColor: string;
  rawSku: string;
  qty: number | null;
  key: string; // selected variant key ("" = not matched)
  note: string;
}

const NAME_HEADERS = [
  "saree name",
  "sareename",
  "saree",
  "name",
  "product",
  "product name",
  "item",
  "item name",
  "particulars",
  "description",
];
const QTY_HEADERS = [
  "quantity",
  "qty",
  "stock",
  "pieces",
  "pcs",
  "units",
  "count",
  "nos",
  "no",
];
const COLOR_HEADERS = [
  "color",
  "colour",
  "color name",
  "colour name",
  "shade",
  "variant",
];
const SKU_HEADERS = ["sku", "code", "item code", "product code"];

const norm = (s: unknown) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const findHeader = (headers: string[], aliases: string[]) => {
  const normalized = headers.map((h) => ({ raw: h, n: norm(h) }));
  // exact alias match first, then "contains"
  for (const a of aliases) {
    const hit = normalized.find((h) => h.n === a);
    if (hit) return hit.raw;
  }
  for (const a of aliases) {
    const hit = normalized.find((h) => h.n.includes(a));
    if (hit) return hit.raw;
  }
  return "";
};

const parseQty = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(String(v).replace(/,/g, "").trim());
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
};

const StockImport: React.FC<StockImportProps> = ({ products, by }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [mode, setMode] = useState<Mode>("add");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ ok: number; failed: string[] } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  const options: VariantOption[] = useMemo(
    () =>
      products.flatMap((p) =>
        p.variants.map((v) => ({
          key: `${p.id}||${v.variantId}`,
          productId: p.id,
          variantId: v.variantId,
          productName: p.name,
          colorName: v.colorName,
          sku: v.sku,
          stock: v.inventoryStock,
          label: `${p.name} — ${v.colorName} (${v.sku})`,
        })),
      ),
    [products],
  );

  const optionByKey = useMemo(() => {
    const m = new Map<string, VariantOption>();
    options.forEach((o) => m.set(o.key, o));
    return m;
  }, [options]);

  /* ---------- Matching ---------- */
  const matchRow = (
    rawName: string,
    rawColor: string,
    rawSku: string,
  ): { key: string; note: string } => {
    // 1. SKU
    if (rawSku) {
      const hit = options.find((o) => norm(o.sku) === norm(rawSku));
      if (hit) return { key: hit.key, note: "" };
    }

    const n = norm(rawName);
    const c = norm(rawColor);
    if (!n) return { key: "", note: "Saree name is empty" };

    // 2. Name that already contains the colour: "Paithani Silk - Red"
    const combined = options.filter(
      (o) => norm(`${o.productName} ${o.colorName}`) === n,
    );
    if (combined.length === 1) return { key: combined[0].key, note: "" };

    // 3. Product by name (exact, then partial)
    let productIds = [
      ...new Set(
        options
          .filter((o) => norm(o.productName) === n)
          .map((o) => o.productId),
      ),
    ];
    if (productIds.length === 0) {
      productIds = [
        ...new Set(
          options
            .filter((o) => {
              const pn = norm(o.productName);
              return pn.includes(n) || n.includes(pn);
            })
            .map((o) => o.productId),
        ),
      ];
    }
    if (productIds.length === 0)
      return { key: "", note: "Saree not found - pick it manually" };
    if (productIds.length > 1)
      return { key: "", note: "Matches several sarees - pick one" };

    const variants = options.filter((o) => o.productId === productIds[0]);

    // 4. Choose the colour variant
    if (c) {
      const byColor =
        variants.find((v) => norm(v.colorName) === c) ||
        variants.filter(
          (v) => norm(v.colorName).includes(c) || c.includes(norm(v.colorName)),
        )[0];
      if (byColor) return { key: byColor.key, note: "" };
      return {
        key: "",
        note: `Colour "${rawColor}" not found - pick manually`,
      };
    }
    if (variants.length === 1) return { key: variants[0].key, note: "" };
    return { key: "", note: "Has several colours - pick the colour" };
  };

  /* ---------- File reading ---------- */
  const handleFile = async (file: File) => {
    setError("");
    setResult(null);
    setRows([]);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      if (!sheet) throw new Error("The file has no sheets.");

      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
        raw: true,
      });
      if (json.length === 0) throw new Error("The sheet is empty.");

      const headers = Object.keys(json[0]);
      const nameCol = findHeader(headers, NAME_HEADERS);
      const qtyCol = findHeader(headers, QTY_HEADERS);
      const colorCol = findHeader(headers, COLOR_HEADERS);
      const skuCol = findHeader(headers, SKU_HEADERS);

      if (!nameCol || !qtyCol) {
        throw new Error(
          `Could not find the columns. Your headers are: ${headers.join(
            ", ",
          )}. The file needs a "Saree Name" column and a "Quantity" column.`,
        );
      }

      const parsed: ImportRow[] = [];
      json.forEach((r, i) => {
        const rawName = String(r[nameCol] ?? "").trim();
        const rawQty = r[qtyCol];
        const rawColor = colorCol ? String(r[colorCol] ?? "").trim() : "";
        const rawSku = skuCol ? String(r[skuCol] ?? "").trim() : "";

        // skip completely blank lines
        if (!rawName && !rawSku && (rawQty === "" || rawQty == null)) return;

        const qty = parseQty(rawQty);
        const m = matchRow(rawName, rawColor, rawSku);
        parsed.push({
          id: i,
          rowNo: i + 2, // +1 header, +1 to be 1-based like Excel
          rawName,
          rawColor,
          rawSku,
          qty,
          key: m.key,
          note: qty === null ? "Quantity is not a whole number" : m.note,
        });
      });

      if (parsed.length === 0) throw new Error("No data rows found.");
      setRows(parsed);
    } catch (e: any) {
      setError(e?.message || "Could not read this file.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  /* ---------- Row validation ---------- */
  const rowProblem = (r: ImportRow): string => {
    if (r.qty === null) return "Quantity is not a whole number";
    if (mode === "add" && r.qty <= 0) return "Quantity must be more than 0";
    if (mode === "set" && r.qty < 0) return "Quantity cannot be negative";
    if (!r.key || !optionByKey.has(r.key))
      return r.note || "Select which saree/colour this is";
    return "";
  };

  const readyRows = rows.filter((r) => !rowProblem(r));
  const problemRows = rows.length - readyRows.length;

  const setRowKey = (id: number, key: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, key } : r)));

  const removeRow = (id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  /* ---------- Apply to inventory ---------- */
  const handleApply = async () => {
    if (readyRows.length === 0) return;

    // Combine duplicate rows of the same saree+colour
    const totals = new Map<string, number>();
    readyRows.forEach((r) => {
      const prev = totals.get(r.key) ?? 0;
      totals.set(
        r.key,
        mode === "add" ? prev + (r.qty as number) : (r.qty as number),
      );
    });

    setBusy(true);
    let ok = 0;
    const failed: string[] = [];

    for (const [key, qty] of totals) {
      const opt = optionByKey.get(key);
      if (!opt) continue;

      const adjustment = mode === "add" ? qty : qty - opt.stock;
      if (adjustment === 0) {
        ok++;
        continue;
      }

      try {
        const res = storeService.adjustStock({
          productId: opt.productId,
          variantId: opt.variantId,
          adjustment,
          reason:
            mode === "add"
              ? `Excel stock import: ${fileName}`
              : `Excel stock set to ${qty}: ${fileName}`,
          performedBy: by,
        });
        // adjustStock may be sync or async
        const out = await Promise.resolve(res);
        if (out && out.success === false) {
          failed.push(`${opt.label}: ${out.message}`);
        } else {
          ok++;
        }
      } catch (e: any) {
        failed.push(`${opt.label}: ${e?.message || "failed"}`);
      }
    }

    setBusy(false);
    setResult({ ok, failed });
    if (failed.length === 0) {
      setRows([]);
      setFileName("");
    }
  };

  const downloadTemplate = () => {
    const sample =
      products.length > 0
        ? products.slice(0, 3).map((p) => ({
            "Saree Name": p.name,
            Colour: p.variants[0]?.colorName ?? "",
            Quantity: 5,
          }))
        : [
            {
              "Saree Name": "Royal Paithani Silk",
              Colour: "Royal Purple",
              Quantity: 5,
            },
          ];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    XLSX.writeFile(wb, "stock-import-template.xlsx");
  };

  /* ---------- UI ---------- */
  return (
    <div className="bg-white rounded-xl border border-[#E6E0D8] p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-serif font-bold text-[#292522]">
            Import Stock from Excel
          </h3>
          <p className="text-xs text-[#766B61] mt-0.5">
            Columns needed: <b>Saree Name</b> and <b>Quantity</b>. Optional:{" "}
            <b>Colour</b> and <b>SKU</b> (use these when a saree has many
            colours).
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={downloadTemplate}
            className="px-3 py-2 border border-[#E6E0D8] rounded text-xs font-semibold text-[#292522] hover:bg-[#FAF7F0] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Template
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white rounded text-xs font-semibold flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Excel
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      </div>

      {error && (
        <p className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {result && (
        <div
          className={`rounded border p-2 text-xs space-y-1 ${
            result.failed.length
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          <p className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            {result.ok} item(s) updated in inventory.
          </p>
          {result.failed.map((f, i) => (
            <p key={i}>• {f}</p>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-[#766B61] truncate">
              <b className="text-[#292522]">{fileName}</b> · {readyRows.length}{" "}
              ready
              {problemRows > 0 && (
                <span className="text-amber-700">
                  {" "}
                  · {problemRows} need attention
                </span>
              )}
            </span>
            <div className="flex rounded border border-[#E6E0D8] overflow-hidden shrink-0">
              {(["add", "set"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 font-semibold ${
                    mode === m
                      ? "bg-[#641D32] text-white"
                      : "bg-white text-[#292522] hover:bg-[#FAF7F0]"
                  }`}
                >
                  {m === "add" ? "Add to existing stock" : "Set exact stock"}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E6E0D8] rounded-lg">
            <table className="w-full text-xs text-left min-w-[640px]">
              <thead className="bg-[#FAF7F0] text-[#766B61] font-semibold border-b border-[#E6E0D8]">
                <tr>
                  <th className="p-2.5">Row</th>
                  <th className="p-2.5">From Excel</th>
                  <th className="p-2.5">Qty</th>
                  <th className="p-2.5">Goes to (inventory)</th>
                  <th className="p-2.5">New stock</th>
                  <th className="p-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D8]">
                {rows.map((r) => {
                  const problem = rowProblem(r);
                  const opt = r.key ? optionByKey.get(r.key) : undefined;
                  const newStock =
                    opt && r.qty !== null && !problem
                      ? mode === "add"
                        ? opt.stock + r.qty
                        : r.qty
                      : null;
                  return (
                    <tr
                      key={r.id}
                      className={
                        problem ? "bg-amber-50/60" : "hover:bg-[#FAF7F0]/60"
                      }
                    >
                      <td className="p-2.5 text-[#766B61]">{r.rowNo}</td>
                      <td className="p-2.5">
                        <span className="font-semibold text-[#292522] block">
                          {r.rawName || "—"}
                        </span>
                        {(r.rawColor || r.rawSku) && (
                          <span className="text-[11px] text-[#766B61]">
                            {[r.rawColor, r.rawSku].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-bold tabular-nums">
                        {r.qty ?? "—"}
                      </td>
                      <td className="p-2.5">
                        <select
                          value={r.key}
                          onChange={(e) => setRowKey(r.id, e.target.value)}
                          className="w-full p-1.5 bg-[#FAF7F0] border border-[#E6E0D8] rounded text-xs"
                        >
                          <option value="">— select saree / colour —</option>
                          {options.map((o) => (
                            <option key={o.key} value={o.key}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        {problem && (
                          <span className="text-[11px] text-amber-800 block mt-0.5">
                            {problem}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 tabular-nums">
                        {newStock !== null ? (
                          <span className="text-emerald-700 font-bold">
                            {opt!.stock} → {newStock}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => removeRow(r.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Skip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setRows([]);
                setFileName("");
              }}
              className="px-4 py-2 border border-[#E6E0D8] rounded text-xs font-medium hover:bg-[#FAF7F0]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy || readyRows.length === 0}
              onClick={handleApply}
              className="flex-1 py-2 bg-[#641D32] hover:bg-[#4A1223] text-white text-xs font-semibold rounded disabled:opacity-50"
            >
              {busy
                ? "Updating inventory…"
                : `Add ${readyRows.length} item(s) to Inventory`}
            </button>
          </div>
          {problemRows > 0 && (
            <p className="text-[11px] text-[#766B61]">
              Rows that need attention are skipped unless you choose the correct
              saree for them in the dropdown.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StockImport;
