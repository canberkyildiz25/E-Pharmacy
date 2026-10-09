import 'server-only';
import { MongoClient, type Collection, type Document } from 'mongodb';
import type { World } from '../types';
import { KEPT, type Kept, type Store, type User } from './store';

/* MongoDB. One client for the life of the server, one collection for the
   accounts and one for each list, with a unique index on every id so that two
   requests at once cannot both take the same one. */

interface Open {
  users: Collection<User>;
  lists: Record<Kept, Collection<Document>>;
}

const held = globalThis as { nobetMongo?: Promise<Open> };
const TAKEN = 11000;
const bare = { projection: { _id: 0 } } as const;

async function open(): Promise<Open> {
  const client = await new MongoClient(process.env.MONGODB_URI ?? '', { serverSelectionTimeoutMS: 4000, appName: 'nobet' }).connect();
  const base = client.db(process.env.MONGODB_DB || 'nobet');
  const users = base.collection<User>('users');
  const lists = Object.fromEntries(KEPT.map((part) => [part, base.collection<Document>(part)])) as Open['lists'];
  await Promise.all([users.createIndex({ email: 1 }, { unique: true }), users.createIndex({ id: 1 }, { unique: true }), ...KEPT.map((part) => lists[part].createIndex({ id: 1 }, { unique: true }))]);
  return { users, lists };
}

function collections(): Promise<Open> {
  held.nobetMongo ??= open().catch((error: unknown) => {
    // a failed connection is not remembered: the next request tries again
    held.nobetMongo = undefined;
    throw error;
  });
  return held.nobetMongo;
}

/** Whether the database answers. */
export async function reach(): Promise<boolean> {
  try {
    const { users } = await collections();
    await users.estimatedDocumentCount();
    return true;
  } catch (error) {
    console.error('Nobet: the database did not answer.', error instanceof Error ? error.message : error);
    return false;
  }
}

const taken = (error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === TAKEN;

export function mongo(): Store {
  return {
    async userByEmail(email) {
      const { users } = await collections();
      return users.findOne({ email }, bare);
    },
    async userById(id) {
      const { users } = await collections();
      return users.findOne({ id }, bare);
    },
    async users() {
      const { users } = await collections();
      return users.find({}, bare).limit(2000).toArray();
    },
    async addUser(user) {
      const { users } = await collections();
      try {
        await users.insertOne({ ...user });
        return true;
      } catch (error) {
        if (taken(error)) return false;
        throw error;
      }
    },
    async saveUser(user) {
      const { users } = await collections();
      await users.replaceOne({ id: user.id }, { ...user });
    },
    async load() {
      const { lists } = await collections();
      const found = await Promise.all(KEPT.map((part) => lists[part].find({}, bare).limit(5000).toArray()));
      return Object.fromEntries(KEPT.map((part, index) => [part, found[index]])) as unknown as Pick<World, Kept>;
    },
    async apply(change) {
      const { lists } = await collections();
      for (const part of KEPT) {
        const put = change.put[part] ?? [];
        const drop = change.drop[part] ?? [];
        if (put.length) await lists[part].bulkWrite(put.map((entry) => ({ replaceOne: { filter: { id: entry.id }, replacement: { ...entry }, upsert: true } })));
        if (drop.length) await lists[part].deleteMany({ id: { $in: drop } });
      }
    },
  };
}
