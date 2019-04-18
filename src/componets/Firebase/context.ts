import React from 'react';

import Firebase from './firebase';

export type FirebaseContext = Firebase | null;
const {Provider, Consumer} = React.createContext<FirebaseContext>(null);

export { Provider as FirebaseProvider, Consumer as FirebaseConsumer };
