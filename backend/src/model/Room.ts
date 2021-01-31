import mongoose from 'mongoose';

export interface Room extends mongoose.Document {
  id: string;
  users: string[];
}

const RoomSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  users: [String],
});

const Room = mongoose.model<Room>('Room', RoomSchema);
export default Room;
