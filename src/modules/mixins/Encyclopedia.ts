import Fuse from 'fuse.js';
import type ClientModule from '../ClientModule';
import type { PageOptions } from '../../clients/BaseClient';

export type EncyclopediaModule = {
  price_xp: number;
  type: string;
};

export type PageMode = 'smart' | 'full';

type PageIndex = {
  page: number;
};

// 0.0 means exact match, 1.0 means it is something completely different
const CONFIDENCE_SCORE_FOR_SMART_EARLY_RETURN = 0.1;

/**
 * Searches for an entry in the encyclopedia endpoint for an API.
 */
interface ResolveEntryParams<T> {
  identifier: number | string;
  indexEndpoint: string;
  dataEndpoint: string;
  identifierKey: string;
  fuse: Fuse<T>;
  searchFields: Array<string>;
}
/**
 * @private
 */

/**
 * Searches for an entry in the encyclopedia endpoint for an API.
 * @param {Object} params - The parameters for the search.
 * @param {(number|string)} params.identifier - The entry identifier to use for lookup.
 * If a number is supplied, it is treated as the entry's ID.
 * If a string is supplied, the identifier is matched against entry names with
 *   the closest match being selected.
 * @param {string} params.indexEndpoint - The endpoint to use for indexing entries.
 * @param {string} params.dataEndpoint - The endpoint to use for returning entry
 *   data.
 * @param {string} params.identifierKey - The key which identifies entries.
 * @param {Fuse} params.fuse - The Fuse object to use for matching against indexed
 *   entries.
 * @param {Array.<string>} params.searchFields - The fields to request when hitting
 *   the `indexEndpoint`. The `identifierKey` will automatically be appended to
 *   this array.
 * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
 *   matched entry, or `null` if no entries were matched.
 * @this {ClientModule}
 * @private
 */
export const resolveEntry = function resolveEntry<
  T extends string,
  D extends Record<string, unknown>,
>(
  this: ClientModule,
  params: ResolveEntryParams<D>,
  pageMode: PageMode = 'smart',
): Promise<D | null> {
  return (resolveEntryImpl<T, D>).call(this, params, pageMode, { page: 1 });
};

const resolveEntryImpl = async function resolveEntryImpl<
  T extends string,
  D extends Record<string, unknown>,
>(
  this: ClientModule,
  params: ResolveEntryParams<D>,
  pageMode: PageMode = 'smart',
  { page }: PageIndex,
): Promise<D | null> {
  const {
    identifier,
    indexEndpoint,
    dataEndpoint,
    identifierKey,
    fuse,
    searchFields,
  } = params;

  console.log('resolveEntryImpl', page, pageMode);

  if (typeof identifier === 'number') {
    const response = await this.client.get<Array<D>>(dataEndpoint, {
      [identifierKey]: identifier,
    });

    return (response.data && response.data[identifier]) ?? null;
  }

  if (typeof identifier === 'string') {
    const pageOptions: PageOptions = pageMode === 'smart' ? false : { page: 1 };

    const response = await this.client.get<Record<T, D>>(
      indexEndpoint,
      {
        fields: [...searchFields, identifierKey],
      },
      {},
      pageOptions,
    );

    const entries = response.data;
    console.log('response');

    if (!entries) {
      return null;
    }

    const collection: D[] = (Object.keys(entries) as T[]).reduce<D[]>(
      (accumulated, next: T): D[] => [...accumulated, entries[next]!],
      [] as D[],
    );

    fuse.setCollection(collection);

    const results = fuse.search(identifier);

    if (!results.length) {
      return null;
    }
    const [result1, ..._rest] = results;

    if (!result1) {
      return null;
    }

    console.log(pageMode, result1.score);

    if (pageMode === 'smart') {
      if (
        result1.score &&
        result1.score <= CONFIDENCE_SCORE_FOR_SMART_EARLY_RETURN
      ) {
        // skip and do the rest below
        throw new Error("HEHEHEHEHEHE")
      } else {
        console.log('here rexursing ', page);
        return (resolveEntryImpl<T, D>).call(this, params, pageMode, {
          page: page + 1,
        });
      }
    }
    // we are here, if we used full page mode or we have a good result

    // get the first entry, which is the best
    const {
      item: { [identifierKey]: matchedId },
    } = result1;

    const responseWithDetails = await this.client.get<Record<T, D>>(
      dataEndpoint,
      {
        [identifierKey]: matchedId,
      },
    );

    return responseWithDetails.data?.[matchedId as T] ?? null;
  }

  return Promise.reject(
    new TypeError('Expected a string or number as the entry identifier.'),
  );
};

/**
 * Extracts the top modules of each type from a given module tree. The modules
 *   with the highest experience cost are considered the 'top' modules.
 * @param {Object} moduleTree - The module tree.
 * @returns {Object} An object containing the top modules of each type found in
 *   the module tree. The module types are the keys and the module data are the values.
 * @private
 */
export const extractTopModules = function extractTopModules<
  EM extends EncyclopediaModule = EncyclopediaModule,
>(moduleTree: Record<string, EM>) {
  return Object.keys(moduleTree).reduce(
    (topModules: Record<string, EM>, moduleId) => {
      const module = moduleTree[moduleId];

      if (!module) {
        return topModules;
      }

      // eslint-disable-next-line camelcase
      const { price_xp, type } = module;

      // eslint-disable-next-line camelcase
      if (!topModules[type] || price_xp > topModules[type].price_xp) {
        return {
          ...topModules,
          [type]: module,
        };
      }

      return topModules;
    },
    {} as Record<string, EM>,
  );
};

/**
 * Localizes a slug using values returned from an API endpoint.
 */
interface LocalizeParams {
  method: string;
  type: string;
  slug: string;
}

export type Section = {
  name: string;
};

/**
 * Localizes a slug using values returned from an API endpoint.
 * @param {Object} params - The function parameters.
 * @param {string} params.method - The API method which returns the localization data.
 * @param {string} params.type - The type of slug being localized.
 * @param {string} params.slug - The slug being localized.
 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
 *   translated slug, or `undefined` if it couldn't be translated.
 * @this {ClientModule}
 * @private
 */
export const localize = function localize<T = string>(
  this: ClientModule,
  { method, type, slug }: LocalizeParams,
): Promise<T | null> {
  return this.client
    .get<Record<string, Record<string, T>>>(method, {})
    .then((response) => {
      const translations = response.data?.[type];

      if (!translations || typeof translations !== 'object') {
        throw new Error(`Invalid translation type: ${type}.`);
      }

      return translations[slug] ?? null;
    });
};
