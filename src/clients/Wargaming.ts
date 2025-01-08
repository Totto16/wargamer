import Accounts from '../modules/common/Accounts'
import BaseClient, { type ClientOptions } from './BaseClient'

/**
 * @classdesc The Wargaming.net API client.
 * @extends BaseClient
 */
class Wargaming extends BaseClient {
    readonly accounts: Accounts

    /**
     * Constructor.
     * @param {ClientOptions} options - The client options.
     */
    constructor(options: ClientOptions) {
        super({ ...options, type: 'wgn' })

        /**
         * The client's Accounts module.
         * @type {Accounts}
         */
        this.accounts = new Accounts(this)
    }
}

export default Wargaming
