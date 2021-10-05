import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { selectLoginError } from '../../model/auth';
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
  const [authState, setAuthState] = useState<
    'loading' | 'authenticated' | 'notAuthenticated'
  >('loading');
  const dbLoaded = useSelector(selectLocalReady);
  const ready = dbLoaded && authState !== 'loading';
  const dbError = useSelector(selectDBError);
  const authError = useSelector(selectLoginError);
  const error = dbError && authError;
  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await auth();
      setAuthState(authorized ? 'authenticated' : 'notAuthenticated');
    };
    checkAuth();
  }, [auth]);

  return (
    <>
      {error && <Route render={() => <Redirect to={redirectTo} exact />} />}
      {!ready && <div />}
      {ready && (
        <Route
          render={() =>
            authState === 'authenticated' ? (
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
