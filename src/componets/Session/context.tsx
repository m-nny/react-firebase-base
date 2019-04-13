import React from 'react';
import { User } from 'firebase';

export type SessionContext = User | null;
export const {Provider, Consumer} = React.createContext<SessionContext>(null);

