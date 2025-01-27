import WorldOfTanks from './clients/WorldOfTanks.ts';
import WorldOfTanksBlitz from './clients/WorldOfTanksBlitz.ts';
import WorldOfTanksConsole from './clients/WorldOfTanksConsole.ts';
import WorldOfWarships from './clients/WorldOfWarships.ts';
import WorldOfWarplanes from './clients/WorldOfWarplanes.ts';
import Wargaming from './clients/Wargaming.ts';
import type { ClientOptions } from './clients/BaseClient';

/**
 * @classdesc The Wargamer client.
 */
class Wargamer {
  /**
   * Constructs a new World of Tanks API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfTanks} The API client.
   * @static
   */
  static WoT(options: ClientOptions) {
    return new WorldOfTanks(options);
  }

  /**
   * Constructs a new World of Tanks Blitz API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfTanksBlitz} The API client.
   * @static
   */
  static WoTB(options: ClientOptions) {
    return new WorldOfTanksBlitz(options);
  }

  /**
   * Constructs a new World of Tanks Console API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfTanksConsole} The API client.
   * @static
   */
  static WoTX(options: ClientOptions) {
    return new WorldOfTanksConsole(options);
  }

  /**
   * Constructs a new World of Warships API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfWarships} The API client.
   * @static
   */
  static WoWS(options: ClientOptions) {
    return new WorldOfWarships(options);
  }

  /**
   * Constructs a new World of Warplanes API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfWarplanes} The API client.
   * @static
   */
  static WoWP(options: ClientOptions) {
    return new WorldOfWarplanes(options);
  }

  /**
   * Constructs a new Wargaming.net API client.
   * @param {ClientOptions} options - The client options.
   * @returns {Wargaming} The API client.
   * @static
   */
  static WGN(options: ClientOptions) {
    return new Wargaming(options);
  }
}

export default Wargamer;
