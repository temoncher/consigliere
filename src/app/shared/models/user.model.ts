export class User {
  id: string;
  avatar?: string;

  constructor(user: any) {
    this.id = user.id;
    this.avatar = user.avatar;
  }
}
