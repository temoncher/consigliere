export enum ErrorCode {
  NOT_FOUND = 'not-found',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
}

export enum ClubErrorCode {
  PRIVATE = 'club/is-private',
  ALREADY_A_MEMBER = 'club/already-a-member',
  FORBIDDEN = 'club/not-enough-permissions',
  NOT_FOUND = 'club/not-found',
  ALREADY_EXISTS = 'club/already-exists',
}

export enum ClubAdminErrorCode {
  NOT_ENOUGH_PERMISSIONS = 'club-admin/not-enough-permissions',
  SHOULD_RESIGN = 'club-admin/should-resign-before-leaving',
  SUCCESSOR_SHOULD_BE_CONFIDANT = 'club-admin/successor-should-be-confidant',
}

export enum UserErrorCode {
  NOT_FOUND = 'user/not-found',
}

export enum GameErrorCode {
  NOT_FOUND = 'game/not-found',
}
