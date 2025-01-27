import Accounts from '../modules/common/Accounts.ts';
import BaseClient, { type ClientOptions } from './BaseClient.ts';
import Tankopedia from '../modules/WorldOfTanksConsole/Tankopedia.ts';

/**
 * @classdesc The World of Tanks Console API client.
 * @extends BaseClient
 */
class WorldOfTanksConsole extends BaseClient {
  readonly accounts: Accounts;

  readonly tankopedia: Tankopedia;

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options: ClientOptions) {
    super({ ...options, type: 'wotx' });

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

export default WorldOfTanksConsole;
