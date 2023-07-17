import type { AlgoliaSearchResponse, FacetDistribution, InstantMeiliSearchConfig, MeilisearchMultiSearchResult } from '../../types';
/**
 * Adapt multiple search results from Meilisearch
 * to search results compliant with instantsearch.js
 *
 * @param  {Array<MeilisearchMultiSearchResult<T>>} searchResponse
 * @param  {Record<string, FacetDistribution>} initialFacetDistribution
 * @param  {InstantMeiliSearchConfig} config
 * @returns {{ results: Array<AlgoliaSearchResponse<T>> }}
 */
export declare function adaptSearchResults<T = Record<string, any>>(meilisearchResults: MeilisearchMultiSearchResult[], initialFacetDistribution: Record<string, FacetDistribution>, config: InstantMeiliSearchConfig): {
    results: Array<AlgoliaSearchResponse<T>>;
};
/**
 * Adapt search result from Meilisearch
 * to search result compliant with instantsearch.js
 *
 * @param  {MeilisearchMultiSearchResult<Record<string>>} searchResponse
 * @param  {Record<string, FacetDistribution>} initialFacetDistribution
 * @param  {InstantMeiliSearchConfig} config
 * @returns {AlgoliaSearchResponse<T>}
 */
export declare function adaptSearchResult<T>(meiliSearchResult: MeilisearchMultiSearchResult, initialFacetDistribution: FacetDistribution, config: InstantMeiliSearchConfig): AlgoliaSearchResponse<T>;
//# sourceMappingURL=search-response-adapter.d.ts.map