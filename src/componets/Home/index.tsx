import React from 'react';

import withAuthorization, { Condition } from '../Session/withAuthorization';

const Home: React.FC = () => (
	<div>
		<h1>Home</h1>
		<p>The Home Page is accessible by every signed in user.</p>
	</div>
);

const condition: Condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
