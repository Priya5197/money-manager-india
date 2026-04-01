/**
 * CSV Import utilities
 * Handles parsing and validation of imported CSV files
 */

import Papa from "papaparse";

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: ImportError[];
  summary: {
    total: number;
    imported: number;
    failed: number;
  };
}

export interface ImportError {
  row: number;
  column: string;
  message: string;
  value: unknown;
}

export interface TransactionImport {
  date: string;
  category: string;
  type: "expense" | "income" | "transfer";
  amount: number;
  description?: string;
  paymentMethod?: string;
}

export interface SalaryImport {
  year: number;
  salary: number;
  bonus?: number;
}

/**
 * Parse CSV file and return raw data
 */
export async function parseCSVFile(
  file: File
): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      error: (error) => reject(error),
      complete: (results) => resolve(results.data as Record<string, unknown>[]),
    });
  });
}

/**
 * Parse transaction CSV and validate data
 */
export async function parseTransactionCSV(
  file: File
): Promise<ImportResult<TransactionImport>> {
  const errors: ImportError[] = [];
  const importedTransactions: TransactionImport[] = [];

  try {
    const rawData = await parseCSVFile(file);

    // Column mapping (adjust based on common formats)
    const columnMap = {
      date: ["date", "transaction_date", "trans_date", "d"],
      category: ["category", "cat", "type"],
      type: ["type", "transaction_type", "t"],
      amount: ["amount", "amt", "value", "a"],
      description: ["description", "desc", "note"],
      paymentMethod: ["payment_method", "method", "mode"],
    };

    for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
      const row = rawData[rowIndex];
      const rowErrors: ImportError[] = [];

      // Find matching columns (case-insensitive)
      const rowKeys = Object.keys(row).map((k) => k.toLowerCase());

      // Extract and validate date
      const dateKey = findMatchingColumn(rowKeys, columnMap.date);
      const dateValue = dateKey ? row[dateKey] : null;
      const parsedDate = parseDate(String(dateValue));

      if (!parsedDate) {
        rowErrors.push({
          row: rowIndex + 1,
          column: "date",
          message: "Invalid date format. Use YYYY-MM-DD",
          value: dateValue,
        });
      }

      // Extract and validate category
      const categoryKey = findMatchingColumn(rowKeys, columnMap.category);
      const category = categoryKey
        ? String(row[categoryKey]).trim()
        : "";

      if (!category) {
        rowErrors.push({
          row: rowIndex + 1,
          column: "category",
          message: "Category is required",
          value: category,
        });
      }

      // Extract and validate type
      const typeKey = findMatchingColumn(rowKeys, columnMap.type);
      const typeValue = typeKey ? String(row[typeKey]).toLowerCase().trim() : "";
      const validType = ["expense", "income", "transfer"].includes(typeValue)
        ? (typeValue as TransactionImport["type"])
        : null;

      if (!validType) {
        rowErrors.push({
          row: rowIndex + 1,
          column: "type",
          message:
            "Type must be 'expense', 'income', or 'transfer'",
          value: typeValue,
        });
      }

      // Extract and validate amount
      const amountKey = findMatchingColumn(rowKeys, columnMap.amount);
      const amountValue = amountKey ? row[amountKey] : null;
      const amount = parseAmount(amountValue);

      if (amount === null || amount <= 0) {
        rowErrors.push({
          row: rowIndex + 1,
          column: "amount",
          message: "Amount must be a positive number",
          value: amountValue,
        });
      }

      // Extract optional fields
      const descriptionKey = findMatchingColumn(
        rowKeys,
        columnMap.description
      );
      const description = descriptionKey
        ? String(row[descriptionKey]).trim()
        : undefined;

      const paymentMethodKey = findMatchingColumn(
        rowKeys,
        columnMap.paymentMethod
      );
      const paymentMethod = paymentMethodKey
        ? String(row[paymentMethodKey]).trim()
        : undefined;

      // Add errors and continue if critical fields failed
      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        continue;
      }

      // Add successful transaction
      if (parsedDate && validType && amount !== null) {
        importedTransactions.push({
          date: parsedDate,
          category,
          type: validType,
          amount,
          description: description && description.length > 0 ? description : undefined,
          paymentMethod:
            paymentMethod && paymentMethod.length > 0
              ? paymentMethod
              : undefined,
        });
      }
    }

    return {
      success: errors.length === 0,
      data: importedTransactions,
      errors,
      summary: {
        total: rawData.length,
        imported: importedTransactions.length,
        failed: errors.length,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          column: "file",
          message: `Failed to parse CSV: ${errorMessage}`,
          value: file.name,
        },
      ],
      summary: {
        total: 0,
        imported: 0,
        failed: 1,
      },
    };
  }
}

/**
 * Parse salary CSV and validate data
 */
