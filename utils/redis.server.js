const Redis = require('ioredis');
const { promisify } = require('util');

const REDIS_PORT = 6379

const client = new Redis(REDIS_PORT)

// Promisify the Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on('connect', () => {
    console.log('[redis]: Connected to Redis');
});

client.on('error', (err) => {
    console.error('[redis]: Redis Client Error', err);
});

module.exports = { client, getAsync, setAsync };