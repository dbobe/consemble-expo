import { categories } from '../db/jazz/schema';

export type StringKeyObject = {
  [key: string]: string;
};

export type WhichGender = 'male' | 'female' | 'nonbinary' | 'other' | 'not set';
export type WhichAgeRange = '15-20' | '21-29' | '31-39' | '40+' | 'not set';
export type WhichInterests = (typeof interests)[number];

export const interests = categories;