export async function parseSalaryCSV(
  file: File
): Promise<ImportResult<SalaryImport>> {
  const errors: ImportError[] = [];
  const importedSalaries: SalaryImport[] = [];

  try {
    const rawData = await parseCSVFile(file);

    const columnMap = {
      year: ["year", "y"],
      salary: ["salary", "sal", "amount", "ctc"],
      bonus: ["bonus", "b", "bonus_amount"],
    };

    for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
      const row = rawData[rowIndex];
      const rowErrors: ImportError[] = [];

      const rowKeys = Object.keys(row).map((k) => k.toLowerCase());

      // Extract and validate year
      const yearKey = findMatchingColumn(rowKeys, columnMap.year);
      const yearValue = yearKey ? row[yearKey] : null;
      const year = parseYear(yearValue);

      if (year === null) {
        rowErrors.push({
          row: rowIndex + 1,
          column: "year",
          message: "Year must be a number between 1900 and 2100",
          value: yearValue,
        });
      }

      // Extract and validate salary
      const salaryKey = findMatchingColumn(rowKeys, columnMap.salary);
      const salaryValue = salaryKey ? row[salaryKey] : null;
      const salary = parseAmount(salaryValue);

      if (salary === null || salary <= 0) {
        rowErrors.push({
          row: rowIndex + 1,
          column: "salary",
          message: "Salary must be a positive number",
          value: salaryValue,
        });
      }

      // Extract optional bonus
      const bonusKey = findMatchingColumn(rowKeys, columnMap.bonus);
      const bonusValue = bonusKey ? row[bonusKey] : null;
      const bonus = bonusValue ? parseAmount(bonusValue) : undefined;

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        continue;
      }

      if (year !== null && salary !== null) {
        importedSalaries.push({
          year,
          salary,
          bonus: bonus && bonus > 0 ? bonus : undefined,
        });
      }
    }

    return {
      success: errors.length === 0,
      data: importedSalaries,
      errors,
      summary: {
        total: rawData.length,
        imported: importedSalaries.length,
        failed: errors.length,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          column: "file",
          message: `Failed to parse CSV: ${errorMessage}`,
          value: file.name,
        },
      ],
      summary: {
        total: 0,
        imported: 0,
        failed: 1,
      },
    };
  }
}

/**
 * Helper: Find matching column in row keys
 */
function findMatchingColumn(
  rowKeys: string[],
  patterns: string[]
): string | null {
  for (const pattern of patterns) {
    const match = rowKeys.find(
      (key) => key === pattern || key.includes(pattern)
    );
    if (match) return match;
  }
  return null;
}

/**
 * Helper: Parse date string to YYYY-MM-DD format
 */
function parseDate(dateString: unknown): string | null {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  const trimmed = dateString.trim();

  // Try parsing various date formats
  const formats = [
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, // YYYY/MM/DD
  ];

  for (const format of formats) {
    const match = trimmed.match(format);
    if (match) {
      let year: number, month: number, day: number;

      // Determine which format matched
      if (match[1].length === 4) {
        // YYYY first
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else {
        // DD first or MM first (check if first > 12 to determine)
        const first = parseInt(match[1]);
        const second = parseInt(match[2]);
        year = parseInt(match[3]);

        if (first > 12) {
          // DD-MM-YYYY
          day = first;
          month = second;
        } else if (second > 12) {
          // MM-DD-YYYY
          month = first;
          day = second;
        } else {
          // Ambiguous, assume DD-MM-YYYY
          day = first;
          month = second;
        }
      }

      // Validate date
      if (
        year >= 1900 &&
        year <= 2100 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
      ) {
        const dateObj = new Date(year, month - 1, day);
        if (dateObj.getMonth() === month - 1) {
          // Month is valid (not overflow)
          return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
            2,
            "0"
          )}`;
        }
      }
    }
  }

  return null;
}

/**
 * Helper: Parse amount string to number
 */
function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const str = String(value).trim();

  // Remove currency symbols and commas
  const cleaned = str
    .replace(/[₹$€£,]/g, "")
    .trim();

  const num = parseFloat(cleaned);

  return isNaN(num) ? null : num;
}

/**
 * Helper: Parse year string to number
 */
function parseYear(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const num = parseInt(String(value).trim(), 10);

  if (isNaN(num) || num < 1900 || num > 2100) {
    return null;
  }

  return num;
}

/**
 * Validate import data before saving to database
 */
export function validateImportData<T>(
  data: T[],
  schema: (item: T) => boolean
): { valid: T[]; invalid: Array<{ item: T; error: string }> } {
  const valid: T[] = [];
  const invalid: Array<{ item: T; error: string }> = [];

  for (const item of data) {
    try {
      if (schema(item)) {
        valid.push(item);
      } else {
        invalid.push({ item, error: "Schema validation failed" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      invalid.push({ item, error: errorMessage });
    }
  }

  return { valid, invalid };
}
