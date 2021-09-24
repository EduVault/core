import { Redirect, Route, RouteProps } from 'react-router-dom';

interface GuardedRouteProps extends RouteProps {
  auth: boolean;
}
export const GuardedRoute = ({ auth, ...rest }: GuardedRouteProps) => {
  return (
    <Route
      render={() =>
        auth === true ? <Route {...rest} /> : <Redirect to="/login" />
      }
    />
  );
};
