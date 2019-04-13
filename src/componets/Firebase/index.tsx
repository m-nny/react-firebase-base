import { Subtract } from 'utility-types';
import * as React from 'react';
import Firebase from './firebase';
import { FirebaseConsumer, FirebaseProvider } from './context';

export type WithFirebase = { readonly firebase: Firebase };

export const withFirebase = <BaseProps extends WithFirebase>(
	BaseComponent: React.ComponentType<BaseProps>
) => (props: Subtract<BaseProps, WithFirebase>) => {
	{
		const {...restProps} = props as any;
		return (
			<FirebaseConsumer>
				{firebase => <BaseComponent firebase={firebase} {...restProps}/>}
			</FirebaseConsumer>
		);
	}
};

export { FirebaseProvider, FirebaseConsumer };
export default Firebase;

