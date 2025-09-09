export const calculateAverageRating = (nums) => {
  const sum = nums.reduce((prev, next) => prev + next, 0);
  return sum / nums.length;
};

export const calculateDuration = (date) => {
  if (!date) return "-";

  const currentDate = new Date();
  const createdAtDate = new Date(date);

  const differenceTime = Math.abs(currentDate - createdAtDate);

  const differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));

  const differenceWeeks = Math.floor(differenceDays / 7);
  const differenceMonths = Math.floor(differenceDays / 30);

  if (differenceMonths >= 1) {
    return `${differenceMonths} month${differenceMonths > 1 ? "s" : ""}`;
  } else if (differenceWeeks >= 1) {
    return `${differenceWeeks} week${differenceWeeks > 1 ? "s" : ""}`;
  } else {
    return `${differenceDays} day${differenceDays > 1 ? "s" : ""}`;
  }
};

