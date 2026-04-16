let databaseReady = false;
let databaseError = null;

export const markDatabaseReady = () => {
  databaseReady = true;
  databaseError = null;
};

export const markDatabaseUnavailable = (error) => {
  databaseReady = false;
  databaseError = error instanceof Error ? error.message : String(error);
};

export const getDatabaseStatus = () => ({
  ready: databaseReady,
  error: databaseError,
});
