import { IncomingMessage } from 'http';

import { User } from '../users/models/user.model';

export type ContextRequestWithUser = IncomingMessage & { contextUser?: User };
