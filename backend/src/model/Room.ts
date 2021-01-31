import mongoose from 'mongoose';

export interface Room extends mongoose.Document {
  id: {
    type: string;
    required: true;
  };
}

const RoomSchema = new mongoose.Schema({});

const Room = mongoose.model<Room>('Room', RoomSchema);
export default Room;
