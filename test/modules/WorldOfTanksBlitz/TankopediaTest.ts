import 'dotenv/config';

import WorldOfTanksBlitz from '../../../src/clients/WorldOfTanksBlitz';
import { describe, expect, it } from 'vitest';

describe('Tankopedia', function () {
  const client = new WorldOfTanksBlitz({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  describe('#findVehicle()', function () {
    it('finds vehicles by ID', function () {
      return expect(
        client.tankopedia.findVehicle(6673),
      ).resolves.toHaveProperty('name', 'Marder II');
    });

    it('finds vehicles by name', function () {
      return expect(
        client.tankopedia.findVehicle('m10 wolverine'),
      ).resolves.toHaveProperty('name', 'M10 Wolverine');
    });

    it('finds vehicles by partial name match', function () {
      return expect(
        client.tankopedia.findVehicle('universal carrier'),
      ).resolves.toHaveProperty('name', 'Universal Carrier 2-pdr');
    });

    it('throws for invalid identifier types', function () {
      return expect(
        client.tankopedia.findVehicle({} as string),
      ).rejects.toBeInstanceOf(Error);
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
        client.tankopedia.localizeAchievementSection('commemorative'),
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
        client.tankopedia.localizeVehicleNation('ussr'),
      ).resolves.toEqual('U.S.S.R.');
    });
  });
});
