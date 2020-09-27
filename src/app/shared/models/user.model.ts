export class User {
  uid: string;
  nickname: string;
  avatar?: string;

  constructor(partialUser: Partial<User>) {
    this.uid = partialUser.uid;
    this.avatar = partialUser.avatar;
  }
}
