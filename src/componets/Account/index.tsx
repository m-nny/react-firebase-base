import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization, { Condition } from '../Session/withAuthorization';
import { Consumer as UserInfoConsumer } from '../Session/context';

const Account: React.FC = () => (
	<UserInfoConsumer>
		{userInfo => (
			<div>
				<h1>Account: {userInfo!.email} </h1>
				<PasswordForgetForm/>
				<PasswordChangeForm/>
			</div>
		)}
	</UserInfoConsumer>
);

const condition: Condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
