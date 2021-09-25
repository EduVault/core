import EduVault, { Database } from '@eduvault/sdk-js/dist/main';
import { Box, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

interface Props {}

export const AppHome = (props: Props) => {
  // start at login redirect page
  const eduvault = new EduVault({ appID: '1' });
  // receives the url params

  const [loadStatus, setLoadStatus] = useState('');
  let db: Database;
  useEffect(() => {
    eduvault.load({
      onStart: () => setLoadStatus('starting login'),
      onError: (err) => setLoadStatus(err),
      onReady: (creds) => setLoadStatus(JSON.stringify(creds)),
      log: true,
    });
    if (eduvault.db) db = eduvault.db;
  }, [eduvault]);

  return (
    <Box>
      <Typography variant="h3">Loading Status{loadStatus}</Typography>
      <p>logged in to app</p>
    </Box>
  );
};
