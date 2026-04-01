/**
 * Major Indian Banks and Financial Institutions
 */

export interface BankInfo {
  id: string;
  name: string;
  shortCode: string;
  type: "public" | "private" | "foreign";
  category: "bank" | "nbfc" | "payment_bank" | "insurance";
  ifscPrefix?: string;
  website?: string;
}

export const MAJOR_INDIAN_BANKS: BankInfo[] = [
  // Public Sector Banks
  {
    id: "sbi",
    name: "State Bank of India",
    shortCode: "SBI",
    type: "public",
    category: "bank",
    ifscPrefix: "SBIN",
    website: "https://www.sbi.co.in",
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    shortCode: "BOB",
    type: "public",
    category: "bank",
    ifscPrefix: "BARB",
    website: "https://www.bankofbaroda.co.in",
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    shortCode: "PNB",
    type: "public",
    category: "bank",
    ifscPrefix: "PUNB",
    website: "https://www.pnbindia.in",
  },
  {
    id: "canara",
    name: "Canara Bank",
    shortCode: "Canara",
    type: "public",
    category: "bank",
    ifscPrefix: "CNRB",
    website: "https://www.canarabank.in",
  },
  {
    id: "ucbi",
    name: "Union Bank of India",
    shortCode: "UBI",
    type: "public",
    category: "bank",
    ifscPrefix: "UBIN",
    website: "https://www.unionbankofindia.co.in",
  },
  {
    id: "iob",
    name: "Indian Bank",
    shortCode: "IB",
    type: "public",
    category: "bank",
    ifscPrefix: "IBKL",
    website: "https://www.indianbank.in",
  },
  {
    id: "allahabadbank",
    name: "Allahabad Bank",
    shortCode: "AllahabadBank",
    type: "public",
    category: "bank",
    ifscPrefix: "ALLA",
    website: "https://www.allahabadbank.in",
  },

  // Private Sector Banks
  {
    id: "hdfc",
    name: "HDFC Bank",
    shortCode: "HDFC",
    type: "private",
    category: "bank",
    ifscPrefix: "HDFC",
    website: "https://www.hdfcbank.com",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    shortCode: "ICICI",
    type: "private",
    category: "bank",
    ifscPrefix: "ICIC",
    website: "https://www.icicibank.com",
  },
  {
    id: "axis",
    name: "Axis Bank",
    shortCode: "Axis",
    type: "private",
    category: "bank",
    ifscPrefix: "UTIB",
    website: "https://www.axisbank.com",
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    shortCode: "Kotak",
    type: "private",
    category: "bank",
    ifscPrefix: "KKBK",
    website: "https://www.kotak.com",
  },
  {
    id: "indusind",
    name: "IndusInd Bank",
    shortCode: "IndusInd",
    type: "private",
    category: "bank",
    ifscPrefix: "INDB",
    website: "https://www.indusindbank.com",
  },
  {
    id: "yes",
    name: "YES Bank",
    shortCode: "YES",
    type: "private",
    category: "bank",
    ifscPrefix: "YESB",
    website: "https://www.yesbank.in",
  },
  {
    id: "idbi",
    name: "IDBI Bank",
    shortCode: "IDBI",
    type: "private",
    category: "bank",
    ifscPrefix: "IBKL",
    website: "https://www.idbibank.in",
  },
  {
    id: "federal",
    name: "Federal Bank",
    shortCode: "Federal",
    type: "private",
    category: "bank",
    ifscPrefix: "FEDB",
    website: "https://www.federalbank.co.in",
  },
  {
    id: "rbl",
    name: "RBL Bank",
    shortCode: "RBL",
    type: "private",
    category: "bank",
    ifscPrefix: "RATN",
    website: "https://www.rblbank.com",
  },

  // Foreign Banks
  {
    id: "hsbc",
    name: "HSBC Bank India",
    shortCode: "HSBC",
    type: "foreign",
    category: "bank",
    ifscPrefix: "HSBC",
    website: "https://www.hsbc.co.in",
  },
  {
    id: "citi",
    name: "Citibank India",
    shortCode: "Citi",
    type: "foreign",
    category: "bank",
    ifscPrefix: "CITI",
    website: "https://www.citibankindiaonline.com",
  },
  {
    id: "dbs",
    name: "DBS Bank India",
    shortCode: "DBS",
    type: "foreign",
    category: "bank",
    ifscPrefix: "DBSS",
    website: "https://www.dbs.com/in",
  },

  // Payment Banks
  {
    id: "paytm",
    name: "Paytm Payments Bank",
    shortCode: "Paytm",
    type: "private",
    category: "payment_bank",
    ifscPrefix: "PYTM",
    website: "https://www.paytm.com",
  },
  {
    id: "airtel",
    name: "Airtel Payments Bank",
    shortCode: "Airtel",
    type: "private",
    category: "payment_bank",
    ifscPrefix: "AIRP",
    website: "https://www.airtelpaymentsbank.com",
  },
  {
    id: "google",
    name: "Google Pay NEFT",
    shortCode: "GooglePay",
    type: "private",
    category: "payment_bank",
    website: "https://pay.google.com/intl/en_in",
  },

  // NBFCs and Insurance Companies
  {
    id: "bajaj",
    name: "Bajaj Finance Limited",
    shortCode: "Bajaj",
    type: "private",
    category: "nbfc",
    website: "https://www.bajajfinserv.in",
  },
  {
    id: "icici-insurance",
    name: "ICICI Lombard Insurance",
    shortCode: "ICICI-Ins",
    type: "private",
    category: "insurance",
    website: "https://www.icicilombard.com",
  },
  {
    id: "hdfc-insurance",
    name: "HDFC ERGO Insurance",
    shortCode: "HDFC-Ins",
    type: "private",
    category: "insurance",
    website: "https://www.hdfcergo.com",
  },
];

