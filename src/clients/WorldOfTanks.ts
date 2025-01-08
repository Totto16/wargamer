import Accounts from '../modules/common/Accounts.ts';
import BaseClient, { type ClientOptions } from './BaseClient.ts';
import Tankopedia from '../modules/WorldOfTanks/Tankopedia.ts';

/**
 * @classdesc The World of Tanks API client.
 * @extends BaseClient
 */
class WorldOfTanks extends BaseClient {
  readonly accounts: Accounts;

  readonly tankopedia: Tankopedia;

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options: ClientOptions) {
    super({ ...options, type: 'wot' });

    /**
     * The client's Accounts module.
     * @type {Accounts}
     */
    this.accounts = new Accounts(this);

    /**
     * The client's Tankopedia module.
     * @type {Tankopedia}
     */
    this.tankopedia = new Tankopedia(this);
  }
}

export default WorldOfTanks;
