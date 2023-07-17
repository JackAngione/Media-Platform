import type { MultiSearchResult, InstantSearchPagination, PaginationState } from '../../types';
export declare function adaptPaginationParameters(searchResponse: MultiSearchResult<Record<string, any>>, paginationState: PaginationState): InstantSearchPagination & {
    nbPages: number;
};
//# sourceMappingURL=pagination-adapter.d.ts.map