import mongoose from 'mongoose';

const messageDefinition = {
  body: { type: String },
  image: { type: String },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chat',
    required: true,
  },
  sender: {
    type: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      name: { type: String, required: true },
      image: { type: String, required: true },
    },
    required: true,
  },
  seen: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
        name: { type: String, required: true },
      },
    ],
    required: true,
    default: [],
  },
};

const messageSchema = new mongoose.Schema(messageDefinition, { timestamps: true });
const Message = mongoose.models.message || mongoose.model('message', messageSchema);

export default Message;
