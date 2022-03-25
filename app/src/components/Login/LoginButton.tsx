import { Link, makeStyles, Button } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { EduVaultContext } from '../../EduVaultContext';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(4),
    color: theme.palette.background.paper,
  },
}));

// third party login component
const LoginButton = () => {
  const classes = useStyles();

  const { setupLoginButton } = useContext(EduVaultContext);
  useEffect(() => {
    setupLoginButton({
      redirectURL: window.origin + '/app', // use origin not href to avoid including query params
      buttonID: 'eduvault-button',
      eduvaultAppUrl: window.origin + '/login', // 3rd party apps shouldn't set this. setting this to get it to work in dev with localhost
      log: true,
    });
  }, [setupLoginButton]);

  return (
    <Button color="secondary" className={classes.button} variant="contained">
      {
        <Link color="inherit" underline="none" href="/" id="eduvault-button">
          Login with EduVault
        </Link>
      }
    </Button>
  );
};

export default LoginButton;
