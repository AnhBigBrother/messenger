import mongoose from 'mongoose';

const userDefinition = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  image: {
    type: String,
    default: '/images/man-avatar-1',
    required: true,
  },
  accounts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'account' }],
    default: [],
    required: true,
  },
  chats: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chat' }],
    default: [],
    required: true,
  },
};

const userSchema = new mongoose.Schema(userDefinition, { timestamps: true });
const User = mongoose.models?.user || mongoose.model('user', userSchema);

export default User;
