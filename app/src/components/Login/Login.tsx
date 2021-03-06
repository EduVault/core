import { LoginButtonQueries } from '@eduvault/sdk-js';
import {
  Box,
  Container,
  Paper,
  Typography,
  Link,
  makeStyles,
} from '@material-ui/core';
// import { useState } from 'react';
import { EduVaultLogoFull } from '../../assets';
import { useDispatch } from '../../model';
import { pwLogin } from '../../model/auth';
import { PasswordForm } from './PasswordForm';
import LoginButton from './LoginButton';

interface Props {}
const useStyles = makeStyles((theme) => ({
  loginRoot: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  logo: { maxHeight: 200 },
  button: {
    marginTop: theme.spacing(4),
    color: theme.palette.background.paper,
  },
}));

export const Login = (props: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handlePasswordSubmit = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    dispatch(
      pwLogin({
        username: email,
        password,
        redirectURL: window.location.origin,
      })
    );
  };
  type ButtonKey = keyof LoginButtonQueries;
  const loginButtonQueries: ButtonKey[] = [
    'appID',
    'redirectURL',
    'clientToken',
  ];

  let hasLoginButtonQueries = false;
  const loginButtonQueriesSearch = loginButtonQueries.map((query) =>
    window.location.search.includes(query)
  );
  // if all three are present
  if (!loginButtonQueriesSearch.includes(false)) hasLoginButtonQueries = true;

  return (
    <Container maxWidth="sm">
      <Paper>
        <Box className={classes.loginRoot}>
          <EduVaultLogoFull className={classes.logo} />
          <Typography variant="h2">Eduvault</Typography>
          <Typography>
            Own your data. Sync between learning apps.{' '}
            <Link href="https://eduvault.org">Learn more</Link>
          </Typography>
          {hasLoginButtonQueries && (
            <PasswordForm submit={handlePasswordSubmit} />
          )}
          {!hasLoginButtonQueries && <LoginButton />}
        </Box>
      </Paper>
    </Container>
  );
};