export const BANK_CATEGORIES = {
  public: "Public Sector Banks",
  private: "Private Sector Banks",
  foreign: "Foreign Banks",
};

/**
 * Get bank info by ID
 */
export function getBankById(id: string): BankInfo | undefined {
  return MAJOR_INDIAN_BANKS.find((bank) => bank.id === id);
}

/**
 * Get all banks
 */
export function getAllBanks(): BankInfo[] {
  return MAJOR_INDIAN_BANKS;
}

/**
 * Get banks by type
 */
export function getBanksByType(
  type: "public" | "private" | "foreign"
): BankInfo[] {
  return MAJOR_INDIAN_BANKS.filter((bank) => bank.type === type);
}

/**
 * Search banks by name
 */
export function searchBanks(query: string): BankInfo[] {
  const lowerQuery = query.toLowerCase();
  return MAJOR_INDIAN_BANKS.filter(
    (bank) =>
      bank.name.toLowerCase().includes(lowerQuery) ||
      bank.shortCode.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get bank name options for dropdown
 */
export function getBankOptions(): Array<{ label: string; value: string }> {
  return MAJOR_INDIAN_BANKS.map((bank) => ({
    label: bank.name,
    value: bank.id,
  })).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Validate IFSC code format
 */
export function validateIFSC(ifsc: string): boolean {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.toUpperCase());
}

/**
 * Extract bank code from IFSC
 */
export function extractBankCodeFromIFSC(ifsc: string): string {
  return ifsc.substring(0, 4);
}

/**
 * Get bank by IFSC prefix
 */
export function getBankByIFSC(ifsc: string): BankInfo | undefined {
  const prefix = extractBankCodeFromIFSC(ifsc);
  return MAJOR_INDIAN_BANKS.find(
    (bank) => bank.ifscPrefix && bank.ifscPrefix === prefix
  );
}

/**
 * Common Indian banks grouped by category
 */
export const BANKS_BY_CATEGORY = {
  public: getBanksByType("public"),
  private: getBanksByType("private"),
  foreign: getBanksByType("foreign"),
};
