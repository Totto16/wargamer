import 'dotenv/config';

import WorldOfTanks from '../../../src/clients/WorldOfTanks';
import { describe, expect, it } from 'vitest';
import type { SearchType } from '../../../src/modules/common/Accounts';

describe('Accounts', function () {
  describe('World of Tanks', function () {
    const client = new WorldOfTanks({
      realm: 'eu',
      applicationId: process.env.APPLICATION_ID,
    });

    describe('#findPlayerId()', function () {
      it('finds exact matches', async function () {
        return await expect(
          client.accounts.findPlayerId('straik', 'exact'),
        ).resolves.toEqual(587268047);
      });

      it('finds fuzzy matches', async function () {
        return await expect(
          client.accounts.findPlayerId('salt', 'startswith'),
        ).resolves.toBeInstanceOf(Array);
      });

      it('throws for invalid search types', async function () {
        return await expect(
          client.accounts.findPlayerId('salt', 'false' as SearchType),
        ).rejects.toBeInstanceOf(Error);
      });
    });
  });
});
