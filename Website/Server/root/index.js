const app = require('./app');
const keys = require('./config/keys.js');

app.listen(keys.port);
console.log(`App listens on port: ${keys.port}`)
