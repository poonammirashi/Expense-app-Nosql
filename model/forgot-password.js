const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    _id: {
        type: mongoose.Schema.Types.UUID,
        default: mongoose.Types.UUID,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
