import dotenv from 'dotenv'

dotenv.config()


export const secret_key = process.env.AUTH_SECRET_KEY;
export const refresh_secrect_key = process.env.REFRESH_SECRET_KEY;
export const pass_key = process.env.NODEMAIL_PASS_KEY;
export const nodemail_user_id = process.env.NODEMAIL_USER_ID;


