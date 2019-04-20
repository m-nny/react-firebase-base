import React from 'react';
import { compose } from 'recompose';

import withAuthorization, { Condition } from '../Session/withAuthorization';
import { withEmailVerification } from '../Session';

const Home: React.FC = () => (
	<div>
		<h1>Home</h1>
		<p>The Home Page is accessible by every signed in user.</p>
	</div>
);

const condition: Condition = userInfo => !!userInfo;

export default compose(
	withEmailVerification,
	withAuthorization(condition),
)(Home);
