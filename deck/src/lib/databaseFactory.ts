import { Database } from './database';
import MemoryDatabase from './memoryDatabase';
import MongoDBDatabase from './mongoDatabase';
// import other database implementations here as needed
// import MongoDBDatabase from './mongoDatabase';
// import PostgreSQLDatabase from './postgresqlDatabase';

let db : Database | null = null;

const constructDatabase = () => {
  if(process.env.MONGODB_URI) {
    console.log('Using MongoDBDatabase');
    return new MongoDBDatabase();
  }

  if(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('Using SupabaseDatabase');
    return new SupabaseDatabase();
  }
  else if(process.env.SUPABASE_URL || process.env.SUPABASE_ANON_KEY) {
    console.error('SUPABASE_URL OR SUPABASE_ANON_KEY is set. This is likely a configuration problem.  Both must be set to use SupabaseDatabase!');
  }


  console.log('Using MemoryDatabase');
  return new MemoryDatabase();
}

export const getDatabase = (): Database => {
  
  // Example:
  // if (process.env.DB_TYPE === 'mongo') {
  //   return new MongoDBDatabase();
  // } else if (process.env.DB_TYPE === 'postgresql') {
  //   return new PostgreSQLDatabase();
  // }

  if (!db) {
    db = constructDatabase();
  }
  return db;
};
