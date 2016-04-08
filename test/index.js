import {expect} from 'chai';
import {working} from '../src';

it('runs tests', () => {
  expect(working()).to.be.true;
});
