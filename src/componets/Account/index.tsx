import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization, { Condition } from '../Session/withAuthorization';
import { Consumer as AuthUserConsumer } from '../Session/context';

const Account: React.FC = () => (
	<AuthUserConsumer>
		{authUser => (
			<div>
				<h1>Account: {authUser!.email} </h1>
				<PasswordForgetForm/>
				<PasswordChangeForm/>
			</div>
		)}
	</AuthUserConsumer>
);

const condition: Condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
