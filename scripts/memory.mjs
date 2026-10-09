// Runs the built site with accounts and orders kept in the server's memory,
// to try the server side on a machine with no database:
//   npm run start:memory -- --port 5402 --admin you@example.com
// Everything ordered is gone when the server stops.
process.env.NOBET_DB = 'memory';
delete process.env.MONGODB_URI;

const flag = (name) => {
  const at = process.argv.indexOf(name);
  return at > -1 ? process.argv[at + 1] : undefined;
};

// whoever joins with this address oversees the platform
const admin = flag('--admin');
if (admin) process.env.NOBET_ADMIN = admin;

process.argv = [process.argv[0], 'next', 'start', '--port', flag('--port') ?? '5402'];

await import('next/dist/bin/next');
