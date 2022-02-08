import { Box, Container, Typography } from '@material-ui/core';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { EduVaultContext } from '../../EduVaultContext';
import { selectDBError, selectDBState, selectLocalReady } from '../../model/db';
import { Notes } from '../Notes/Notes';

interface Props {}

const DBErrorMessage = ({ dbError }: { dbError: any }) => {
  return <Typography>{dbError}</Typography>;
};

export const AppHome = (props: Props) => {
  const { db } = useContext(EduVaultContext);
  const localReady = useSelector(selectLocalReady);
  const dbError = useSelector(selectDBError);
  const dbState = useSelector(selectDBState);
  const Note = db?.coreCollections ? db.coreCollections.Note : null;
  const sync = db?.sync;
  const push = db?.push;

  return (
    <Container>
      <Typography variant="h4">Eduvault App</Typography>
      <Box
        display="flex"
        flexDirection="column"
        paddingTop={4}
        paddingBottom={4}
      >
        {/* will only display app if db is loaded and notes collection is available */}
        {localReady && Note && sync && push && (
          <Notes {...{ sync, push, Note, db }} />
        )}
        {dbError && <DBErrorMessage dbError={dbError} />}
        <Box>{JSON.stringify(dbState)}</Box>
      </Box>
    </Container>
  );
};
