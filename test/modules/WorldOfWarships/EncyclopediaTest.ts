import 'dotenv/config';

import { describe, expect, it } from 'vitest';
import WorldOfWarships from '../../../src/clients/WorldOfWarships';

describe('Encyclopedia', function () {
  const client = new WorldOfWarships({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  describe('#findShip()', function () {
    it('finds ships by ID', function () {
      return expect(
        client.encyclopedia.findShip(3522082512),
      ).resolves.toHaveProperty('name', 'ARP Nachi');
    });

    it('finds ships by name', function () {
      return expect(
        client.encyclopedia.findShip('kongo'),
      ).resolves.toHaveProperty('name', 'Kongo');
    });

    it('finds ships by partial name match', function () {
      return expect(
        client.encyclopedia.findShip('spite'),
      ).resolves.toHaveProperty('name', 'Warspite');
    });

    it('throws for invalid identifier types', function () {
      return expect(
        client.encyclopedia.findShip({} as string),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('#localizeShipType()', function () {
    it('localizes ship types', function () {
      return expect(
        client.encyclopedia.localizeShipType('AirCarrier'),
      ).resolves.toEqual('Aircraft Carrier');
    });
  });

  describe('#localizeLanguage()', function () {
    it('localizes languages', function () {
      return expect(
        client.encyclopedia.localizeLanguage('zh-tw'),
      ).resolves.toEqual('繁體中文');
    });
  });

  describe('#localizeShipModification()', function () {
    it('localizes ship modifications', function () {
      return expect(
        client.encyclopedia.localizeShipModification(
          'PCM026_LookoutStation_Mod_I',
        ),
      ).resolves.toEqual('Target Acquisition System Modification 1');
    });
  });

  describe('#localizeShipModule()', function () {
    it('localizes ship modules', function () {
      return expect(
        client.encyclopedia.localizeShipModule('TorpedoBomber'),
      ).resolves.toEqual('Torpedo Bombers');
    });
  });

  describe('#localizeShipNation()', function () {
    it('localizes ship nations', function () {
      return expect(
        client.encyclopedia.localizeShipNation('pan_asia'),
      ).resolves.toEqual('Pan-Asia');
    });
  });
});
