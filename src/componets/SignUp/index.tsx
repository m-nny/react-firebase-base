import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase, WithFirebase } from '../Firebase';
import ROUTES from '../../constants/routes';
import ROLES, { IRoles } from '../../constants/roles';

const SignUpPage = () => (
	<div>
		<h1>SignUp</h1>
		<SignUpForm/>
	</div>
);

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign-in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

type Props = WithFirebase & RouteComponentProps;

type State = {
	username: string,
	email: string,
	passwordOne: string,
	passwordTwo: string,
	isAdmin: boolean,
	error: Error | null,
};

const INITIAL_STATE: State = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	isAdmin: false,
	error: null,
};

class SignUpFormBase extends React.Component<Props, State> {
	readonly state = {...INITIAL_STATE};

	onSubmit: React.FormEventHandler = (event) => {
		const {username, email, passwordOne, isAdmin} = this.state;
		const roles: IRoles = {};
		if (isAdmin) {
			roles[ROLES.ADMIN] = ROLES.ADMIN;
		}

		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				return this.props.firebase
					.user(authUser.user!.uid)
					.set({username, email, roles})
			})
			.then(() => {
				return this.props.firebase.doSendEmailVerification();
			})
			.then(() => {
				this.setState({...INITIAL_STATE});
				this.props.history.push(ROUTES.HOME);
			})
			.catch((error) => {
				if (error.code == ERROR_CODE_ACCOUNT_EXISTS) {
					error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}
				this.setState({error});
			});

		event.preventDefault();
	};

	onChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
		this.setState({[name]: value} as any);
	};

	onChangeCheckbox: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, checked}}) => {
		this.setState({[name]: checked} as any);
	};

	render() {
		const {username, email, passwordOne, passwordTwo, isAdmin, error} = this.state;

		const isInvalid = passwordOne != passwordTwo || passwordOne == '' || username == '' || email == '';

		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="username"
					value={username}
					onChange={this.onChange}
					type="text"
					placeholder="Full Name"
				/>
				<input
					name="email"
					value={email}
					onChange={this.onChange}
					type="text"
					placeholder="Email Address"
				/>
				<input
					name="passwordOne"
					value={passwordOne}
					onChange={this.onChange}
					type="password"
					placeholder="Password"
				/>
				<input
					name="passwordTwo"
					value={passwordTwo}
					onChange={this.onChange}
					type="password"
					placeholder="Confirm Password"
				/>
				<label>
					Admin:
					<input
						name="isAdmin"
						type="checkbox"
						checked={isAdmin}
						onChange={this.onChangeCheckbox}
					/>
				</label>

				<button type="submit" disabled={isInvalid}>Sign Up</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

const SignUpForm = compose<Props, {}>(withRouter, withFirebase)(SignUpFormBase);

const SignUpLink = () => (
	<p>
		Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
	</p>
);

export default SignUpPage;

export { SignUpFormBase, SignUpLink };
