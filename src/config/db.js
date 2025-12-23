import postgres from 'postgres';
import { env } from './env.js';

class DB {
  sql = null;
  url = null;
  constructor(url) {
    this.url = url;
  }

  connect() {
    this.sql = postgres(this.url);
  }
}

const db = new DB(env.dbURL);
const connectDB = () => {
  try {
    db.connect();
  } catch (err) {
    console.log('DB CONNECTION ERROR', err);
  }
};

export { db, connectDB };
