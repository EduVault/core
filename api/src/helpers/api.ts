import { Response } from 'express';
import { ApiRes } from '../types';
import { errors } from './errors';

export const respond =
  <T>(res: Response) =>
  (content: T, code = 200) => {
    const response: ApiRes<T> = { content, code };
    // res.status(200); // disabling to avoid resetting headers
    res.json(response);
  };

type ErrorKey = keyof typeof errors;

/**
 * @summary returns a standard error. The `code` is our internal error codes, and the status are standard http statuses
 */
export const respondError = (res: Response, error: ErrorKey, raw?: any) => {
  const response: ApiRes<any> = {
    content: errors[error].message + (raw ? JSON.stringify(raw) : ''),
    code: errors[error].code,
  };
  res.status(errors[error].status || 500);
  res.json(response);
};

/**
 * @description makes an object from a query string
 * @example 'param1=asdf&param2=asdf' => { param1: 'asdf', param2: 'asdf'}
 */
export const parseQueries = (queries: string) => {
  const parsed = Object.fromEntries(new URLSearchParams(queries));
  return parsed;
};

/**
 * @description makes a query string from an object
 * @example { param1: 'asdf', param2: 'asdf'} => 'param1=asdf&param2=asdf'
 */
export const formatQueries = (data: any) => {
  const queries = new URLSearchParams(Object.entries(data)).toString();
  return queries;
};
