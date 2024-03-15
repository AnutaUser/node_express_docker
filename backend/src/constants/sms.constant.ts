import { ESmsActions } from '../enums';

export const smsConstant = {
  [ESmsActions.REGISTER]: (userName: string) =>
    `${userName}, welcome on board 😘`,

  [ESmsActions.FORGOT_PASSWORD]: (userName: string) =>
    `${userName}, you forgot your password🤔? Do not worry, we will help you🤗
    <a href="http://0.0.0.0/auth/password/forgot">button</a>`,

  [ESmsActions.DELETE]: (userName: string) =>
    `${userName}, we will miss you 😢`,
};
