import Cache from 'stale-lru-cache';
import request from 'superagent';
import type Response from 'superagent/lib/node/response';
import APIError, { type WargamingAPIError } from '../errors/APIError.ts';
import APIResponse from '../responses/APIResponse.ts';
import Authentication from '../modules/common/Authentication.ts';
import RequestError from '../errors/RequestError.ts';
import hashCode from '../utils/hashCode.ts';
import mapValues from '../utils/mapValues.ts';
import sortObjectByKey from '../utils/sortObjectByKey.ts';

export type RegionString = 'ru' | 'eu' | 'na' | 'kr' | 'asia';

export type Realm = 'xbox' | 'ps4';

export type RealmOrRegionString = Realm | RegionString;

/**
 * The options available to use on a client constructor.
 */
export type ClientOptions = {
  realm: RealmOrRegionString; // The realm/region this client is for.
  applicationId: string; // The application ID of this client.
  accessToken?: string | null; // The access token for this client, if it will be using one.
  language?: string | null; // The default localization language to use for API responses.
  // eslint-disable-next-line max-len
  cacheTimeToLive?: number; // The time to live in seconds for the client's data cache entries. `null` if no there is no TTL.
  cacheMaxSize?: number; // The max number of entries in the client's data cache.
};

export const defaultClientOptions: Partial<ClientOptions> = {
  accessToken: null,
  language: null,
  cacheTimeToLive: 600,
  cacheMaxSize: 250,
};

export type APIType = 'wot' | 'wotb' | 'wotx' | 'wows' | 'wowp' | 'wgn';

/**
 * The options available to use when making a single request.
 */
export type RequestOptions = {
  // eslint-disable-next-line max-len
  type: APIType; // The API to send this request to. One of: `wot`, `wotb`, `wotx`, `wows`, `wowp`, `wgn`.
  // eslint-disable-next-line max-len
  realm: RealmOrRegionString; // The realm/region to use for the request. One of: `ru`, `eu`, `na`, `kr`, `asia`, `xbox`, `ps4`.
};

/**
 * Mapping between realms and their TLDs.
 */
const REALM_TLD: Record<RealmOrRegionString, string> = {
  ru: 'ru',
  eu: 'eu',
  na: 'com',
  kr: 'kr',
  asia: 'asia',
  xbox: 'xbox',
  ps4: 'ps4',
};

type BaseURIGeneratorFunction = (realm: RealmOrRegionString) => string;

/**
 * Functions which generate the base URIs for various APIs.
 */
const BASE_URI: Record<APIType, BaseURIGeneratorFunction> = {
  wot: (realm) => `https://api.worldoftanks.${REALM_TLD[realm]}/wot`,
  wotb: (realm) => `https://api.wotblitz.${REALM_TLD[realm]}/wotb`,
  wotx: (realm) =>
    `https://api-${REALM_TLD[realm]}-console.worldoftanks.com/wotx`,
  wows: (realm) => `https://api.worldofwarships.${REALM_TLD[realm]}/wows`,
  wowp: (realm) => `https://api.worldofwarplanes.${REALM_TLD[realm]}/wowp`,
  wgn: (realm) => `https://api.worldoftanks.${REALM_TLD[realm]}/wgn`,
};

/**
 * Returns the base URI for a given realm and API type.
 * @throws {Error} Thrown if the given `realm` or `type` don't exist.
 */
function getBaseUri(realm: RealmOrRegionString, type: APIType): string {
  if (!REALM_TLD[realm] || !BASE_URI[type]) {
    throw new Error('Unknown realm or type given.');
  }

  return BASE_URI[type](realm);
}

type AnyCase<T extends string> = T | Lowercase<T> | Uppercase<T>;

type ModifiedClientOptions = ClientOptions & {
  realm: AnyCase<RealmOrRegionString>; // The realm/region this client is for. Can be in any case
};

export interface BaseClientOptions extends ModifiedClientOptions {
  type: APIType;
}

function toLowerCase<T extends string>(string: T): Lowercase<T> {
  return string.toLowerCase() as Lowercase<T>;
}

type HTTPMethod = 'GET' | 'POST';

type AdditionalRequestOptions = {
  method: HTTPMethod;
};

/**
 * @classdesc The base API client.
 */
class BaseClient {
  /**
   * The type of API this client is for.
   */
  readonly type: APIType;

  /**
   * The realm, i.e. region of this client.
   */
  readonly realm: RealmOrRegionString;

  /**
   * The application ID for this client.
   */
  readonly applicationId: string;

  /**
   * The access token for this client.
   */
  accessToken: string | null;

  /**
   * The default localization language for this client.
   */
  readonly language: string | null;

  /**
   * The client's Authentication module.
   */
  readonly authentication: Authentication;

  /**
   * The base API URI for this client.
   */
  readonly baseUri: string;

  /**
   * The API response cache.
   * @type {Cache}
   * @private
   */
  private cache: Cache<unknown, unknown>;

