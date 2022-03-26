import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import { EduVaultLogoSmall } from '../../assets';
import { HomeOutlined, OpenInBrowser } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    list: {
      width: '250px',
    },
  })
);

export const links = [
  { text: 'Login', location: '/login' },
  { text: 'App', location: '/app' },
  { text: 'About Eduvault', location: '/home' },
];

export const NavBar = () => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  const NavListDrawer = () => (
    <Box
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List data-testid="nav-drawer-list">
        {links.map((link) => {
          return (
            <ListItem
              onClick={() => window.location.assign(link.location)}
              key={link.text}
              button
            >
              <ListItemIcon>
                {link.text === 'App' && <HomeOutlined />}
                {link.text === 'Login' && <OpenInBrowser />}
              </ListItemIcon>
              <ListItemText>
                <Link href={link.location}>{link.text}</Link>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.root}>
          <IconButton
            data-testid="nav-eduvault-logo"
            onClick={toggleDrawer(true)}
          >
            <EduVaultLogoSmall />
          </IconButton>
          <IconButton
            onClick={toggleDrawer(true)}
            edge="start"
            color="default"
            aria-label="menu"
            data-testid="nav-drawer-toggle"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {<NavListDrawer />}
      </Drawer>
    </>
  );
};
