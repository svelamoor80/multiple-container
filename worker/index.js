const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const sub = redisClient.duplicate()

function fib(index) {
    if (index < 2) return 1
    return fib(index - 1) + fib(index - 2)
}

sub.on('message', (channel, message) => { //message is the index of the fibonacci seq that was submitted in the form
    redisClient.hset('values', message, fib(parseInt(message)))
})
sub.subscribe('insert')