import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
import { VariantInput } from '@/types';
import { CATEGORY_OPTIONS } from './constants';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Convert prisma object into a regular JS object
export const convertToPlainObject = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

// Format number with decimal places
export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
};

export const parseNumberInput = (raw: string): number | null => {
  if (raw === '') return null;
  const parsed = Number(raw);

  // fallback for invalid numbers
  return isNaN(parsed) ? 0 : parsed;
};

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any) => {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message,
    );

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle prisma error
    const field = error.meta?.target ? error.meta?.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exist`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
};

// Round number to 2 decimal places
export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string');
  }
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

// Format currency using the formatter above
export const formatCurrency = (amount: number | string | null) => {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
};

// Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export const formatNumber = (number: number) => {
  return NUMBER_FORMATTER.format(number);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serializeVariant = (variant: any) => {
  return {
    ...variant,
    price: variant.price?.toString() || null,
    createdAt: variant.createdAt.toISOString(),
    updatedAt: variant.updatedAt.toISOString(),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeProduct = (product: any) => {
  return {
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants?.map(serializeVariant) || [],
  };
};

// Helper to get sizes for a category
export const getSizesForCategory = (categoryValue: string): string[] => {
  const category = CATEGORY_OPTIONS.find((cat) => cat.value === categoryValue);
  return category?.sizes ? [...category.sizes] : [];
};

// Shorten the UUID
export const formatId = (id: string) => {
  return `...${id.substring(id.length - 6)}`;
};

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2025')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions,
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions,
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions,
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form the pagination links
export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) => {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    },
  );
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

// Helper function to validate variants
export const validateVariants = (
  variants: VariantInput[],
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  variants.forEach((variant, index) => {
    // Check if either color or size is provided
    if (!variant.color && !variant.size) {
      errors.push(
        `Variant ${index + 1}: Either color or size must be provided`,
      );
    }

    if (variant.stock === null || variant.stock === undefined) {
      errors.push(`Variant ${index + 1}: Stock is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate variant uniqueness WITHIN a product
export const validateVariantUniqueness = (
  variants: VariantInput[],
): {
  isValid: boolean;
  duplicates: string[];
} => {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const variant of variants) {
    const colorKey = variant.color === null ? 'NULL' : variant.color;
    const sizeKey = variant.size === null ? 'NULL' : variant.size;
    const key = `${colorKey}-${sizeKey}`;

    if (seen.has(key)) {
      const colorText = variant.color || 'No Color';
      const sizeText = variant.size || 'No Size';
      duplicates.push(`${colorText} / ${sizeText}`);
    }
    seen.add(key);
  }

  return {
    isValid: duplicates.length === 0,
    duplicates,
  };
};

// Helper function to generate SKU
export const generateVariantSKU = (
  productName: string,
  productId: string,
  variant: VariantInput,
): string => {
  const namePart = productName
    .replace(/\s+/g, '')
    .substring(0, 3)
    .toUpperCase();

  const colorPart = variant.color
    ? variant.color.replace(/\s+/g, '').toUpperCase()
    : '';

  const sizePart = variant.size
    ? variant.size.replace(/\s+/g, '').toUpperCase()
    : '';

  const productIdPart = productId.substring(0, 12);

  // Build SKU parts array, filtering out empty strings
  const parts = [namePart, colorPart, sizePart, productIdPart].filter(Boolean);

  return parts.join('-');
};
