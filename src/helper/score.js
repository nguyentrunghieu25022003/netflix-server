module.exports = (ratingValue) => {
  let score = 0;
  if (ratingValue === "liked") {
    score += 10;
  }
  return score;
};