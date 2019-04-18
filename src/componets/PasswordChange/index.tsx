import React from 'react';

import { withFirebase, WithFirebase } from '../Firebase';

type Props = WithFirebase;

type State = {
	passwordOne: string,
	passwordTwo: string,
	error: Error | null,
};

const INITIAL_STATE: State = {
	passwordOne: '',
	passwordTwo: '',
	error: null,
};

class PasswordChangeForm extends React.Component<Props, State> {
	readonly state: State = {...INITIAL_STATE};

	render() {
		const {passwordOne, passwordTwo, error} = this.state;
		const isInvalid = passwordOne != passwordTwo || passwordOne === '';
		return (
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
					Reset My Password
				</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}

	private onSubmit: React.FormEventHandler = (event) => {
		const {passwordOne} = this.state;

		this.props.firebase
			.doPasswordUpdate(passwordOne)
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


export default withFirebase(PasswordChangeForm);
