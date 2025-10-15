import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Convert prisma object into a regular JS object
export const convertToPlainObject = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};
