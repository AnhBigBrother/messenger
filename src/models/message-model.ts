import mongoose from 'mongoose';

const messageDefinition = {
  body: { type: String },
  image: { type: String },
  seen: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    required: true,
    default: [],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chat',
    required: true,
  },
};

const messageSchema = new mongoose.Schema(messageDefinition);
const Message = mongoose.models.message || mongoose.model('message', messageSchema);

export default Message;