  /**
   * Constructor.
   * @throws {TypeError} Thrown if options are not well-formed.
   */
  constructor(options: BaseClientOptions) {
    const {
      type,
      realm,
      applicationId,
      accessToken,
      language,
      cacheTimeToLive,
      cacheMaxSize,
    } = { ...defaultClientOptions, ...options };

    const normalizedRealm = toLowerCase<AnyCase<RealmOrRegionString>>(realm);

    if (typeof realm !== 'string' || !REALM_TLD[normalizedRealm]) {
      throw new TypeError('Must specify a valid realm for the client.');
    } else if (typeof applicationId !== 'string') {
      throw new TypeError('Must specify an application ID for the client.');
    }

    this.type = type;

    this.realm = normalizedRealm;

    this.applicationId = applicationId;

    this.accessToken = accessToken ?? null;

    this.language = language ?? null;

    this.authentication = new Authentication(this);

    this.baseUri = getBaseUri(normalizedRealm, type);

    this.cache = new Cache<unknown, unknown>({
      maxAge: cacheTimeToLive,
      staleWhileRevalidate: 300,
      maxSize: cacheMaxSize,
    });
  }

  /**
   * Normalizes a given parameter type so the API can consume it.
   * @param {*} parameter - The parameter to normalize.
   * @returns {*} The normalized parameter.
   */
  static normalizeParameterValue<
    T extends string | Array<unknown> | Date | null,
  >(parameter: T): string | null {
    if (Array.isArray(parameter)) {
      return parameter.join(',');
    }
    if (parameter instanceof Date) {
      return parameter.toISOString();
    }

    return parameter;
  }

  /**
   * Sends a GET request to the API.
   * @param {string} method - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   */
  get<T = unknown>(
    method: string,
    params: Record<string, unknown> = {},
    options: Partial<BaseClientOptions> = {},
  ): Promise<APIResponse<T>> {
    return this.request<T>(method, params, { ...options, method: 'GET' });
  }

  /**
   * Sends a POST request to the API.
   * @param {string} method - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   */
  post<T = unknown>(
    method: string,
    params: Record<string, unknown> = {},
    options: Partial<BaseClientOptions> = {},
  ): Promise<APIResponse<T>> {
    return this.request<T>(method, params, { ...options, method: 'POST' });
  }

  /**
   * Fetches data from an endpoint method.
   * @param {string} apiMethod - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   * @private
   */
  request<T>(
    apiMethod: string,
    params: Record<string, unknown> = {},
    options: Partial<BaseClientOptions> &
      Partial<AdditionalRequestOptions> = {},
  ): Promise<APIResponse<T>> {
    return new Promise((resolve) => {
      const { type = this.type, realm = this.realm, method = 'GET' } = options;

      if (typeof apiMethod !== 'string') {
        throw new TypeError('Expected API method to be a string.');
      }

      const normalizedApiMethod = apiMethod.toLowerCase();
      const normalizedRealm = toLowerCase<AnyCase<RealmOrRegionString>>(realm);

      // construct the request URL
      const baseUrl =
        normalizedRealm === this.realm
          ? this.baseUri
          : getBaseUri(normalizedRealm, type);
      const requestUrl = `${baseUrl}/${normalizedApiMethod.replace(
        /^\/*(.+?)\/*$/,
        '$1',
      )}/`;

      // construct the payload
      const payload = {
        application_id: this.applicationId,
        access_token: this.accessToken,
        language: this.language,
        ...params,
      };

      const normalizedPayload = mapValues(
        payload,
        BaseClient.normalizeParameterValue,
      );

      // compute information for the cache
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
      const { application_id, ...rest } = normalizedPayload;
      const cacheKey = hashCode(
        `${requestUrl}${JSON.stringify(sortObjectByKey(rest))}`,
      );

      const fulfillResponse = <R>(response: Response): APIResponse<R> => {
        const { error = null } = response.body;

        if (error) {
          // Wargaming API error
          throw new APIError({
            client: this,
            statusCode: response.status,
            method: normalizedApiMethod,
            error,
          });
        }

        return new APIResponse({
          client: this,
          requestRealm: normalizedRealm,
          method: normalizedApiMethod,
          body: response.body,
        });
      };

      const rejectResponse = (
        value:
          | Error
          | RequestError
          | ({
              response: {
                error: WargamingAPIError & { status: number };
              };
            } & {
              body: {
                error: WargamingAPIError;
              };
            }),
      ) => {
        // check if this is a HTTP error or a Wargaming error
        if (value instanceof Error) {
          throw value;
        }

        // TODO: this isn't typed correctly
        const {
          response: { error },
        } = value;

        throw new RequestError({
          message: value.body.error.message,
          client: this,
          statusCode: error.status,
        });
      };

      if (method === 'GET') {
        const cached = this.cache.get(cacheKey);

        if (cached) {
          const response: APIResponse<T> = new APIResponse<T>({
            client: this,
            requestRealm: normalizedRealm,
            method: normalizedApiMethod,
            body: cached,
          });

          resolve(response);
        }

        const promise: Promise<APIResponse<T>> = request
          .get(requestUrl)
          .query(normalizedPayload)
          .then(fulfillResponse<T>)
          .then((apiResponse: APIResponse<T>): APIResponse<T> => {
            this.cache.set(cacheKey, apiResponse.body, {
              revalidate: (_key, callback) => {
                this.request(apiMethod, params, options)
                  .then((revalidateResponse) => {
                    callback(null, revalidateResponse.body);
                  })
                  .catch(callback);
              },
            });

            return apiResponse;
          })
          .catch(rejectResponse);

        resolve(promise);
      } else if (method === 'POST') {
        const promise: Promise<APIResponse<T>> = request
          .post(requestUrl)
          .type('form')
          .send(normalizedPayload)
          .then(fulfillResponse<T>)
          .catch(rejectResponse);

        resolve(promise);
      }

      // we should never get here
      throw new Error('Received invalid request method.');
    });
  }
}

export default BaseClient;
