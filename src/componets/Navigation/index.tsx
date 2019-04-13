import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import { withAuthentication, WithAuthentication } from '../Session';

type Props = WithAuthentication;

const Navigation: React.FC<Props> = ({authUser}) => (
	<div>{authUser ? <NavigationAuth/> : <NavigationNotAuth/>}</div>
);

const NavigationAuth = () => (
	<ul>
		<li>
			<Link to={ROUTES.LANDING}>Landing</Link>
		</li>
		<li>
			<Link to={ROUTES.HOME}>Home</Link>
		</li>
		<li>
			<Link to={ROUTES.ACCOUNT}>Account</Link>
		</li>
		<li>
			<SignOutButton/>
		</li>
	</ul>
);

const NavigationNotAuth = () => (
	<ul>
		<li>
			<Link to={ROUTES.LANDING}>Landing</Link>
		</li>
		<li>
			<Link to={ROUTES.SIGN_IN}> Sign in </Link>
		</li>
	</ul>
);

export default withAuthentication(Navigation);
