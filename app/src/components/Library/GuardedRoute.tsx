import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import {
  selectLoggedIn,
  selectLoggingIn,
  selectLoginError,
} from '../../model/auth';
import { selectDBError, selectLocalReady } from '../../model/db';

interface GuardedRouteProps extends RouteProps {
  auth: () => Promise<boolean>;
  redirectTo: string;
}
export const GuardedRoute = ({
  auth,
  redirectTo,
  ...rest
}: GuardedRouteProps) => {
  const loggingIn = useSelector(selectLoggingIn);
  const loggedIn = useSelector(selectLoggedIn);
  const loginError = useSelector(selectLoginError);

  const localReady = useSelector(selectLocalReady);
  const dbError = useSelector(selectDBError);
  const error = dbError || loginError;

  const loading = loggingIn || !localReady;
  const authenticated = loggedIn;

  return (
    <>
      {error && <Route render={() => <Redirect to={redirectTo} exact />} />}
      {loading && <div />}
      {!loading && (
        <Route
          render={() =>
            authenticated ? (
              <Route {...rest} />
            ) : (
              <Redirect to={redirectTo} exact />
            )
          }
        />
      )}
    </>
  );
};
