module.exports = (objectPagination, query, countMovies) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  objectPagination.totalPage = Math.ceil(countMovies / objectPagination.limitItems);
  return objectPagination;
};