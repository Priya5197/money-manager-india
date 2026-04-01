/**
 * Format utilities for Money Manager India
 * All functions follow Indian formatting standards
 */

/**
 * Format number as Indian Rupees with proper comma separation
 * Examples: 1000 => ₹1,000.00, 125000 => ₹1,25,000.00
 */
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "₹0.00";
  }

  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;

  // Format with 2 decimal places
  const formatted = absAmount.toFixed(2);
  const [integerPart, decimalPart] = formatted.split(".");

  // Convert integer part to array of digits
  const digits = integerPart.split("").reverse();

  // Apply Indian numbering: first 3 digits, then pairs of digits
  const groups = [];
  for (let i = 0; i < digits.length; i++) {
    if (i === 3) {
      // After first 3 digits (from right), add first comma
      groups.push(",");
    } else if (i > 3 && (i - 3) % 2 === 0) {
      // Every 2 digits after the first comma, add another comma
      groups.push(",");
    }
    groups.push(digits[i]);
  }

  const indianFormatted = groups.reverse().join("");
  const result = `₹${indianFormatted}.${decimalPart}`;

  return isNegative ? `-${result}` : result;
}

/**
 * Format amount as simple number string without currency
 * Examples: 1000 => "1,00,000", 125000 => "1,25,000"
 */
export function formatIndianNumber(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "0";
  }

  const absAmount = Math.abs(amount);
  const integerPart = Math.floor(absAmount).toString();
  const decimalPart =
    amount % 1 > 0 ? "." + amount.toString().split(".")[1] : "";

  const digits = integerPart.split("").reverse();
  const groups = [];

  for (let i = 0; i < digits.length; i++) {
    if (i === 3) {
      groups.push(",");
    } else if (i > 3 && (i - 3) % 2 === 0) {
      groups.push(",");
    }
    groups.push(digits[i]);
  }

  return (amount < 0 ? "-" : "") + groups.reverse().join("") + decimalPart;
}

/**
 * Format date as Indian standard (DD/MM/YYYY)
 * Examples: "2024-03-31" => "31/03/2024"
 */
export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  } catch {
    return "Invalid date";
  }
}

/**
 * Format date as localized string (e.g., "31 Mar 2024")
 */
export function formatDateLong(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    return dateObj.toLocaleDateString("en-IN", options);
  } catch {
    return "Invalid date";
  }
}

/**
 * Format percentage with optional decimal places
 * Examples: 15.5 => "15.5%", 15 => "15%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(decimals)}%`;
}

/**
 * Format month name with year
 * Examples: 3, 2024 => "Mar 2024"
 */
export function formatMonth(month: number, year: number): string {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (month < 1 || month > 12) {
    return "Invalid month";
  }

  return `${monthNames[month - 1]} ${year}`;
}

/**
 * Format financial year (FY)
 * Examples: 2024 => "FY 2024-25"
 */
export function formatFinancialYear(year: number): string {
  const nextYear = year + 1;
  return `FY ${year}-${String(nextYear).slice(-2)}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }
  return text.slice(0, length) + "...";
}

/**
 * Format phone number (Indian format)
 * Examples: "9876543210" => "+91 98765 43210"
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    const number = cleaned.slice(2);
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
  }

  return phone;
}

/**
 * Format time in HH:MM format
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Format datetime as "31 Mar 2024, 10:30 AM"
 */
export function formatDateTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const dateStr = formatDateLong(dateObj);
    const timeStr = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateStr}, ${timeStr}`;
  } catch {
    return "Invalid date";
  }
}

/**
 * Format large numbers with abbreviations
 * Examples: 1000 => "1K", 1000000 => "10L" (Indian system)
 */
export function formatCompactINR(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;

  let formatted = "";

  if (absAmount >= 10000000) {
    // Crores (Cr)
    formatted = `₹${(absAmount / 10000000).toFixed(1)}Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs (L)
    formatted = `₹${(absAmount / 100000).toFixed(1)}L`;
  } else if (absAmount >= 1000) {
    // Thousands (K)
    formatted = `₹${(absAmount / 1000).toFixed(1)}K`;
  } else {
    formatted = `₹${absAmount.toFixed(0)}`;
  }

  return isNegative ? `-${formatted}` : formatted;
}
