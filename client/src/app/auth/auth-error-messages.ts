import { ErrorCode } from '~types/enums/error-code.enum';

export const authErrorMessages: { [key in ErrorCode]?: string } = {
  [ErrorCode.TOO_MANY_REQUESTS]: 'Попробуй попозже',
  [ErrorCode.USER_NOT_FOUND]: 'Не припоминаю тебя...',
  [ErrorCode.WRONG_PASSWORD]: 'Пароль не тот!',
  [ErrorCode.EMAIL_ALREADY_IN_USE]: 'Эта почта уже занята!',
};
