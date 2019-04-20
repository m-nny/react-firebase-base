import React from 'react';
import { Unsubscribe } from 'firebase';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';

import { withFirebase, WithFirebase } from '../Firebase';
import ROUTES from '../../constants/routes';
import UserInfo from '../../models/UserInfo';
import { UserInfoConsumer } from '.';

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
				<UserInfoConsumer>
					{userInfo => condition(userInfo) ? <Component {...this.props}/> : null}
				</UserInfoConsumer>
			);
		}
	}

	return compose<Props, {}>(
		withRouter,
		withFirebase,
	)(WithAuthorization);
};

export default withAuthorization;
