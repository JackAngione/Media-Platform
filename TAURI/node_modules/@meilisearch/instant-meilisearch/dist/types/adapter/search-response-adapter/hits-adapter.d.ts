import type { PaginationState, MeilisearchMultiSearchResult, InstantMeiliSearchConfig } from '../../types';
/**
 * @param  {MeilisearchMultiSearchResult} searchResult
 * @param  {SearchContext} searchContext
 * @returns {Array<Record<string, any>>}
 */
export declare function adaptHits(searchResponse: MeilisearchMultiSearchResult & {
    pagination: PaginationState;
}, config: InstantMeiliSearchConfig): any;
//# sourceMappingURL=hits-adapter.d.ts.map