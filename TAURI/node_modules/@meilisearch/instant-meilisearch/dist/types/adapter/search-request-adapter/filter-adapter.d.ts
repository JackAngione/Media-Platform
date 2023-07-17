import type { Filter, SearchContext } from '../../types';
/**
 * Adapt instantsearch.js filters to Meilisearch filters by
 * combining and transforming all provided filters.
 *
 * @param  {string|undefined} filters
 * @param  {SearchContext['numericFilters']} numericFilters
 * @param  {SearchContext['facetFilters']} facetFilters
 * @returns {Filter}
 */
export declare function adaptFilters(filters: string | undefined, numericFilters: SearchContext['numericFilters'], facetFilters: SearchContext['facetFilters']): Filter;
//# sourceMappingURL=filter-adapter.d.ts.map