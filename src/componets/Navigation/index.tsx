import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import { WithAuthentication, withAuthentication } from '../Session/withAuthentication';
import ROUTES from '../../constants/routes';
import UserInfo from '../../models/UserInfo';
import ROLES from '../../constants/roles';

type Props = WithAuthentication;

const Navigation: React.FC<Props> = ({userInfo}) => (
	<div>{userInfo ? <NavigationAuth userInfo={userInfo}/> : <NavigationNotAuth/>}</div>
);

type NavigationAuthProps = { userInfo: UserInfo };
const NavigationAuth: React.FC<NavigationAuthProps> = ({userInfo}) => (
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
		{!!userInfo.roles[ROLES.ADMIN] && (
			<li>
				<Link to={ROUTES.ADMIN}>Admin</Link>
			</li>
		)}
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
