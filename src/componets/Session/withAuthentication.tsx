import { Unsubscribe, User } from 'firebase';
import * as React from 'react';
import { Subtract } from 'utility-types';

import { Consumer, Provider } from './context';
import { withFirebase, WithFirebase } from '../Firebase';

export type WithAuthentication = { readonly authUser: User | null };

export const provideAuthentication = (BaseComponent: React.ComponentType) => {
	type HocProps = WithFirebase;
	type HocState = WithAuthentication;

	class HOC extends React.Component<HocProps, HocState> {
		readonly state: HocState = {authUser: null};
		private listener: Unsubscribe | undefined;

		componentDidMount(): void {
			this.listener = this.props.firebase.auth.onAuthStateChanged((authUser) => {
				authUser
					? this.setState({authUser})
					: this.setState({authUser: null});
			})
		}

		componentWillUnmount(): void {
			this.listener!();
		}

		render() {
			const {...restProps} = this.props as any;
			return (
				<Provider value={this.state.authUser}>
					<BaseComponent {...restProps}/>
				</Provider>
			);
		}
	}

	return withFirebase(HOC);
};

export const withAuthentication = <BaseProps extends WithAuthentication>(
	BaseComponent: React.ComponentType<BaseProps>
) => (props: Subtract<BaseProps, WithAuthentication>) => {
	{
		const {...restProps} = props as any;
		return (
			<Consumer>
				{authUser => <BaseComponent authUser={authUser} {...restProps}/>}
			</Consumer>
		);
	}
};
