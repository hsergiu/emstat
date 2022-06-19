--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE Score (
  emote TEXT,
  userId TEXT,
  username TEXT NOT NULL,
  points INTEGER NOT NULL,
  PRIMARY KEY(emote, userId)
);

CREATE TABLE Configurations (
  name TEXT,
  serverId TEXT,
  value TEXT,
  PRIMARY KEY(name, serverId)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE Score;
DROP TABLE Configurations;