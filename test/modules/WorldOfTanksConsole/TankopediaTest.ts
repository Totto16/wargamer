import 'dotenv/config';

import WorldOfTanksConsole from '../../../src/clients/WorldOfTanksConsole';
import { describe, expect, it } from 'vitest';

describe('Tankopedia', function () {
  const client = new WorldOfTanksConsole({
    realm: 'xbox',
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
        client.tankopedia.findVehicle('vk 30.01 (h)'),
      ).resolves.toHaveProperty('name', 'VK 30.01 (H)');
    });

    it('finds vehicles by short name', function () {
      return expect(
        client.tankopedia.findVehicle('medium i'),
      ).resolves.toHaveProperty('short_name', 'Medium I');
    });

    it('finds vehicles by partial match - long name', function () {
      return expect(
        client.tankopedia.findVehicle('Type 98'),
      ).resolves.toHaveProperty('name', 'Type 98 Ke-Ni');
    });

    it('finds vehicles by partial match - short name', function () {
      return expect(
        client.tankopedia.findVehicle('t1 heav'),
      ).resolves.toHaveProperty('short_name', 'T1 Heavy');
    });

    it('throws for invalid identifier types', function () {
      return expect(
        client.tankopedia.findVehicle({} as string),
      ).rejects.toBeInstanceOf(Error);
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
      ).resolves.toEqual('Tank Destroyers');
    });
  });

  describe('#localizeVehicleNation()', function () {
    it('localizes vehicle types', function () {
      return expect(
        client.tankopedia.localizeVehicleNation('china'),
      ).resolves.toEqual('China');
    });
  });
});
