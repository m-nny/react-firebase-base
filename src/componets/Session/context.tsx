import React from 'react';
import UserInfo from '../../models/UserInfo';

export type SessionContext = UserInfo | null;
export const {Provider, Consumer} = React.createContext<SessionContext>(null);

