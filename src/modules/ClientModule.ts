import type BaseClient from '../clients/BaseClient'

/**
 * @classdesc A module within an API client.
 */
class ClientModule {
    readonly client: BaseClient

    readonly name: string

    /**
     * Constructor.
     * @param {BaseClient} client - The API client this module belongs to.
     * @param {string} name - The name of the module.
     */
    constructor(client: BaseClient, name: string) {
        /**
         * The API client this module belongs to.
         * @type {BaseClient}
         */
        this.client = client

        /**
         * The name of the module.
         * @type {string}
         */
        this.name = name
    }
}

export default ClientModule
