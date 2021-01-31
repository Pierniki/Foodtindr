import { connect } from 'mongoose';

// TODO move to .env
const connectWithMongoDb = () => {
  try {
    const uri = process.env.DB_URI;
    if (!uri) throw 'No connection string in .env';

    connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => {
        return console.info(`Successfully connected to mongo!`);
      })
      .catch((error: Error) => {
        console.error('Error connecting to database: ', error);
      });
  } catch (error) {
    console.error('connectWithMongoDb', error);
  }
};

export default connectWithMongoDb;
