import { db } from '../../database';

interface IUser extends db.Document {
  id?: string;
  name: string;
  lastName: string;
  username: string;
  password: string;
}

const UserSchema = new db.Schema<IUser>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = db.model('User', UserSchema);
