import 'dotenv/config';

import Wargamer from '../src/Wargamer.ts';
import WorldOfTanks from '../src/clients/WorldOfTanks';
import WorldOfTanksBlitz from '../src/clients/WorldOfTanksBlitz';
import WorldOfTanksConsole from '../src/clients/WorldOfTanksConsole';
import WorldOfWarships from '../src/clients/WorldOfWarships';
import WorldOfWarplanes from '../src/clients/WorldOfWarplanes';
import Wargaming from '../src/clients/Wargaming';
import { describe, expect, it } from 'vitest';
import type { ClientOptions } from '../src/clients/BaseClient.ts';

describe('Wargamer', function () {
  it('correctly constructs clients', function () {
    const applicationId = process.env.APPLICATION_ID;

    expect(applicationId).toBeTypeOf('string');

    const options: ClientOptions = {
      realm: 'na',
      applicationId,
    };

    expect(Wargamer.WoT(options)).to.be.instanceof(WorldOfTanks);
    expect(Wargamer.WoTB(options)).to.be.instanceof(WorldOfTanksBlitz);
    expect(Wargamer.WoTX(options)).to.be.instanceof(WorldOfTanksConsole);
    expect(Wargamer.WoWS(options)).to.be.instanceof(WorldOfWarships);
    expect(Wargamer.WoWP(options)).to.be.instanceof(WorldOfWarplanes);
    expect(Wargamer.WGN(options)).to.be.instanceof(Wargaming);
  });
});
