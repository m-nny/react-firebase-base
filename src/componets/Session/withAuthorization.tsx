import React from 'react';
import { Unsubscribe, User } from 'firebase';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';

import { withFirebase, WithFirebase } from '../Firebase';
import { Consumer } from './context';
import * as ROUTES from '../../constants/routes';

type Props = WithFirebase & RouteComponentProps;
export type Condition = (authUser: User | null) => boolean;

const withAuthorization = (condition: Condition) => (Component: React.ComponentType) => {
	class WithAuthorization extends React.Component<Props> {
		private listener: Unsubscribe | undefined;

		componentDidMount(): void {
			this.listener = this.props.firebase.auth.onAuthStateChanged(
				authUser => {
					if (!condition(authUser)) {
						this.props.history.push(ROUTES.SIGN_IN);
					}
				}
			);
		}

		componentWillUnmount(): void {
			this.listener!();
		}

		render() {
			return (
				<Consumer>
					{authUser => condition(authUser) ? <Component {...this.props}/> : null}
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
