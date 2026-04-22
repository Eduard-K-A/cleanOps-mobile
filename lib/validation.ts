/**
 * Simplistic 16-digit check for mockup purposes (Luhn removed)
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s+/g, '');
  return /^\d{16}$/.test(digits);
}

/**
 * Validates card expiry in MM/YY format
 */
export function isValidExpiry(expiry: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

  const [month, year] = expiry.split('/').map(n => parseInt(n));
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = parseInt(now.getFullYear().toString().slice(-2));

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

/**
 * Validates CVC (3 or 4 digits)
 */
export function isValidCVC(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc);
}

/**
 * Validates Philippine mobile number for GCash/Maya
 * Since prefix is +63, we expect exactly 10 digits starting with 9
 */
export function isValidPHMobile(phone: string): boolean {
  const digits = phone.replace(/\s+/g, '');
  return /^9\d{9}$/.test(digits);
}

/**
 * Validates cardholder name (min 3 chars, letters/spaces only)
 */
export function isValidCardholder(name: string): boolean {
  return /^[a-zA-Z\s-]{3,}$/.test(name.trim());
}

/**
 * Validates address: length > 15, contains at least one number,
 * and a common street keyword (St, Ave, Blvd, Brgy, etc.)
 */
export function isStrictAddress(address: string): boolean {
  const trimmed = address.trim();
  const hasNumber = /\d/.test(trimmed);
  const hasStreetKeyword = /\b(st|ave|blvd|rd|ln|dr|ct|way|brgy|village|road|street|avenue|boulevard)\b/i.test(trimmed);
  return trimmed.length >= 15 && hasNumber && hasStreetKeyword;
}

/**
 * Validates distance is between 0.5km and 60.0km
 */
export function isValidDistance(distance: string): boolean {
  const d = parseFloat(distance);
  return !isNaN(d) && d >= 0.5 && d <= 60.0;
}

/**
 * Formats card number with spaces every 4 digits
 */
export function formatCardNumber(val: string): string {
  const digits = val.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Formats expiry with a slash
 */
export function formatExpiry(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2, 4);
  }
  return digits;
}
