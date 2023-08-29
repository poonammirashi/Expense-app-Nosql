const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
