import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization, { Condition } from '../Session/withAuthorization';
import { Consumer as UserInfoConsumer } from '../Session/context';
import UserInfo from '../../models/UserInfo';
import { WithFirebase, withFirebase } from '../Firebase';

type SignInMethod = { id: string, provider: string };
const SIGN_IN_METHODS: SignInMethod[] = [
	{
		id: 'password',
		provider: '',
	},
	{
		id: 'google.com',
		provider: 'googleProvider',
	}, {
		id: 'github.com',
		provider: 'githubProvider',
	},
];

const Account: React.FC = () => (
	<UserInfoConsumer>
		{userInfo => (
			<div>
				<h1>Account: {userInfo!.email} </h1>
				<PasswordForgetForm/>
				<PasswordChangeForm/>
				<LoginManagement userInfo={userInfo!}/>
			</div>
		)}
	</UserInfoConsumer>
);

type ManagementProps = WithFirebase & { userInfo: UserInfo };
type ManagementState = { activeSignInMethods: string[], error: Error | null };

class LoginManagementBase extends React.Component<ManagementProps> {
	readonly state: ManagementState = {activeSignInMethods: [], error: null};

	componentDidMount(): void {
		this.fetchSignInMethods();
	}

	fetchSignInMethods = () => {
		this.props.firebase.auth
			.fetchSignInMethodsForEmail(this.props.userInfo.email)
			.then(activeSignInMethods =>
				this.setState({activeSignInMethods, error: null}),
			)
			.catch(error => this.setState({error}));
	};

	onSocialLoginLink = (provider_name: string) => {
		const provider: firebase.auth.AuthProvider = this.props.firebase[provider_name];
		this.props.firebase.auth.currentUser!
			.linkWithPopup(provider)
			.then(this.fetchSignInMethods)
			.catch(error => {
				console.log(error);
				this.setState({error})
			});

	};

	onUnlink = (provider_id: string) => {
		this.props.firebase.auth.currentUser!
			.unlink(provider_id)
			.then(this.fetchSignInMethods)
			.catch(error => this.setState({error}));
	};

	onDefaultLoginLink = (password: string) => {
		const credential = this.props.firebase.emailProvider.credential(
			this.props.userInfo.email,
			password,
		);

		this.props.firebase.auth.currentUser!
			.linkAndRetrieveDataWithCredential(credential)
			.then(this.fetchSignInMethods)
			.catch(error => this.setState({error}));
	};

	render() {
		const {activeSignInMethods, error} = this.state;
		return (
			<div>
				Sign In Methods:
				<ul>
					{SIGN_IN_METHODS.map(signInMethod => {
						const onlyOneLeft = activeSignInMethods.length == 1;
						const isEnabled = activeSignInMethods.includes(
							signInMethod.id
						);
						return (
							<li key={signInMethod.id}>
								{
									signInMethod.id == 'password' ? (
										<DefaultLoginToggle
											onlyOneLeft={onlyOneLeft}
											isEnabled={isEnabled}
											signInMethod={signInMethod}
											onLink={this.onDefaultLoginLink}
											onUnlink={this.onUnlink}
										/>
									) : (
										<SocialLoginToggle
											onlyOneLeft={onlyOneLeft}
											isEnabled={isEnabled}
											signInMethod={signInMethod}
											onLink={this.onSocialLoginLink}
											onUnlink={this.onUnlink}
										/>
									)
								}
							</li>
						);
					})}
				</ul>
				{error && error.message}
			</div>
		);
	}
}

type DefaultToggleState = { passwordOne: string, passwordTwo: string };
type ToggleProps = {
	onlyOneLeft: boolean,
	isEnabled: boolean,
	signInMethod: SignInMethod,
	onLink: (value: string) => void,
	onUnlink: (provider_id: string) => void,
};

const SocialLoginToggle: React.FC<ToggleProps> = ({onlyOneLeft, isEnabled, signInMethod, onLink, onUnlink}) =>
	isEnabled ? (
		<button
			type="button"
			onClick={() => onUnlink(signInMethod.id)}
			disabled={onlyOneLeft}
		>
			Deactivate {signInMethod.id}
		</button>
	) : (
		<button
			type="button"
			onClick={() => onLink(signInMethod.provider)}
		>
			Link {signInMethod.id}
		</button>
	);


class DefaultLoginToggle extends React.Component<ToggleProps, DefaultToggleState> {
	readonly state: DefaultToggleState = {passwordOne: '', passwordTwo: ''};

	render() {
		const {
			onlyOneLeft,
			isEnabled,
			signInMethod,
			onUnlink,
		} = this.props;

		const {passwordOne, passwordTwo} = this.state;

		const isInvalid = passwordOne != passwordTwo || passwordOne == '';

		return isEnabled ? (
			<button
				type="button"
				onClick={() => onUnlink(signInMethod.id)}
				disabled={onlyOneLeft}
			>
				Deactivate {signInMethod.id}
			</button>
		) : (
			<form onSubmit={this.onSubmit}>
				<input
					name="passwordOne"
					value={passwordOne}
					onChange={this.onChange}
					type="password"
					placeholder="New Password"
				/>
				<input
					name="passwordTwo"
					value={passwordTwo}
					onChange={this.onChange}
					type="password"
					placeholder="Confirm New Password"
				/>
				<button disabled={isInvalid} type="submit">
					Link {signInMethod.id}
				</button>
			</form>
		);
	}

	onSubmit: React.FormEventHandler = (event) => {
		event.preventDefault();

		this.props.onLink(this.state.passwordOne);
		this.setState({passwordOne: '', passwordTwo: ''});
	};

	onChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
		this.setState({[name]: value} as any);
	}
}

const LoginManagement = withFirebase(LoginManagementBase);

const condition: Condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
