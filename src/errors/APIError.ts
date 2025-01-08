import type BaseClient from '../clients/BaseClient'
import RequestError, { type RequestErrorOptions } from './RequestError'

/**
 * The error object returned from Wargaming API methods.
 * @typedef {Object} WargamingAPIError
 * @property {number} code - The Wargaming API error code.
 * @property {string} message - The wargaming API error message.
 * @property {string} field - The Wargaming API error field.
 * @property {*} value - The Wargaming API error field value.
 */
export type WargamingAPIError<D = Record<string, unknown>> = {
    code: number
    message: string
    field: string
    value: D
}

/**
 * Constructor.
 */
interface APIErrorOptions<D = Record<string, unknown>>
    extends RequestErrorOptions {
    client: BaseClient
    statusCode: number
    url?: string
    requestRealm?: string
    method: string
    error: WargamingAPIError<D>
}

/**
 * @classdesc Error received from Wargaming's API.
 * @extends RequestError
 */
class APIError<D> extends RequestError {
    readonly requestRealm?: string | undefined
    readonly method: string

    readonly code: number
    readonly apiMessage: string
    readonly field: string
    readonly value: D

    /**
     * Constructor.
     * @param {Object} options - The constructor options.
     * @param {BaseClient} options.client - The API client that the error originated
     *   from.
     * @param {number} options.statusCode - The HTTP status code of the request.
     * @param {string} options.url - The URL that the request was for.
     * @param {string} options.requestRealm - The realm of the API that this error
     *   originated from.
     * @param {string} options.method - The API method that the request was for.
     * @param {WargamingAPIError} options.error - The error object returned from
     *   the API.
     */
    constructor({ requestRealm, method, error, ...rest }: APIErrorOptions<D>) {
        const { code, message, field, value } = error

        super({
            ...rest,
            message: `${code}: ${message}. Error field: ${field} => ${value}.`,
        })

        /**
         * The realm of the API that this response originated from.
         * @type {string}
         */
        this.requestRealm = requestRealm

        /**
         * The API method that the request was for.
         * @type {string}
         */
        this.method = method

        /**
         * The Wargaming API error code.
         * @type {number}
         */
        this.code = code

        /**
         * The message corresponding to the error code.
         * @type {string}
         */
        this.apiMessage = message

        /**
         * The field which was flagged in the error.
         * @type {string}
         */
        this.field = field

        /**
         * The value of the field which was flagged in the error.
         * @type {*}
         */
        this.value = value
    }
}

export default APIError
