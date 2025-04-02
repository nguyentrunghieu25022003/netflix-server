module.exports = (query) => {
  const sort = {};
  let sortKey = query.sortKey;
  if (sortKey) {
    sortKey = `movie.${sortKey}`;
  }
  if (query.sortValue) {
    sort[sortKey] = query.sortValue === "inc" ? 1 : -1;
  }
  return sort;
};