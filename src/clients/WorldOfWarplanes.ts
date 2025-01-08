import Accounts from '../modules/common/Accounts.ts';
import BaseClient, { type ClientOptions } from './BaseClient.ts';
import Encyclopedia from '../modules/WorldOfWarplanes/Encyclopedia.ts';

/**
 * @classdesc The World of Warplanes API client.
 * @extends BaseClient
 */
class WorldOfWarplanes extends BaseClient {
  readonly accounts: Accounts;

  readonly encyclopedia: Encyclopedia;

  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options: ClientOptions) {
    super({ ...options, type: 'wowp' });

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

export default WorldOfWarplanes;
