import { replacer } from '../../util/jsonHelper';

interface RoomConstructorProps {
  id: string;
  maxUsers: number;
  mealIds: string[];
  userIds: Set<string>;
  creator: string;
  userVotes?: Map<string, boolean[]>;
}

class Room {
  private id: string;
  private maxUsers: number;
  private mealIds: string[];
  private userIds: Set<string>;
  private creator: string;
  private userVotes: Map<string, boolean[]>;

  constructor({
    id,
    maxUsers = 2,
    mealIds,
    userIds,
    creator,
    userVotes,
  }: RoomConstructorProps) {
    this.id = id;
    this.maxUsers = maxUsers;
    this.mealIds = mealIds;
    this.userIds = userIds;
    this.creator = creator;
    this.userVotes = userVotes ? userVotes : new Map();
  }

  public getId() {
    return this.id;
  }

  public getUserIds() {
    return this.userIds;
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
    if (!this.userIds.has(userId)) throw Error('User not part of the room');
    const userVotes = this.userVotes.get(userId)
      ? this.userVotes.get(userId)!
      : [];
    if (userVotes.length >= this.mealIds.length) return null;
    return this.mealIds[userVotes.length];
  }

  public vote(userId: string, vote: boolean) {
    if (!this.userIds.has(userId)) throw Error('User not part of the room');
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
    return JSON.stringify(this, replacer);
  }
}

export default Room;
