import React from 'react';
import { Subtract } from 'utility-types';

import { WithFirebase, withFirebase } from '../Firebase';
import { Condition } from './withAuthorization';
import { UserInfoConsumer } from '.';

interface InjectedProps {

}

const needsEmailVerification: Condition = userInfo =>
	userInfo != null &&
	!userInfo.emailVerified &&
	userInfo.providerData
		.map(provider => provider ? provider.providerId : '')
		.includes('password');


const withEmailVerification = <BaseProps extends InjectedProps>(BaseComponent: React.ComponentType<BaseProps>) => {
	type HocPros = Subtract<BaseProps, InjectedProps> & WithFirebase;
	type HocState = { isSent: boolean };

	class Hoc extends React.Component<HocPros, HocState> {
		static displayName = `withEmailVerification(${BaseComponent.name})`;
		// reference to original wrapped component
		static readonly WrappedComponent = BaseComponent;
		readonly state: HocState = {isSent: false};

		render() {
			const {...resetProps} = this.props;
			const {isSent} = this.state;
			return (
				<UserInfoConsumer>
					{userInfo =>
						needsEmailVerification(userInfo) ? (
							<div>
								{isSent ? (
									<p>
										E-Mail confirmation sent: Check you E-Mails (Spam
										folder included) for a confirmation E-Mail.
										Refresh this page once you confirmed your E-Mail.
									</p>
								) : (
									<p>
										Verify your E-Mail: Check you E-Mails (Spam folder
										included) for a confirmation E-Mail or send
										another confirmation E-Mail.
									</p>
								)}
								<button
									type="button"
									onClick={this.onSendEmailVerification}
									disabled={isSent}
								>
									Send confirmation E-mail
								</button>
							</div>
						) : (
							<BaseComponent {...resetProps}/>
						)
					}
				</UserInfoConsumer>
			);
		}

		onSendEmailVerification = () => {
			this.props.firebase.doSendEmailVerification()
				.then(() => this.setState({isSent: true}));
		}
	}

	return withFirebase(Hoc);
};


export default withEmailVerification;
