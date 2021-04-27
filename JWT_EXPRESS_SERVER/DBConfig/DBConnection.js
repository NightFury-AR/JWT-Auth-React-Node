const mongoose = require('mongoose');

const establishDBConnection = async () => {
        await mongoose.connect(process.env.DB_URI,{useFindAndModify:true,useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true});
        console.log(`MongoDB is up and running on ${process.env.DB_URI}`);
}

module.exports = establishDBConnection;