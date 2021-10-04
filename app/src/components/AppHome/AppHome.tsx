import { Box, Container } from '@material-ui/core';
import { useContext } from 'react';
import { EduVaultContext } from '../../EduVaultContext';
// import { useSelector } from 'react-redux';
// import { selectDBState } from '../../model/db';
import { Notes } from '../Notes/Notes';

interface Props {}

export const AppHome = (props: Props) => {
  const { db } = useContext(EduVaultContext);
  // const dbState = useSelector(selectDBState);
  const Note = db?.coreCollections.Note;
  const dbSync = db?.sync;
  const dbPush = db?.push;

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        paddingTop={4}
        paddingBottom={4}
      >
        {Note && dbSync && dbPush && <Notes {...{ dbSync, dbPush, Note }} />}

        {/* <Box>{JSON.stringify(dbState)}</Box> */}
      </Box>
    </Container>
  );
};
