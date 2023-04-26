const mongoose = require('mongoose');
const app = require('./app');
const keys = require('./config/keys');

const start = async () => {
    try {
        await mongoose.connect(keys.mongoUrl).then(console.log('DB Connected'));
        app.listen(keys.port, () => {
            console.log(`App listens on port: ${keys.port}`)
        });
    } catch(error) {
        console.log(error);
    }
};

start()
