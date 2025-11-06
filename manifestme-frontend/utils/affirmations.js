// utils/affirmations.js
export async function loadAffirmations() {
  try {
    const response = await fetch('/data/affirmations_dataset_full.jsonl');
    const text = await response.text();

    const lines = text.split('\n').filter(Boolean);
    const affirmations = lines.map(line => JSON.parse(line));

    return affirmations;
  } catch (error) {
    console.error('Error loading affirmations:', error);
    return [];
  }
}

/**
 * Get a random affirmation from the full list or a specific category
 * @param {Array} affirmations - Array of affirmation objects
 * @param {String} [category] - Optional category filter
 * @returns {Object} - Random affirmation
 */
export function getRandomAffirmation(affirmations, category) {
  const filtered = category
    ? affirmations.filter(a => a.category === category)
    : affirmations;

  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Get a deterministic daily affirmation
 * @param {Array} affirmations - Array of affirmation objects
 * @param {Date} [date] - Optional date, defaults to today
 * @param {String} [category] - Optional category filter
 * @returns {Object} - Daily affirmation
 */
export function getDailyAffirmation(affirmations, date = new Date(), category) {
  const filtered = category
    ? affirmations.filter(a => a.category === category)
    : affirmations;

  if (filtered.length === 0) return null;

  // Use day-of-year as a simple deterministic seed
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const index = dayOfYear % filtered.length;
  return filtered[index];
}
