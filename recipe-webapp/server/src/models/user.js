/**
 * User Model - Data structure definition
 */
export class User {
  constructor(username, passwordHash) {
    this.username = username;
    this.passwordHash = passwordHash;
  }

  static create(username, passwordHash) {
    return new User(username, passwordHash);
  }

  toJSON() {
    return {
      username: this.username
    };
  }
}
