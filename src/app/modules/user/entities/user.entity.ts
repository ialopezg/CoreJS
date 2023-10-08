import { db } from '../../database';

interface IUser extends db.Document {
  name: string;
  lastName: string;
}

type UserDocument = IUser & db.Document;

const UserSchema = new db.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
});

export const User = db.model('User', UserSchema);
