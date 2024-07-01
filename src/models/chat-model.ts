import mongoose from 'mongoose';

const chatDefinition = {
  name: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  isGroup: {
    type: Boolean,
    required: true,
    default: false,
  },
  messages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }],
    required: true,
    default: [],
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message',
  },
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    required: true,
  },
};

const chatSchema = new mongoose.Schema(chatDefinition, { timestamps: true });
const Chat = mongoose.models.chat || mongoose.model('chat', chatSchema);

export default Chat;
