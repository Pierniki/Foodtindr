import { replacer, reviver } from '../../util/jsonHelper';

interface RoomConstructorProps {
  id: string;
  maxUsers: number;
  mealIds: string[];
  userIds: Set<string>;
  userVotes?: Map<string, boolean[]>;
}

class Room {
  private id: string;
  private maxUsers: number;
  private mealIds: string[];
  private userIds: Set<string>;
  private userVotes: Map<string, boolean[]>;

  constructor({
    id,
    maxUsers = 2,
    mealIds,
    userIds,
    userVotes,
  }: RoomConstructorProps) {
    this.id = id;
    this.maxUsers = maxUsers;
    this.mealIds = mealIds;
    this.userIds = userIds;
    this.userVotes = userVotes ? userVotes : new Map();
  }

  public getId() {
    return this.id;
  }

  public getVotesByUser(userId: string) {
    return this.userVotes.get(userId);
  }

  public getAllUserVotes() {
    return this.userVotes;
  }

  public isJoinable() {
    return this.userIds.size < this.maxUsers;
  }

  public join(userId: string) {
    if (!this.isJoinable()) throw Error('Room full.');
    this.userIds.add(userId);
    return true;
  }

  public getFirstMealId() {
    return this.mealIds[0];
  }

  public getNextMealId(userId: string) {
    if (!this.userVotes.has(userId)) throw Error('User not part of the room');
    const userVotes = this.userVotes.get(userId)
      ? this.userVotes.get(userId)!
      : [];
    if (userVotes.length >= this.mealIds.length) return null;
    return this.mealIds[userVotes.length - 1];
  }

  public vote(userId: string, vote: boolean) {
    if (!this.userVotes.has(userId)) throw Error('User not part of the room');
    const userVotes = this.userVotes.get(userId)
      ? this.userVotes.get(userId)!
      : [];
    this.userVotes.set(userId, [...userVotes, vote]);
    return userVotes.length;
  }

  public isVoteMatch(voteIdx: number) {
    return Array.from(this.userIds.keys()).every((userId) => {
      const userVotes = this.userVotes.get(userId);
      if (!userVotes) return false;
      return userVotes[voteIdx];
    });
  }

  public toString() {
    console.log(this.userIds, this.userVotes);
    const str = JSON.stringify(this, replacer);
    const tst = new Room(JSON.parse(str, reviver));
    console.log(tst.userIds, tst.userVotes);
    return JSON.stringify(this, replacer);
  }
}

export default Room;
