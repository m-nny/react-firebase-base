import { Unsubscribe } from 'firebase';
import * as React from 'react';
import { Subtract } from 'utility-types';

import { Consumer, Provider } from './context';
import { withFirebase, WithFirebase } from '../Firebase';
import UserInfo from '../../models/UserInfo';

export type WithAuthentication = { readonly userInfo: UserInfo | null };

export const provideAuthentication = (BaseComponent: React.ComponentType) => {
	type HocProps = WithFirebase;
	type HocState = WithAuthentication;

	class HOC extends React.Component<HocProps, HocState> {
		readonly state: HocState = {userInfo: null};
		private listener: Unsubscribe | undefined;

		componentDidMount(): void {
			this.listener = this.props.firebase.onUserInfoListener(
				(userInfo) => this.setState({userInfo: userInfo}),
				() => this.setState({userInfo: null})
			);
		}

		componentWillUnmount(): void {
			this.listener!();
		}

		render() {
			const {...restProps} = this.props as any;
			return (
				<Provider value={this.state.userInfo}>
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
				{userInfo => <BaseComponent userInfo={userInfo} {...restProps}/>}
			</Consumer>
		);
	}
};
