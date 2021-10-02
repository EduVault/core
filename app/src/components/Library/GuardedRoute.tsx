import { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface GuardedRouteProps extends RouteProps {
  auth: () => Promise<boolean>;
  redirectTo: string;
}
export const GuardedRoute = ({
  auth,
  redirectTo,
  ...rest
}: GuardedRouteProps) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'authenticated' | 'notAuthenticated'
  >('loading');

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await auth();
      setLoadingState(authorized ? 'authenticated' : 'notAuthenticated');
    };
    checkAuth();
  }, [auth]);

  return (
    <>
      {loadingState === 'loading' && <div />}
      {loadingState !== 'loading' && (
        <Route
          render={() =>
            loadingState === 'authenticated' ? (
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
