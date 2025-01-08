import 'dotenv/config';

import { describe, expect, it } from 'vitest';
import WorldOfTanks from '../../../src/clients/WorldOfTanks';

//TODO: remove this, since it is a type hack
type PropertyHasFn = (
  key: string | number | symbol,
  value: unknown,
) => Promise<Chai.Assertion>;

describe('Tankopedia', function () {
  const client = new WorldOfTanks({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  describe('#findVehicle()', function () {
    it('finds vehicles by ID', function () {
      return expect(
        client.tankopedia.findVehicle(6673),
      ).resolves.toHaveProperty('name', 'Marder II');
    });

    it('finds vehicles by long name', function () {
      return expect(
        client.tankopedia.findVehicle('m10 wolverine'),
      ).resolves.toHaveProperty('name', 'M10 Wolverine');
    });

    it('finds vehicles by short name', function () {
      return expect(
        client.tankopedia.findVehicle('centurion ax'),
      ).resolves.toHaveProperty('short_name', 'Centurion AX');
    });

    it('finds vehicles by partial match - long name', function () {
      return expect(
        client.tankopedia.findVehicle('bat-chatillon'),
      ).resolves.toHaveProperty('name', 'Bat.-Châtillon 25 t');
    });

    it('finds vehicles by partial match - short name', function () {
      return expect(
        client.tankopedia.findVehicle('vae'),
      ).resolves.toHaveProperty('short_name', 'VAE Type B');
    });

    it('throws for invalid identifier types', function () {
      return expect(
        client.tankopedia.findVehicle({} as string),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('#findVehicleProfile()', function () {
    it('finds stock vehicle profiles', function () {
      return (
        expect(client.tankopedia.findVehicleProfile(6673)).resolves.deep
          .property as PropertyHasFn
      )('engine.name', 'Maybach HL 57 TR');
    });

    it('finds top vehicle profiles', function () {
      return (
        expect(client.tankopedia.findVehicleProfile(1, 'top')).resolves.deep
          .property as PropertyHasFn
      )('gun.name', '76 mm S-54');
    });

    it('finds vehicle profiles by ID', function () {
      return (
        expect(client.tankopedia.findVehicleProfile(1041, '21-1047-2066-4372'))
          .resolves.deep.property as PropertyHasFn
      )('modules.radio_id', 1047);
    });

    it('returns null when no matches are found - stock profile', function () {
      return expect(client.tankopedia.findVehicleProfile(-1)).resolves.be.null;
    });

    it('returns null when no matches are found - top profile', function () {
      return expect(client.tankopedia.findVehicleProfile(-1, 'top')).to.resolves
        .be.null;
    });

    it('rejects when the profile ID is invalid', function () {
      return expect(
        client.tankopedia.findVehicleProfile(-1, '66-7777-8888-9999'),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('#localizeCrewRole()', function () {
    it('localizes crew roles', function () {
      return expect(
        client.tankopedia.localizeCrewRole('radioman'),
      ).resolves.toEqual('Radio Operator');
    });
  });

  describe('#localizeLanguage()', function () {
    it('localizes languages', function () {
      return expect(
        client.tankopedia.localizeLanguage('zh-tw'),
      ).resolves.toEqual('繁體中文');
    });
  });

  describe('#localizeAchievementSection()', function () {
    it('localizes achievement sections', function () {
      return expect(
        client.tankopedia.localizeAchievementSection('memorial'),
      ).resolves.toEqual('Commemorative Tokens');
    });
  });

  describe('#localizeVehicleType()', function () {
    it('localizes vehicle types', function () {
      return expect(
        client.tankopedia.localizeVehicleType('AT-SPG'),
      ).resolves.toEqual('Tank Destroyer');
    });
  });

  describe('#localizeVehicleNation()', function () {
    it('localizes vehicle types', function () {
      return expect(
        client.tankopedia.localizeVehicleNation('czech'),
      ).resolves.toEqual('Czechoslovakia');
    });
  });
});
