const generateRandomValue = (min: number, max: number, numAfterDigits = 0): number =>
  +(Math.random() * (max + 1 - min) + min).toFixed(numAfterDigits);

const getRandomItems = <T>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition =
    startPosition + generateRandomValue(startPosition, items.length - 1);
  return items.slice(startPosition, endPosition);
};

const getRandomItem = <T>(items: T[]): T =>
  items[generateRandomValue(0, items.length - 1)];

export { generateRandomValue, getRandomItem, getRandomItems };
