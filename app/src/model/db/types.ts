export interface DBState {
  startingLocal: boolean;
  localReady: boolean;
  remoteReady: boolean;
  clientReady: boolean;
  error: string;
  syncing: boolean;
}
