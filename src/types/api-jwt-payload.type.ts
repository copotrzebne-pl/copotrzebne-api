import { JwtPayload } from 'jsonwebtoken';

export type ApiJwtPayload = JwtPayload & { user: { id: string }; exp: number };
