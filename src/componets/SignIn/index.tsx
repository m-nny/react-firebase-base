import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase, WithFirebase } from '../Firebase';
import { PasswordForgetLink } from '../PasswordForget';
import { ROUTES } from '../../constants';

const SignInPage = () => (
	<div>
		<h1>SignIn</h1>
		<SignInForm/>
		<PasswordForgetLink/>
		<SignUpLink/>
	</div>
);

type Props = WithFirebase & RouteComponentProps;

type State = {
	email: string;
	password: string;
	error: Error | null;
}

const INITIAL_STATE: State = {
	email: '',
	password: '',
	error: null,
};

class SignInFormBase extends React.Component<Props, State> {
	readonly state: State = {...INITIAL_STATE};

	render() {
		const {email, password, error} = this.state;

		const isInvalid = password === '' || email === '';

		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="email"
					value={email}
					onChange={this.onChange}
					type="text"
					placeholder="Email Address"
				/>
				<input
					name="password"
					value={password}
					onChange={this.onChange}
					type="password"
					placeholder="Password"
				/>
				<button disabled={isInvalid} type="submit">
					Sign In
				</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}

	private onSubmit: React.FormEventHandler = (event) => {
		const {email, password} = this.state;

		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState({...INITIAL_STATE});
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({error});
			});
		event.preventDefault();
	};

	private onChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
		this.setState({[name]: value} as any);
	};
}

const SignInForm = compose<Props, {}>(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

