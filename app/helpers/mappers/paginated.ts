const mapperPagination = (data: Record<string, unknown>): Pagination => ({
  total: getNumber(data.total),
  totalPages: Math.max(1, getNumber(data.total_pages, 1)),
  page: Math.max(1, getNumber(data.page, 1)),
  pageSize: getNumber(data.page_size, 10),
});

export { mapperPagination };
