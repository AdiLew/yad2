const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: 'yad2-data'
}).catch(err =>
    console.log(err)
)