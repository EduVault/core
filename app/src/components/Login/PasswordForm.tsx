import { TextField, Button, makeStyles } from '@material-ui/core';
import { useRef, useState } from 'react';
import { useSelector } from '../../model';
import { selectLoggingIn, selectLoginError } from '../../model/auth';
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
  const disableButton = useSelector(selectLoggingIn) && !loginValid; // login status not in progress

  const passwordRef = useRef<HTMLInputElement>();
  const buttonRef = useRef<HTMLAnchorElement>();
  const handleEnterKeyEmail: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (e.key === 'Enter') passwordRef?.current?.focus();
  };
  const handleEnterKeyPassword: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    console.log(e.key);
    if (e.key === 'Enter') buttonRef?.current?.focus();
  };

  const errorText = useSelector(selectLoginError);
  return (
    <div className={classes.passwordForm} accessibility-role="form">
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
        onKeyPress={handleEnterKeyEmail}
      />
      <TextField
        inputRef={passwordRef}
        value={password}
        onChange={(e) => validatePassword(e.target.value)}
        label="Password"
        placeholder="Enter password"
        type="password"
        helperText={passwordHelperText}
        fullWidth
        required
        variant="outlined"
        onKeyPress={handleEnterKeyPassword}
      ></TextField>
      <Button
        ref={buttonRef as any}
        className={classes.button}
        color="primary"
        variant="outlined"
        disabled={disableButton}
        onClick={() => submit({ email, password })}
      >
        Continue with Password
      </Button>
      <p>{errorText}</p>
    </div>
  );
};
