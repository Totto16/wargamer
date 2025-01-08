import type BaseClient from '../../clients/BaseClient'
import ClientModule from '../ClientModule'

export type Player = {
    account_id: number
}

export type SearchType = 'exact' | 'startswith'

/**
 * @classdesc Module for Accounts endpoints.
 * @extends ClientModule
 */
class Accounts extends ClientModule {
    /**
     * Constructor.
     * @param {BaseClient} client - The API client this module belongs to.
     */
    constructor(client: BaseClient) {
        super(client, 'accounts')
    }

    /**
     * Searches for player IDs given a nickname. Supports the search types available
     *   on the `account/list` endpoint.
     * @param {string} name - The player's nickname.
     * @param {string} [searchType='exact'] - The search type to use.
     * @returns {Promise.<(Array.<Object>|number|null), Error>} A promise resolving
     *   to the returned search results.
     * If `searchType` is `'startswith'`, the resolved value matches the data returned
     *   by the `account/list` endpoint.
     * If `searchType` is `'exact'`, the resolved value is the matching player's ID,
     *   or `null` if no match was found.
     */
    findPlayerId(
        name: string,
        searchType: SearchType = 'exact'
    ): Promise<Array<Player> | number | null> {
        switch (searchType.toLowerCase()) {
            case 'startswith':
                return this.client
                    .get<Player[]>('account/list', { search: name })
                    .then((response) => response.data ?? null)
            case 'exact':
                return this.client
                    .get<Player[]>('account/list', { search: name })
                    .then(
                        (response) =>
                            (response.data && response.data.length
                                ? response.data.at(0)?.account_id
                                : null) ?? null
                    )
            default:
                return Promise.reject(
                    new Error(
                        'Invalid search type specified for player search.'
                    )
                )
        }
    }
}

export default Accounts
