/**
 * Default Indian transaction categories with icons and colors
 */

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string; // Icon name (can be used with lucide-react or similar)
  color: string; // Hex color code
  description?: string;
  isDefault: boolean;
}

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  {
    id: "food-dining",
    name: "Food & Dining",
    type: "expense",
    icon: "UtensilsCrossed",
    color: "#FF6B6B",
    description: "Restaurants, cafes, food delivery",
    isDefault: true,
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "expense",
    icon: "ShoppingCart",
    color: "#FFA500",
    description: "Grocery stores, food items",
    isDefault: true,
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "expense",
    icon: "Car",
    color: "#4ECDC4",
    description: "Fuel, auto, metro, taxi, parking",
    isDefault: true,
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "expense",
    icon: "Zap",
    color: "#FFD93D",
    description: "Electricity, water, gas, internet",
    isDefault: true,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "expense",
    icon: "Clapperboard",
    color: "#9D4EDD",
    description: "Movies, games, hobbies, streaming",
    isDefault: true,
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "expense",
    icon: "ShoppingBag",
    color: "#FF69B4",
    description: "Clothes, accessories, personal items",
    isDefault: true,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "expense",
    icon: "Heart",
    color: "#E63946",
    description: "Medicine, doctor, hospital, dental",
    isDefault: true,
  },
  {
    id: "education",
    name: "Education",
    type: "expense",
    icon: "BookOpen",
    color: "#457B9D",
    description: "Tuition, courses, books, training",
    isDefault: true,
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "expense",
    icon: "Shield",
    color: "#1D3557",
    description: "Life, health, auto, home insurance",
    isDefault: true,
  },
  {
    id: "rent",
    name: "Rent",
    type: "expense",
    icon: "Home",
    color: "#A23B72",
    description: "Rent payments",
    isDefault: true,
  },
  {
    id: "phone",
    name: "Mobile & Internet",
    type: "expense",
    icon: "Smartphone",
    color: "#00BCD4",
    description: "Mobile bill, internet, DTH",
    isDefault: true,
  },
  {
    id: "gym",
    name: "Fitness & Sports",
    type: "expense",
    icon: "Activity",
    color: "#28A745",
    description: "Gym membership, sports, yoga",
    isDefault: true,
  },
  {
    id: "travel",
    name: "Travel & Holidays",
    type: "expense",
    icon: "Plane",
    color: "#FFC107",
    description: "Flights, hotels, vacations",
    isDefault: true,
  },
  {
    id: "home-maintenance",
    name: "Home Maintenance",
    type: "expense",
    icon: "Wrench",
    color: "#9B59B6",
    description: "Repairs, renovations, maintenance",
    isDefault: true,
  },
  {
    id: "pet-care",
    name: "Pet Care",
    type: "expense",
    icon: "PawPrint",
    color: "#E8B4B8",
    description: "Pet food, vet, pet supplies",
    isDefault: true,
  },
  {
    id: "loan-emi",
    name: "Loan EMI",
    type: "expense",
    icon: "CreditCard",
    color: "#3A3F51",
    description: "EMI, loan payments",
    isDefault: true,
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    type: "expense",
    icon: "Repeat",
    color: "#00A8CC",
    description: "Monthly subscriptions, memberships",
    isDefault: true,
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "expense",
    icon: "Gift",
    color: "#FF1744",
    description: "Gifts, charity, donations",
    isDefault: true,
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous",
    type: "expense",
    icon: "MoreHorizontal",
    color: "#9E9E9E",
    description: "Other expenses",
    isDefault: true,
  },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  {
    id: "salary",
    name: "Salary",
    type: "income",
    icon: "DollarSign",
    color: "#28A745",
    description: "Monthly salary, wages",
    isDefault: true,
  },
  {
    id: "bonus",
    name: "Bonus & Incentives",
    type: "income",
    icon: "TrendingUp",
    color: "#20C997",
    description: "Annual bonus, incentives, performance pay",
    isDefault: true,
  },
  {
    id: "freelance",
    name: "Freelance & Consulting",
    type: "income",
    icon: "Briefcase",
    color: "#0D6EFD",
    description: "Project income, consulting fees",
    isDefault: true,
  },
  {
    id: "investment",
    name: "Investment Returns",
    type: "income",
    icon: "PieChart",
    color: "#6F42C1",
    description: "Interest, dividends, capital gains",
    isDefault: true,
  },
  {
    id: "rental",
    name: "Rental Income",
    type: "income",
    icon: "Home",
    color: "#FFC107",
    description: "Rent from property",
    isDefault: true,
  },
  {
    id: "business",
    name: "Business Income",
    type: "income",
    icon: "Store",
    color: "#FF6B35",
    description: "Business profits, sales",
    isDefault: true,
  },
  {
    id: "refund",
    name: "Refunds & Returns",
    type: "income",
    icon: "RotateCcw",
    color: "#17A2B8",
    description: "Tax refund, return refunds",
    isDefault: true,
  },
  {
    id: "gift-received",
    name: "Gifts Received",
    type: "income",
    icon: "Gift",
    color: "#E83E8C",
    description: "Gifts from family, friends",
    isDefault: true,
  },
  {
    id: "reimbursement",
    name: "Reimbursement",
    type: "income",
    icon: "CreditCard",
    color: "#00BCD4",
    description: "Expense reimbursements",
    isDefault: true,
  },
  {
    id: "transfer-in",
    name: "Transfer In",
    type: "income",
    icon: "ArrowDown",
    color: "#4ECDC4",
    description: "Money received from others",
    isDefault: true,
  },
];

export const ALL_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get categories by type
 */
export function getCategoriesByType(type: "income" | "expense"): Category[] {
  return ALL_CATEGORIES.filter((cat) => cat.type === type);
}

/**
 * Search categories
 */
export function searchCategories(
  query: string,
  type?: "income" | "expense"
): Category[] {
  const filtered = ALL_CATEGORIES.filter((cat) => {
    const matchesType = !type || cat.type === type;
    const matchesQuery =
      cat.name.toLowerCase().includes(query.toLowerCase()) ||
      cat.description?.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return filtered;
}

/**
 * Get default categories for initialization
 */
export function getDefaultCategories(): Category[] {
  return ALL_CATEGORIES.filter((cat) => cat.isDefault);
}

/**
 * Get category with fallback
 */
export function getCategoryWithFallback(
  id: string,
  type: "income" | "expense"
): Category {
  const category = getCategoryById(id);
  if (category && category.type === type) {
    return category;
  }

  // Return first default category of matching type
  const defaults = getDefaultCategories().filter((c) => c.type === type);
  return defaults[0] || ALL_CATEGORIES.find((c) => c.type === type)!;
}

/**
 * Category color palette for charts
 */
export const CATEGORY_COLORS = {
  expense: ALL_CATEGORIES.filter((c) => c.type === "expense").map((c) => c.color),
  income: ALL_CATEGORIES.filter((c) => c.type === "income").map((c) => c.color),
};

/**
 * Get complementary colors for a category
 */
export function getCategoryColor(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category?.color || "#9E9E9E";
}

/**
 * Get icon name for category
 */
export function getCategoryIcon(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category?.icon || "Circle";
}
