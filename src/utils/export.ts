/**
 * Export utilities for CSV and PDF
 * Requires: papaparse, jspdf, jspdf-autotable
 */

import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportOptions {
  filename?: string;
  headers?: string[];
  dateFormat?: (date: string | Date) => string;
}

export interface PDFExportOptions {
  title: string;
  filename?: string;
  columns: Array<{
    header: string;
    dataKey: string;
    width?: number;
  }>;
  dateFormat?: (date: string | Date) => string;
  companyName?: string;
  footer?: string;
}

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string = "export.csv",
  options?: ExportOptions
): void {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Prepare CSV data with custom headers if provided
  const headers = options?.headers
  const csvData = headers
    ? data.map((row) =>
        headers.reduce(
          (acc, header) => ({
            ...acc,
            [header]: row[header] || "",
          }),
          {} as Record<string, unknown>
        )
      )
    : data;

  // Convert to CSV using papaparse
  const csv = Papa.unparse(csvData);

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadFile(blob, filename);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(
  transactions: Array<{
    date: string;
    category: string;
    type: string;
    amount: number;
    description?: string;
    paymentMethod?: string;
  }>,
  filename: string = "transactions.csv"
): void {
  const formattedData = transactions.map((tx) => ({
    Date: formatDateForExport(tx.date),
    Category: tx.category,
    Type: tx.type,
    Amount: `₹${tx.amount.toFixed(2)}`,
    Description: tx.description || "-",
    "Payment Method": tx.paymentMethod || "-",
  }));

  exportToCSV(formattedData, filename);
}

/**
 * Export budgets to CSV
 */
export function exportBudgetsToCSV(
  budgets: Array<{
    category: string;
    limit: number;
    period: string;
    spent?: number;
  }>,
  filename: string = "budgets.csv"
): void {
  const formattedData = budgets.map((budget) => ({
    Category: budget.category,
    "Budget Limit": `₹${budget.limit.toFixed(2)}`,
    Period: budget.period,
    "Spent": budget.spent ? `₹${budget.spent.toFixed(2)}` : "N/A",
    "Remaining": budget.spent
      ? `₹${Math.max(0, budget.limit - budget.spent).toFixed(2)}`
      : "-",
  }));

  exportToCSV(formattedData, filename);
}

/**
 * Export data to PDF with table format
 */
export function exportToPDF<T extends Record<string, unknown>>(
  title: string,
  data: T[],
  columns: Array<{
    header: string;
    dataKey: string;
    width?: number;
  }>,
  filename: string = "export.pdf",
  options?: Partial<PDFExportOptions>
): void {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Add header
  if (options?.companyName) {
    doc.setFontSize(12);
    doc.text(options.companyName, 14, 15);
  }

  doc.setFontSize(16);
  doc.text(title, 14, options?.companyName ? 25 : 15);

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  const timestamp = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated on: ${timestamp}`, 14, options?.companyName ? 32 : 22);

  // Prepare table data
  const tableData = data.map((row) =>
    columns.map((col) => {
      const value = row[col.dataKey];
      // Format dates if needed
      if (
        typeof value === "string" &&
        value.match(/^\d{4}-\d{2}-\d{2}/)
      ) {
        return options?.dateFormat
          ? options.dateFormat(value)
          : formatDateForExport(value);
      }
      return value === undefined || value === null ? "-" : String(value);
    })
  );

  // Add table
  autoTable(doc, {
    columns: columns.map((col) => ({
      header: col.header,
      width: col.width,
    })),
    body: tableData,
    startY: options?.companyName ? 35 : 25,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: 14,
  });

  // Add footer
  if (options?.footer) {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        options.footer,
        14,
        doc.internal.pageSize.getHeight() - 10
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    }
  }

  doc.save(filename);
}

/**
 * Export transactions to PDF
 */
export function exportTransactionsToPDF(
  transactions: Array<{
    date: string;
    category: string;
    type: string;
    amount: number;
    description?: string;
    paymentMethod?: string;
  }>,
  filename: string = "transactions.pdf"
): void {
  const formattedData = transactions.map((tx) => ({
    Date: formatDateForExport(tx.date),
    Category: tx.category,
    Type: tx.type,
    Amount: `₹${tx.amount.toFixed(2)}`,
    Description: tx.description || "-",
    "Payment Method": tx.paymentMethod || "-",
  }));

  exportToPDF(
    "Transaction Report",
    formattedData,
    [
      { header: "Date", dataKey: "Date" },
      { header: "Category", dataKey: "Category" },
      { header: "Type", dataKey: "Type" },
      { header: "Amount", dataKey: "Amount" },
      { header: "Description", dataKey: "Description" },
      { header: "Payment Method", dataKey: "Payment Method" },
    ],
    filename,
    {
      companyName: "Money Manager India",
      footer: "© Money Manager India - Confidential",
    }
  );
}

/**
 * Export budget report to PDF
 */
export function exportBudgetReportToPDF(
  budgets: Array<{
    category: string;
    limit: number;
    spent: number;
    period: string;
  }>,
  filename: string = "budget-report.pdf"
): void {
  const formattedData = budgets.map((budget) => ({
    Category: budget.category,
    "Budget Limit": `₹${budget.limit.toFixed(2)}`,
    Spent: `₹${budget.spent.toFixed(2)}`,
    Remaining: `₹${Math.max(0, budget.limit - budget.spent).toFixed(2)}`,
    "Usage %": `${((budget.spent / budget.limit) * 100).toFixed(1)}%`,
    Period: budget.period,
  }));

  exportToPDF(
    "Budget Report",
    formattedData,
    [
      { header: "Category", dataKey: "Category" },
      { header: "Budget Limit", dataKey: "Budget Limit" },
      { header: "Spent", dataKey: "Spent" },
      { header: "Remaining", dataKey: "Remaining" },
      { header: "Usage %", dataKey: "Usage %" },
      { header: "Period", dataKey: "Period" },
    ],
    filename,
    {
      companyName: "Money Manager India",
      footer: "© Money Manager India - Confidential",
    }
  );
}

/**
 * Helper function to download file
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
function formatDateForExport(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    return dateObj.toLocaleDateString("en-IN");
  } catch {
    return "Invalid date";
  }
}

/**
 * Generate summary statistics for export
 */
export function generateExportSummary(transactions: {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  topCategories: Array<{ category: string; amount: number }>;
  period: string;
}): string {
  return `
Financial Summary Report
========================
Period: ${transactions.period}

Total Income: ₹${transactions.totalIncome.toFixed(2)}
Total Expense: ₹${transactions.totalExpense.toFixed(2)}
Net Savings: ₹${transactions.netSavings.toFixed(2)}

Top Spending Categories:
${transactions.topCategories.map((cat) => `- ${cat.category}: ₹${cat.amount.toFixed(2)}`).join("\n")}

Generated: ${new Date().toLocaleString("en-IN")}
  `.trim();
}
