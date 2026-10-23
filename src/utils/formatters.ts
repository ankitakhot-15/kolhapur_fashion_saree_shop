export function formatPriceINR(paise: number): string {
  const rupees = Math.round(paise / 100);
  return '₹' + rupees.toLocaleString('en-IN');
}

export function calculateDiscountPercent(originalPaise: number, sellingPaise: number): number {
  if (originalPaise <= sellingPaise || originalPaise === 0) return 0;
  return Math.round(((originalPaise - sellingPaise) / originalPaise) * 100);
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}
