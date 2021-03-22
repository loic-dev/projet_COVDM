
import config from "../../config/dev.mjs";
import mongo from 'mongodb';
const { MongoClient } = mongo;

const url_db = config.dev.database.host;
const dbClient = new MongoClient(url_db, { useUnifiedTopology: true});

export let db;

export const connectDatabase = async () => {
    const connect = await dbClient.connect();
    console.log("Database connected")
    db = connect.db(config.dev.database.name)
    return dbClient;
}



