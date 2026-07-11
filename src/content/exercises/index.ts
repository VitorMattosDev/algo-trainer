import type { Exercise } from '../types';
import { bestTimeToBuyAndSellStock } from './best-time-to-buy-and-sell-stock';
import { binarySearchBasic } from './binary-search-basic';
import { containerWithMostWater } from './container-with-most-water';
import { dailyTemperatures } from './daily-temperatures';
import { groupAnagrams } from './group-anagrams';
import { longestSubstringWithoutRepeating } from './longest-substring-without-repeating';
import { searchInRotatedSortedArray } from './search-in-rotated-sorted-array';
import { threeSum } from './three-sum';
import { topKFrequent } from './top-k-frequent';
import { twoSum } from './two-sum';
import { validPalindrome } from './valid-palindrome';
import { validParentheses } from './valid-parentheses';

/** Registro central — todo exercício novo deve ser adicionado aqui. */
export const exercises: Exercise[] = [
  // hashmap
  twoSum,
  groupAnagrams,
  topKFrequent,
  // two-pointers
  validPalindrome,
  containerWithMostWater,
  threeSum,
  // sliding-window
  bestTimeToBuyAndSellStock,
  longestSubstringWithoutRepeating,
  // stack
  validParentheses,
  dailyTemperatures,
  // binary-search
  binarySearchBasic,
  searchInRotatedSortedArray,
];

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByPattern(pattern: string): Exercise[] {
  return exercises.filter((e) => e.pattern === pattern);
}
