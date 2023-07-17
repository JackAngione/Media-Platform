import { MeiliSearch, SearchCacheInterface, MeiliSearchMultiSearchParams, MeilisearchMultiSearchResult, PaginationState } from '../../types';
/**
 * @param  {ResponseCacher} cache
 */
export declare function SearchResolver(client: MeiliSearch, cache: SearchCacheInterface): {
    multiSearch: (searchQueries: MeiliSearchMultiSearchParams[], instantSearchPagination: PaginationState[]) => Promise<MeilisearchMultiSearchResult[]>;
};
//# sourceMappingURL=search-resolver.d.ts.map