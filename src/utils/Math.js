export const calculateAverageRating = (nums) => {
  const sum = nums.reduce((prev, next) => prev + next, 0);
  return sum / nums.length;
};
