import Accounts from '../modules/common/Accounts.ts';
import BaseClient, { type ClientOptions } from './BaseClient.ts';
import Encyclopedia from '../modules/WorldOfWarships/Encyclopedia.ts';

/**
 * @classdesc The World of Warships API client.
 * @extends BaseClient
 */
class WorldOfWarships extends BaseClient {
  readonly accounts: Accounts;

  readonly encyclopedia: Encyclopedia;

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options: ClientOptions) {
    super({ ...options, type: 'wows' });

    /**
     * The client's Accounts module.
     * @type {Accounts}
     */
    this.accounts = new Accounts(this);

    /**
     * The client's Encyclopedia module.
     * @type {Encyclopedia}
     */
    this.encyclopedia = new Encyclopedia(this);
  }
}

export default WorldOfWarships;
