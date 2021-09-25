import { Redirect, Route, RouteProps } from 'react-router-dom';

interface GuardedRouteProps extends RouteProps {
  auth: boolean;
  redirectTo: string;
}
export const GuardedRoute = ({
  auth,
  redirectTo,
  ...rest
}: GuardedRouteProps) => {
  return (
    <Route
      render={() =>
        auth === true ? <Route {...rest} /> : <Redirect to={redirectTo} exact />
      }
    />
  );
};
