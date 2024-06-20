import mongoose from 'mongoose';

const accountDefinition = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  type: {
    type: String,
    required: true,
    default: 'oauth',
  },
  provider: {
    type: String,
    required: true,
  },
  providerAccountId: {
    type: String,
    required: true,
    unique: true,
  },
  refresh_token: { type: String },
  access_token: { type: String },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  session_state: { type: String },
  expires_at: { type: Number },
};

const accountSchema = new mongoose.Schema(accountDefinition);
const Account = mongoose.models.account || mongoose.model('account', accountSchema);

export default Account;
