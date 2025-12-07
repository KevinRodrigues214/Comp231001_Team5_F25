function calculateEcoPoints(weightKg) {
  if (weightKg <= 0) throw new Error('Weight must be positive');
  return weightKg * 10;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function totalWeightKg(items) {
  return items.reduce((sum, item) => sum + (item.weightKg || 0), 0);
}

function filterUpcomingEvents(events, today) {
  const todayDate = new Date(today);
  return events.filter(e => new Date(e.date) >= todayDate);
}

function getRewardLevel(points) {
  if (points >= 500) return 'Gold';
  if (points >= 200) return 'Silver';
  return 'Bronze';
}

module.exports = {
  calculateEcoPoints,
  isValidEmail,
  totalWeightKg,
  filterUpcomingEvents,
  getRewardLevel,
};
