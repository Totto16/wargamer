import 'dotenv/config';

import APIError from '../../src/errors/APIError';
import APIResponse from '../../src/responses/APIResponse';
import BaseClient, {
  type BaseClientOptions,
} from '../../src/clients/BaseClient';
import { describe, expect, it } from 'vitest';

describe('BaseClient', function () {
  describe('#constructor()', function () {
    it('correctly constructs itself', function () {
      const options: BaseClientOptions = {
        type: 'wot',
        realm: 'na',
        applicationId: process.env.APPLICATION_ID,
      };

      const defaultOptions = new BaseClient(options);

      expect(defaultOptions.type).to.equal(options.type);
      expect(defaultOptions.realm).to.equal(options.realm);
      expect(defaultOptions.applicationId).to.equal(options.applicationId);
      expect(defaultOptions.accessToken).to.be.null;
      expect(defaultOptions.baseUri).to.equal(
        'https://api.worldoftanks.com/wot',
      );

      const accessToken = new BaseClient({
        ...options,
        accessToken: 'foo',
      });

      expect(accessToken.type).to.equal(options.type);
      expect(accessToken.realm).to.equal(options.realm);
      expect(accessToken.applicationId).to.equal(options.applicationId);
      expect(accessToken.accessToken).to.equal('foo');
      expect(accessToken.baseUri).to.equal('https://api.worldoftanks.com/wot');
    });

    it('errors for malformed constructor options', function () {
      const badRealm = {
        type: 'wot',
        realm: 'foo',
        applicationId: process.env.APPLICATION_ID,
      };

      expect(() => new BaseClient(badRealm as BaseClientOptions)).to.throw(
        TypeError,
      );

      const nonStringRealm = {
        type: 'wot',
        realm: 2,
        applicationId: process.env.APPLICATION_ID,
      };

      expect(
        () => new BaseClient(nonStringRealm as unknown as BaseClientOptions),
      ).to.throw(TypeError);

      const nonStringApplicationId = {
        type: 'wot',
        realm: 'na',
        applicationId: 2,
      };

      expect(
        () =>
          new BaseClient(
            nonStringApplicationId as unknown as BaseClientOptions,
          ),
      ).to.throw(TypeError);
    });
  });

  describe('#request()', function () {
    describe('fulfillment', function () {
      const client = new BaseClient({
        type: 'wot',
        realm: 'na',
        applicationId: process.env.APPLICATION_ID,
      });

      const accountListSearch = client.get('account/list', {
        search: 'test',
      });

      it('fulfills with an APIResponse', function () {
        return expect(accountListSearch).resolves.toBeInstanceOf(APIResponse);
      });

      it('has required response properties - meta', function () {
        return expect(accountListSearch).resolves.toHaveProperty('meta');
      });

      it('has required response properties - data', function () {
        return expect(accountListSearch).resolves.toHaveProperty('data');
      });

      it('works with GET', function () {
        const accountListSearchGet = client.get('account/list', {
          search: 'test',
        });

        return expect(accountListSearchGet).resolves.toBeInstanceOf(
          APIResponse,
        );
      });

      it('works with POST', function () {
        const accountListSearchGet = client.post('account/list', {
          search: 'test',
        });

        return expect(accountListSearchGet).resolves.toBeInstanceOf(
          APIResponse,
        );
      });

      it('overrides request parameters as needed', function () {
        const badClient = new BaseClient({
          type: 'wot',
          realm: 'na',
          applicationId: 'lol',
        });

        const overriden = badClient.get('account/list', {
          search: 'test',
          application_id: process.env.APPLICATION_ID,
        });

        return expect(overriden).resolves.toBeInstanceOf(APIResponse);
      });

      it('overrides default client options as needed', function () {
        const accountListSearchRu = client.get(
          'account/list',
          { search: 'Straik' },
          { realm: 'ru' },
        );

        return expect(
          accountListSearchRu.then((response) => response.requestRealm),
        ).resolves.toEqual('ru');
      });

      it('trims method name slashes as needed', function () {
        const accountListSearchSlashes = client.get('/account/list/', {
          search: 'test',
        });

        return expect(accountListSearchSlashes).resolves.toBeInstanceOf(
          APIResponse,
        );
      });

      it('normalizes parameter values as needed', function () {
        const mapSearchIdAndNameOnly = client.get<
          Record<string, Record<string, unknown>>
        >('encyclopedia/arenas', {
          fields: ['arena_id', 'name_i18n'],
        });

        return expect(
          mapSearchIdAndNameOnly.then(
            (response) => response.data?.['05_prohorovka'],
          ),
        ).resolves.deep.equal({
          arena_id: '05_prohorovka',
          name_i18n: 'Prokhorovka',
        });
      });
    });

    describe('rejection', function () {
      const client = new BaseClient({
        type: 'wot',
        realm: 'na',
        applicationId: process.env.APPLICATION_ID,
      });

      const accountListSearchBadApplicationId = client.get<
        Record<string, unknown>
      >('account/list', {
        search: 'test',
        application_id: 'foo',
      });

      it('rejects with an APIError', function () {
        return expect(accountListSearchBadApplicationId).rejects.toBeInstanceOf(
          APIError,
        );
      });

      it('rejects with an INVALID_APPLICATION_ID error when given a bad application ID', function () {
        return expect(
          accountListSearchBadApplicationId.catch(
            (error: APIError<unknown>) => error.apiMessage,
          ),
        ).resolves.toEqual('INVALID_APPLICATION_ID');
      });

      it('rejects and logs the correct API method used', function () {
        return expect(
          accountListSearchBadApplicationId.then((error) => error.method),
        ).resolves.toEqual('account/list');
      });
    });
  });
});
