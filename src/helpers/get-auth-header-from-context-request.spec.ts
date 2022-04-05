import { IncomingMessage } from 'http';

import { getAuthHeaderFromContextRequest } from './get-auth-header-from-context-request';

describe('getAuthHeaderFromContextRequest', () => {
  it('returns a token from request headers', () => {
    const request = { headers: { authorization: 'Bearer fake-token' } } as IncomingMessage;
    expect(getAuthHeaderFromContextRequest(request)).toEqual('Bearer fake-token');
  });

  it('returns null when auth header missing', () => {
    const request = { headers: {} } as IncomingMessage;
    expect(getAuthHeaderFromContextRequest(request)).toEqual(null);
  });

  it('returns null when auth header incorrect', () => {
    const request = { headers: { authorization: 'IsBearer fake-token' } } as IncomingMessage;
    expect(getAuthHeaderFromContextRequest(request)).toEqual(null);
  });

  it('returns null when auth header not includes Bearer', () => {
    const request = { headers: { authorization: 'fake-token' } } as IncomingMessage;
    expect(getAuthHeaderFromContextRequest(request)).toEqual(null);
  });
});
