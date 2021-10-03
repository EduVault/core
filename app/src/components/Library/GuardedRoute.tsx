import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { selectLocalReady } from '../../model/db';

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
  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await auth();
      setAuthState(authorized ? 'authenticated' : 'notAuthenticated');
    };
    checkAuth();
  }, [auth]);

  return (
    <>
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
