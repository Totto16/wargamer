import type BaseClient from '../clients/BaseClient'

export type RequestErrorOptions = {
  message?: string
  client: BaseClient
  statusCode: number
}

/**
 * @classdesc Generic API client error encountered during requests.
 * @extends Error
 */
class RequestError extends Error {
  readonly client: BaseClient
  readonly statusCode: number

  /**
   * Constructor.
   * @param {Object} options - The constructor options.
   * @param {string} options.message - The error message.
   * @param {BaseClient} options.client - The API client that the error originated
   *   from.
   * @param {number} options.statusCode - The HTTP status code of the request.
   */
  constructor({ message, client, statusCode }: RequestErrorOptions) {
    super(message)

    /**
     * The API client that the error originated from.
     * @type {BaseClient}
     */
    this.client = client

    /**
     * The HTTP status code of the request.
     * @type {number}
     */
    this.statusCode = statusCode
  }
}

export default RequestError
