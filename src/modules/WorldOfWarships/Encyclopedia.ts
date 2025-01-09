import Fuse from 'fuse.js';
import ClientModule from '../ClientModule.ts';
import { localize, resolveEntry } from '../mixins/Encyclopedia.ts';
import type BaseClient from '../../clients/BaseClient';

type Ship = {
  // TODO
  todo: 0;
};

/**
 * @classdesc Module for the World of Warships Encyclopedia endpoint.
 * @extends ClientModule
 */
class Encyclopedia extends ClientModule {
  private fuse: Fuse<string>;

  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  constructor(client: BaseClient) {
    super(client, 'encyclopedia');

    /**
     * The module's Fuse object.
     * @type {Fuse}
     * @private
     */
    this.fuse = new Fuse([], {
      keys: ['name'],
    });
  }

  /**
   * Searches for a ship by name or ID and returns its entry from the
   *   `encyclopedia/ships` endpoint.
   * @param {(number|string)} identifier - The ship identifier to use for lookup.
   * If a number is supplied, it is treated as the ship's ID.
   * If a string is supplied, the identifier is matched against ship names with
   *   the closest match being selected.
   * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
   *   matched ship, or `null` if no ships were matched.
   */
  findShip(identifier: number | string): Promise<object | null> {
    return (resolveEntry<string, Ship>).call(this, {
      identifier,
      indexEndpoint: 'encyclopedia/ships',
      dataEndpoint: 'encyclopedia/ships',
      identifierKey: 'ship_id',
      fuse: this.fuse,
      searchFields: ['name'],
    });
  }

  /**
   * Localizes a ship type slug.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipType(slug: string): Promise<string | null> {
    return (localize<string>).call(this, {
      method: 'encyclopedia/info',
      type: 'ship_types',
      slug,
    });
  }

  /**
   * Localizes a language slug.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeLanguage(slug: string): Promise<string | null> {
    return (localize<string>).call(this, {
      method: 'encyclopedia/info',
      type: 'languages',
      slug,
    });
  }

  /**
   * Localizes a ship modification slug.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipModification(slug: string): Promise<string | null> {
    return (localize<string>).call(this, {
      method: 'encyclopedia/info',
      type: 'ship_modifications',
      slug,
    });
  }

  /**
   * Localizes a ship module slug.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipModule(slug: string): Promise<string | null> {
    return (localize<string>).call(this, {
      method: 'encyclopedia/info',
      type: 'ship_modules',
      slug,
    });
  }

  /**
   * Localizes a ship nation slug.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipNation(slug: string): Promise<string | null> {
    return (localize<string>).call(this, {
      method: 'encyclopedia/info',
      type: 'ship_nations',
      slug,
    });
  }
}

export default Encyclopedia;
