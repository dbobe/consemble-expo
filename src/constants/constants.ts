import { WhichGender, WhichInterests } from '../types';

export const displayInterests: Partial<WhichInterests>[] = [
  'Acts of Kindness',
  'Art',
  'Baking',
  'Beverages',
  'Cooking',
  'Crafts',
  'Exploring',
  'Family',
  'Fitness',
  'Friends',
  'Games',
  'Grilling',
  'Movies',
  'Music',
  'New People',
  'Reading',
  'Relaxation',
  'Restaurants',
  'Self Care',
  'Self Improvement',
  'Writing',
];

export const genderOptions: Record<WhichGender, string> = {
  male: 'Male',
  female: 'Female',
  nonbinary: 'Non-binary',
  other: 'Other',
  'not set': 'Not Set',
};
