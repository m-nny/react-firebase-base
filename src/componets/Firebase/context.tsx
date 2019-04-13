import React from 'react';
import Firebase from './firebase';
import { Subtract } from 'utility-types';

export type FirebaseContext = Firebase | null;
const {Provider, Consumer} = React.createContext<FirebaseContext>(null);

export type WithFirebase = { firebase: Firebase };

export const withFirebase = <BaseProps extends WithFirebase>(
	BaseComponent: React.ComponentType<BaseProps>
) => (props: Subtract<BaseProps, WithFirebase>) => {
	{
		const {...restProps} = props as any;
		return (
			<Consumer>
				{firebase => <BaseComponent firebase={firebase} {...restProps}/>}
			</Consumer>
		);
	}
};

export { Provider as FirebaseProvider, Consumer as FirebaseConsumer };
