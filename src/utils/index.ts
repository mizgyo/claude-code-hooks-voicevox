export function randomChoice<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

export function shouldSkipRareNotification(probability: number = 0.1): boolean {
  return Math.random() > probability;
}