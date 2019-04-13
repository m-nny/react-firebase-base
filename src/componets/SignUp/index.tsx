import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import { withFirebase, WithFirebase } from '../Firebase/context';

const SignUpPage = () => (
	<div>
		<h1>SignUp</h1>
		<SignUpForm/>
	</div>
);

type Props = WithFirebase & RouteComponentProps;

type State = {
	username: string,
	email: string,
	passwordOne: string,
	passwordTwo: string,
	error: Error | null,
};

const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: null,
};

class SignUpFormBase extends React.Component<Props, State> {
	readonly state: State = {...INITIAL_STATE};

	onSubmit: React.FormEventHandler = (event) => {
		const {email, passwordOne} = this.state;

		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(() => {
				this.setState({...INITIAL_STATE});
				this.props.history.push(ROUTES.HOME);
			})
			.catch((error: Error) => {
				this.setState({error});
			});

		event.preventDefault();
	};

	onChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
		this.setState({[name]: value} as any);
	};

	render() {
		const {username, email, passwordOne, passwordTwo, error} = this.state;

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
