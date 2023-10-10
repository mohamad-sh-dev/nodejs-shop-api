const redis = require('redis');

const redisCilent = redis.createClient({
    url: 'redis://red-ckillc8mccbs73afivmg:6379',
});
redisCilent.connect();
redisCilent.on('connect', () => {
    console.log('redis is connected...');
});
redisCilent.on('ready', () => {
    console.log('redis is ready to use...!');
});
redisCilent.on('error', (err) => {
    console.log('there is error in connected to redis', err);
});
redisCilent.on('disconnect', () => {
    console.log('redis is disconneted');
});

module.exports = redisCilent;
