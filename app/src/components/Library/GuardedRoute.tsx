import { Box } from '@material-ui/core';
import { FC, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { EduVaultContext } from '../../EduVaultContext';
import {
  selectLoggedIn,
  selectLoggingIn,
  selectLoginError,
} from '../../model/auth';

const LoadingAuthScreen = () => <Box>...checking auth status</Box>;
const RedirectToLogin = () => {
  const location = useLocation();
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export const RequireAuth: FC<any> = ({ children }) => {
  const { checkAuth } = useContext(EduVaultContext).api;
  let [authCheckResult, setAuthCheckResult] = useState(false);
  let [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    async function fetchAuth() {
      try {
        setCheckingAuth(true);
        setAuthCheckResult(await checkAuth());
        setCheckingAuth(false);
      } catch (error) {
        console.log('auth check error', error);
      } finally {
        setCheckingAuth(false);
      }
    }
    fetchAuth();
  }, [checkAuth]);

  const loggingIn = useSelector(selectLoggingIn);
  const loggedIn = useSelector(selectLoggedIn);
  const loginError = useSelector(selectLoginError);
  const loading = checkingAuth || loggingIn;
  const authenticated = loggedIn || authCheckResult;

  if (loading) return <LoadingAuthScreen />;
  else if (loginError) return <RedirectToLogin />;
  else if (!loading && authenticated) return children;
  else return <LoadingAuthScreen />;
};
