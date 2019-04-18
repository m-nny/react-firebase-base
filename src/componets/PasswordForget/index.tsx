import React from 'react';
import { Link } from 'react-router-dom';

import { withFirebase, WithFirebase } from '../Firebase';
import { ROUTES } from '../../constants';

const PasswordForgetPage = () => (
	<div>
		<h1>PasswordForget</h1>
		<PasswordForgetForm/>
	</div>
);

type State = {
	email: string,
	error: Error | null,
};

type Props = WithFirebase;

const INITIAL_STATE: State = {email: '', error: null};

class PasswordForgetFormBase extends React.Component<Props, State> {
	readonly state: State = {...INITIAL_STATE};

	render() {
		const {email, error} = this.state;
		const isInvalid = email === '';
		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="email"
					value={email}
					onChange={this.onChange}
					type="text"
					placeholder="Email Address"
				/>
				<button disabled={isInvalid} type='submit'>
					Reset My Password
				</button>

				{error && <p>{error.message}</p>}

			</form>
		)
	}

	private onSubmit: React.FormEventHandler = (event) => {
		const {email} = this.state;

		this.props.firebase
			.doPasswordReset(email)
			.then(() => {
				this.setState({...INITIAL_STATE});
			})
			.catch(error => {
				this.setState({error: error});
			});
		event.preventDefault();
	};

	private onChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
		this.setState({[name]: value} as any);
	};
}

const PasswordForgetLink = () => (
	<p>
		<Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
	</p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
