import 'dotenv/config';

import WorldOfTanks from '../../../src/clients/WorldOfTanks';
import WorldOfTanksConsole from '../../../src/clients/WorldOfTanksConsole';
import { describe, expect, it } from 'vitest';

describe('Authentication', function () {
  describe('World of Tanks', function () {
    const client = new WorldOfTanks({
      realm: 'na',
      applicationId: process.env.APPLICATION_ID,
    });

    describe('#renewAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', async function () {
          return await expect(
            client.authentication.renewAccessToken(),
          ).rejects.toBeInstanceOf(Error);
        });
      });
    });

    describe('#destroyAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', async function () {
          return await expect(
            client.authentication.destroyAccessToken(),
          ).rejects.toBeInstanceOf(Error);
        });
      });
    });
  });

  describe('World of Tanks Console', function () {
    const client = new WorldOfTanksConsole({
      realm: 'xbox',
      applicationId: process.env.APPLICATION_ID,
    });

    describe('#renewAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', async function () {
          return await expect(
            client.authentication.renewAccessToken(),
          ).rejects.toBeInstanceOf(Error);
        });
      });
    });

    describe('#destroyAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', async function () {
          return await expect(
            client.authentication.destroyAccessToken(),
          ).rejects.toBeInstanceOf(Error);
        });
      });
    });
  });
});
