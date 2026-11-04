interface Pagination {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stateId?: number;
  search?: string;
}

interface PaginationManager extends Pagination {}

const initialPaginationState: Pagination = {
  total: 0,
  totalPages: 1,
  page: 1,
  pageSize: 9,
  stateId: 0,
  search: "",
};

const initialPaginationManagerState: PaginationManager = {
  ...initialPaginationState,
};

export type { Pagination, PaginationManager };
export { initialPaginationManagerState, initialPaginationState };
