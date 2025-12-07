const {
  calculateEcoPoints,
  isValidEmail,
  totalWeightKg,
  filterUpcomingEvents,
  getRewardLevel,
} = require('./ecoUtils');

test('calculateEcoPoints returns 10 points per kg', () => {
  expect(calculateEcoPoints(2)).toBe(20);
});

test('calculateEcoPoints throws an error for 0 or negative weight', () => {
  expect(() => calculateEcoPoints(0)).toThrow('Weight must be positive');
});

test('isValidEmail returns true for a valid email', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
});

test('isValidEmail returns false for an invalid email', () => {
  expect(isValidEmail('not-an-email')).toBe(false);
});

test('totalWeightKg sums the weights of items', () => {
  const items = [{ weightKg: 1.5 }, { weightKg: 2 }, { weightKg: 0.5 }];
  expect(totalWeightKg(items)).toBe(4);
});

test('filterUpcomingEvents returns only events on or after today', () => {
  const events = [
    { name: 'Past', date: '2025-01-01' },
    { name: 'Today', date: '2025-12-07' },
    { name: 'Future', date: '2025-12-31' },
  ];

  const result = filterUpcomingEvents(events, '2025-12-07');
  const names = result.map(e => e.name);

  expect(names).toEqual(['Today', 'Future']);
});

test('getRewardLevel returns correct level based on points', () => {
  expect(getRewardLevel(50)).toBe('Bronze');
  expect(getRewardLevel(250)).toBe('Silver');
  expect(getRewardLevel(600)).toBe('Gold');
});
