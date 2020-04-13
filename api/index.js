const mongoClient = require('mongodb').MongoClient;
const url = require('url');

const DB_HOST = 'mongodb://planningpoker-db:27017';
const DB_NAME = 'planningpoker';
const COLLECTION_PLAYERS = 'players';
const MS_PER_MINUTE = 60000;

const shortId = () => Math.random().toString(36).slice(-9).toUpperCase();
const updateOpts = { upsert: true };

const updatePlayer = async (name, room, id) => {
  if (!name) {
    throw 'No player name specified';
  }

  const db = await mongoClient.connect(DB_HOST);
  const playerId = id || shortId();

  const playerData = db
    .db(DB_NAME)
    .collection(COLLECTION_PLAYERS)
    .updateOne(
      {
        _id: playerId,
      },
      {
        $set: {
          _id: playerId,
          name: name,
          lastSeen: new Date(),
          room: room || shortId(),
        },
      },
      updateOpts,
    );

  db.close();

  return playerData;
};

const getRoom = async (roomId, playerId) => {
  if (!roomId) {
    throw 'No room ID specified';
  }

  const client = await mongoClient.connect(DB_HOST);
  const playerCollection = client.db(DB_NAME).collection(COLLECTION_PLAYERS);
  const fiveMinutesAgo = new Date(new Date().getTime() - (5 * MS_PER_MINUTE));
  const playerCollection = db.db(DB_NAME).collection(COLLECTION_PLAYERS);

  if (playerId !== undefined) {
    try {
      playerCollection
        .updateOne(
          {
            _id: playerId,
          },
          {
            $set: {
              lastSeen: new Date(),
              room: roomId,
            },
          },
        );
      } catch (e) {
        /* ignore the error */
      }
  }

  const players = await playerCollection
    .find({
      room: roomId,
      lastSeen: {
        $gte: fiveMinutesAgo,
      },
    })
    .toArray();

  const room = {
    id: roomId,
    players,
  };

  client.close();

  return room;
};

module.exports = async (action, request) => {
  const query = url.parse(request.url, true).query;
  let data = {};

  if (action.startsWith('player')) {
    data = await updatePlayer(query.name, query.room, query.id);
  } else if (action.startsWith('room')) {
    const roomId = action.replace('room', '').replace(/[^a-z0-9+]+/gi, '');
    data = await getRoom(roomId, query.id);
  }

  return [200, data];
};
