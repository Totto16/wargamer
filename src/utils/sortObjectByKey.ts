/**
 * Consumes an object and produces a new object with the same keys, but inserted
 *   in sorted order.
 * @param {Object} object - The object to sort.
 * @returns {Object} The sorted object.
 * @private
 */
export default function sortObjectByKey<
  T extends Record<string, unknown> = Record<string, unknown>,
>(object: T): T {
  return Object.keys(object)
    .sort()
    .reduce(
      (built, next) => ({
        ...built,
        [next]: object[next],
      }),
      {} as T,
    );
}
