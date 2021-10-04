const HOST = process.env.REACT_APP_HOST;

export const URL_API =
  process.env.NODE_ENV === 'production'
    ? `https://${HOST}/api`
    : process.env.REACT_APP_SUPPRESS_MSW === 'true'
    ? 'https://localhost:8082/api'
    : undefined;
export const URL_WS_API =
  process.env.NODE_ENV === 'production'
    ? `wss://${HOST}/api/ws`
    : 'wss://localhost:8082/api/ws';

console.log({ URL_API });
