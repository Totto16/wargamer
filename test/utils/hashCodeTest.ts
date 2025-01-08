import hashCode from '../../src/utils/hashCode';
import { describe, expect, it } from 'vitest';

describe('hashCode()', function () {
  it('hashes strings', function () {
    expect(hashCode('test')).to.be.a('string');
    expect(hashCode('')).to.be.a('string');
  });
});
