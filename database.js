const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

dbConnect = async (callback) => {
    try {
        const db = await MongoClient.connect(`mongodb+srv://poonam200023:<password>@cluster-expense.il1n7j4.mongodb.net/?retryWrites=true&w=majority`)
        console.log("mongo db connected");
        callback(db); 
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = dbConnect ;