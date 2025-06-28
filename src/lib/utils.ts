import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Currency from "currency.js";
import { format, parseISO, isValid, differenceInDays } from "date-fns";

/**
 * Combines class names with Tailwind CSS merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Currency formatting utilities
 */
export const currency = {
  /**
   * Format a number as currency
   */
  format: (amount: number, currencyCode = "USD", locale = "en-US") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  },

  /**
   * Parse currency string to number
   */
  parse: (value: string) => {
    return Currency(value).value;
  },

  /**
   * Add two currency amounts safely
   */
  add: (a: number, b: number) => {
    return Currency(a).add(b).value;
  },

  /**
   * Subtract two currency amounts safely
   */
  subtract: (a: number, b: number) => {
    return Currency(a).subtract(b).value;
  },

  /**
   * Multiply currency amount safely
   */
  multiply: (amount: number, multiplier: number) => {
    return Currency(amount).multiply(multiplier).value;
  },

  /**
   * Divide currency amount safely
   */
  divide: (amount: number, divisor: number) => {
    return Currency(amount).divide(divisor).value;
  },
};

/**
 * Date formatting utilities
 */
export const dateUtils = {
  /**
   * Format date for display
   */
  format: (date: Date | string, formatString = "MMM dd, yyyy") => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : "Invalid date";
  },

  /**
   * Format date for input fields
   */
  formatForInput: (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, "yyyy-MM-dd") : "";
  },

  /**
   * Get relative time (e.g., "2 days ago")
   */
  getRelativeTime: (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid date";

    const now = new Date();
    const diffInDays = differenceInDays(now, dateObj);

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  },

  /**
   * Check if date is in the future
   */
  isFuture: (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj) && dateObj > new Date();
  },

  /**
   * Check if date is in the past
   */
  isPast: (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj) && dateObj < new Date();
  },
};

/**
 * Number formatting utilities
 */
export const numberUtils = {
  /**
   * Format large numbers with abbreviations (K, M, B)
   */
  abbreviate: (num: number, decimals = 1) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(decimals) + "K";
    if (num < 1000000000) return (num / 1000000).toFixed(decimals) + "M";
    return (num / 1000000000).toFixed(decimals) + "B";
  },

  /**
   * Format percentage
   */
  formatPercentage: (value: number, decimals = 2) => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  /**
   * Clamp number between min and max
   */
  clamp: (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
  },

  /**
   * Round to specified decimal places
   */
  round: (num: number, decimals = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
};

/**
 * String utilities
 */
export const stringUtils = {
  /**
   * Capitalize first letter
   */
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert to title case
   */
  toTitleCase: (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
  },

  /**
   * Generate initials from name
   */
  getInitials: (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },

  /**
   * Convert string to slug
   */
  slugify: (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  },
};

/**
 * Validation utilities
 */
export const validation = {
  /**
   * Validate email address
   */
  isEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isStrongPassword: (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  /**
   * Validate positive number
   */
  isPositiveNumber: (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return !isNaN(num) && num > 0;
  },

  /**
   * Validate currency amount
   */
  isCurrencyAmount: (value: string) => {
    const currencyRegex = /^\d+(\.\d{1,2})?$/;
    return currencyRegex.test(value) && parseFloat(value) > 0;
  },
};

/**
 * Array utilities
 */
export const arrayUtils = {
  /**
   * Group array by key
   */
  groupBy: <T>(array: T[], key: keyof T) => {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Sort array by key
   */
  sortBy: <T>(array: T[], key: keyof T, direction: "asc" | "desc" = "asc") => {
    return array.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  },

  /**
   * Remove duplicates from array
   */
  unique: <T>(array: T[]) => {
    return Array.from(new Set(array));
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk: <T>(array: T[], size: number) => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

/**
 * Financial calculation utilities
 */
export const financialUtils = {
  /**
   * Calculate percentage change
   */
  percentageChange: (oldValue: number, newValue: number) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  },

  /**
   * Calculate compound interest
   */
  compoundInterest: (
    principal: number,
    rate: number,
    time: number,
    compoundFrequency = 12
  ) => {
    return principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time);
  },

  /**
   * Calculate simple interest
   */
  simpleInterest: (principal: number, rate: number, time: number) => {
    return principal * (1 + rate * time);
  },

  /**
   * Calculate monthly payment for loan
   */
  loanPayment: (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 12;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  },

  /**
   * Calculate retirement savings needed
   */
  retirementSavings: (
    currentAge: number,
    retirementAge: number,
    desiredIncome: number,
    inflationRate = 0.03,
    returnRate = 0.07
  ) => {
    const yearsToRetirement = retirementAge - currentAge;
    const inflationAdjustedIncome = desiredIncome * Math.pow(1 + inflationRate, yearsToRetirement);
    const realReturnRate = returnRate - inflationRate;
    return inflationAdjustedIncome / realReturnRate;
  },
};

/**
 * Color utilities for charts and UI
 */
export const colorUtils = {
  /**
   * Generate color palette
   */
  generatePalette: (count: number) => {
    const colors = [
      "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
      "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
    ];
    
    if (count <= colors.length) {
      return colors.slice(0, count);
    }
    
    // Generate additional colors if needed
    const additionalColors = [];
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137.508) % 360; // Golden angle approximation
      additionalColors.push(`hsl(${hue}, 70%, 50%)`);
    }
    
    return [...colors, ...additionalColors];
  },

  /**
   * Get color for transaction type
   */
  getTransactionColor: (type: "income" | "expense" | "transfer") => {
    switch (type) {
      case "income":
        return "#10b981"; // green
      case "expense":
        return "#ef4444"; // red
      case "transfer":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  },

  /**
   * Get color for account type
   */
  getAccountColor: (type: string) => {
    const colorMap: Record<string, string> = {
      checking: "#3b82f6",
      savings: "#10b981",
      credit: "#ef4444",
      investment: "#8b5cf6",
      retirement: "#f59e0b",
      loan: "#ec4899",
    };
    return colorMap[type] || "#6b7280";
  },
};

/**
 * Local storage utilities
 */
export const storage = {
  /**
   * Get item from localStorage
   */
  get: (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set item in localStorage
   */
  set: (key: string, value: any) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle quota exceeded error
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  /**
   * Clear all localStorage
   */
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
};

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Generate random ID
 */
export function generateId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 