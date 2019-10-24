import { RoleName } from '../../src/types/user.types';

describe('A user logs in and views their user details', () => {
  it('something', () => {
    let foo: number;
    foo = 0;
    expect(RoleName.PUBLISHER).to.be.equal('Publisher');
    expect(RoleName.PUBLISHER).to.not.equal('publisher');
    expect(foo).to.be.equal(0);
  });
});
