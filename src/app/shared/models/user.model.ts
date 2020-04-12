export class User {
  id: string;
  avatar: string;

  constructor(user) {
    this.id = user.id;
    this.avatar = user.avatar;
  }
}
