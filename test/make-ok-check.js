import makeOkCheck from '../src/make-ok-check';
import {expect} from 'chai';


describe('makeOkCheck', () => {
  describe('given no options', () => {
    let defaultCheck;

    before(() => defaultCheck = makeOkCheck());

    it('defaults to checking http status is ok when given no opts', () => {
      const okResponse = { ok: true };

      expect(defaultCheck(okResponse)).to.deep.equal(okResponse);
    });

    it('defaults to throwing an error when not ok', () => {
      const badResponse = {
        ok: false
      };
      const checkNotOk = () => defaultCheck(badResponse);

      expect(checkNotOk).to.throw(Error);
    });
  });

  describe('given status codes to accept', () => {
    let statusCodeCheck;

    before(() => {
      statusCodeCheck = makeOkCheck({ okCodes: [403, 500] });
    });

    it('still passes response if status ok', () => {
      const okResponse = {
        ok: true
      };

      expect(statusCodeCheck(okResponse)).to.deep.equal(okResponse);
    });

    it('passes response if status not ok but code is acceptable', () => {
      const fourOhThree = {
        ok: false,
        status: 403
      };
      const fiveHundred = {
        ok: false,
        status: 500
      };

      expect(statusCodeCheck(fourOhThree)).to.deep.equal(fourOhThree);
      expect(statusCodeCheck(fiveHundred)).to.deep.equal(fiveHundred);
    });

    it('throws if status not ok and status code not acceptable', () => {
      const badResponse = {
        ok: false,i
        status: 404
      };
      const checkNotOk = () => statusCodeCheck(badResponse);

      expect(checkNotOk).to.throw(Error);
    });
  });

  describe('given a test function for checking responses', () => {
    let checkFoo;

    before(() => {
      checkFoo = makeOkCheck({ test: res => res.foo === true });
    });

    it('passes response if test returns true, regardless of status', () => {
      const fooNotOk = {
        ok: false,
        foo: true
      };
      const okFoo = {
        ok: true,
        foo: true
      };

      expect(checkFoo(fooNotOk)).to.deep.equal(fooNotOk);
      expect(checkFoo(okFoo)).to.deep.equal(okFoo);
    });

    it('throws if test returns false, regardless of status', () => {
      const okNoFoo = {
        ok: true
      };
      const notOkNoFoo = {
        ok: false
      };
      const runCheck = res => () => checkFoo(res);

      expect(runCheck(okNoFoo)).to.throw(Error);
      expect(runCheck(notOkNoFoo)).to.throw(Error);
    });
  });
});
