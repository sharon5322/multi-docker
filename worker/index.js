const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000      // retry once per second
});
const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2)  return 1;
    return fib(index - 1) + fib(index - 2);
}

// Everytime we see a message, calculate fib value and put it into 
// a Redis hash named 'value' and index/key of message
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
