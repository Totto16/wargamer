type MapCallbackFn<T extends Record<string, unknown>> = (
    value: T[keyof T],
    key: keyof T,
    obj: T
) => T[keyof T]

/**
 * Identical to `Array.prototype.map()` except for object values.
 * @param {Object} object - The object whose values will be mapped.
 * @param {Function} callback - The callback to map the object values. Gets passed
 *   equivalent parameters as `Array.prototype.map()`.
 * @returns {Object} A new mapped object.
 * @private
 */
export default function mapValues<T extends Record<string, unknown>>(
    object: T,
    callback: MapCallbackFn<T> = (value) => value
): T {
    const keys = Object.keys(object)

    return keys.reduce(
        (mapped: T, nextKey: keyof T) => ({
            ...mapped,
            [nextKey]: callback(object[nextKey], nextKey, object),
        }),
        {} as T
    )
}
