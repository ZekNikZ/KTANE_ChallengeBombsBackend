// Load .env if available
import dotenv from 'dotenv';
dotenv.config();

// Express server
import { setup as setupDB, shutdown as shutdownDB } from './db/db';
import server from './server';
const port = process.env.PORT || 3000;

server.listen(port, async () => {
    await setupDB('local');
    console.log(`server started at http://localhost:${port}`);
});

// Add shutdown hook
process.on('exit', async () => {
    // Shutdown DB connection
    await shutdownDB();
});
