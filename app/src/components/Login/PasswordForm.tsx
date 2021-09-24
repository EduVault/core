import { Box, TextField, Button, makeStyles } from '@material-ui/core';
import { useState } from 'react';
interface Props {
  submit: ({ email, password }: { email: string; password: string }) => any;
}
const useStyles = makeStyles((theme) => ({
  passwordForm: {
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
export const PasswordForm = ({ submit }: Props) => {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [passwordValid, setPasswordValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const [passwordHelperText, setPasswordHelperText] = useState('');
  const [emailHelperText, setEmailHelperText] = useState('');

  const validateEmail = (enteredEmail: string) => {
    const email = enteredEmail.trim();
    setEmail(email);
    if (email.length <= 5 || email.length >= 64) {
      setEmailValid(false);
      setEmailHelperText('Email must be 5-64 characters long');
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailValid(false);
      setEmailHelperText('Invalid email');
    } else if (email.includes(' ')) {
      setEmailValid(false);
      setEmailHelperText('Email must not include spaces');
    } else {
      setEmailValid(true);
      setEmailHelperText('');
    }
  };
  const validatePassword = (password: string) => {
    setPassword(password);
    if (password.length < 8 || password.length >= 64) {
      setPasswordValid(false);
      setPasswordHelperText('Password must be 8-64 characters long');
    } else {
      setPasswordValid(true);
      setPasswordHelperText('');
    }
  };
  const loginValid = emailValid && passwordValid;

  return (
    <Box className={classes.passwordForm}>
      <TextField
        className={classes.email}
        value={email}
        onChange={(e) => validateEmail(e.target.value)}
        label="Email"
        placeholder="Enter email"
        type="email"
        helperText={emailHelperText}
        fullWidth
        required
        variant="outlined"
      />
      <TextField
        value={password}
        onChange={(e) => validatePassword(e.target.value)}
        label="Password"
        placeholder="Enter password"
        type="password"
        helperText={passwordHelperText}
        fullWidth
        required
        variant="outlined"
      ></TextField>
      <Button
        className={classes.button}
        color="primary"
        variant="outlined"
        disabled={!loginValid}
        onClick={() => submit({ email, password })}
      >
        Continue with Password
      </Button>
    </Box>
  );
};