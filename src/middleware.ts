export { default } from 'next-auth/middleware';

export const config = { matcher: ['/((?!register|signin|images|favicon).*)'] };
