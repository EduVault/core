export const URL_API =
  process.env.REACT_APP_SUPPRESS_MSW === 'true'
    ? 'https://localhost:8082/api'
    : undefined;
// console.log({ URL_API });
