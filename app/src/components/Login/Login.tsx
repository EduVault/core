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
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    maxWidth: 600,
  },
  button: { marginTop: theme.spacing(4) },
  email: { marginBottom: theme.spacing(2) },
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
      pwLogin({ username: email, password, redirectURL: window.location.href })
    );
  };
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
          <PasswordForm submit={handlePasswordSubmit} />
        </Box>
      </Paper>
    </Container>
  );
};
