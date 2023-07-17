/**
 * Split sort string into an array.
 *
 * Example:
 * '_geoPoint(37.8153, -122.4784):asc,title:asc,description:desc'
 *
 * becomes:
 * [
 * '_geoPoint(37.8153, -122.4784):asc',
 * 'title:asc',
 * 'description:desc',
 * ]
 *
 * @param {string} sortStr
 * @returns {string[]}
 */
export declare function splitSortString(sortStr: string): string[];
//# sourceMappingURL=sort-context.d.ts.map