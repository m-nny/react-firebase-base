import React from 'react';
import { Unsubscribe } from 'firebase';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';

import { withFirebase, WithFirebase } from '../Firebase';
import { Consumer } from './context';
import ROUTES from '../../constants/routes';
import UserInfo from '../../models/UserInfo';

type Props = WithFirebase & RouteComponentProps;
export type Condition = (userInfo: UserInfo | null) => boolean;

const withAuthorization = (condition: Condition) => (Component: React.ComponentType) => {
	class WithAuthorization extends React.Component<Props> {
		private listener: Unsubscribe | undefined;

		componentDidMount(): void {
			this.listener = this.props.firebase.onUserInfoListener(
				(authUser) => {
					if (!condition(authUser)) {
						this.props.history.push(ROUTES.SIGN_IN);
					}
				},
				() => this.props.history.push(ROUTES.SIGN_IN)
			);
		}

		componentWillUnmount(): void {
			this.listener!();
		}

		render() {
			return (
				<Consumer>
					{userInfo => condition(userInfo) ? <Component {...this.props}/> : null}
				</Consumer>
			);
		}
	}

	return compose<Props, {}>(
		withRouter,
		withFirebase,
	)(WithAuthorization);
};

export default withAuthorization;
