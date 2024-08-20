import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import lodash from "lodash";

type Data = {
  data: any[];
};

// Setup LowDB file storage
const adapter = new JSONFile<Data>("lowdb.json");
const db = new Low(adapter, { data: [] });

db.data = db.data || { data: [] };

// Helper function to interact with DB using lodash
const _db = lodash.chain(db.data);

export const getDB = () => db;
export const getDBInstance = () => _db;

// Function to write to DB
export const writeDB = async () => {
  await db.write();
};
