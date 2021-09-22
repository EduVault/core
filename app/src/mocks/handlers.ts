import { AsyncResponseResolverReturnType, MockedResponse, rest } from 'msw';

import { ApiRes } from '@eduvault/eduvault-js';

const URL_API = 'https://eduvault.org/api';

export const getHandler = <T>(
  route: string,
  data: T,
  code = 200,
  withAuth = false
) => {
  return rest.get(URL_API + route, (_req, res, ctx) => {
    if (withAuth) sessionStorage.setItem('is-authenticated', 'true');
    const response: AsyncResponseResolverReturnType<MockedResponse<ApiRes<T>>> =
      res(ctx.status(code), ctx.json({ code, content: data }));
    return response;
  });
};

export const handlers = [getHandler('/ping', 'pong')];
