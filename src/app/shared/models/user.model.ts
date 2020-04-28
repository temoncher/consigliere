export class User {
  id: string;
  avatar?: string;

  constructor(partialUser: Partial<User>) {
    this.id = partialUser.id;
    this.avatar = partialUser.avatar;
  }
}
