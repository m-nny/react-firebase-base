import React from 'react';
import { compose } from 'recompose';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { withFirebase, WithFirebase } from '../Firebase';
import withAuthorization, { Condition } from '../Session/withAuthorization';
import { withEmailVerification } from '../Session';
import ROLES from '../../constants/roles';
import ROUTES from '../../constants/routes';

const AdminPage: React.FC = () => (
	<div>
		<h1>Admin</h1>
		<p>
			The Admin Page is accessible by every signed in admin user.
		</p>
		<Switch>
			<Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem}/>
			<Route exact path={ROUTES.ADMIN} component={UserList}/>
		</Switch>
	</div>
);

type UserDetails = {
	uid: string,
	email: string,
	username: string,
};
type ListProps = WithFirebase;
type ListState = { loading: boolean, users: UserDetails[] }

class UserListBase extends React.Component<ListProps, ListState> {
	readonly state: ListState = {loading: false, users: []};

	render() {
		const {users, loading} = this.state;
		return (
			<div>
				<h2>Users</h2>
				{loading && <div>Loading ...</div>}
				<ul>
					{users.map(user => (
						<li key={user.uid}>
							<span>
								<strong>ID:</strong> {user.uid}
							</span>
							<span>
								<strong>E-Mail:</strong> {user.email}
							</span>
							<span>
								<strong>Username:</strong> {user.username}
							</span>
							<span>
								<Link to={{
									pathname: `${ROUTES.ADMIN}/${user.uid}`,
									state: {user},
								}}>
									Details
								</Link>
							</span>
						</li>
					))}
				</ul>
			</div>
		);
	}

	componentDidMount(): void {
		this.setState({loading: true});

		this.props.firebase.users().on('value', snapshot => {
			if (!snapshot) return;
			const usersObject = snapshot.val();
			if (!usersObject) return;
			const usersList: UserDetails[] = Object.keys(usersObject).map(key => ({
				...usersObject[key],
				uid: key,
			}));
			this.setState({
				users: usersList,
				loading: false,
			})
		});
	}

	componentWillUnmount(): void {
		this.props.firebase.users().off();
	}
}

type MatchParams = { id: string };
type ItemProps = WithFirebase & RouteComponentProps<MatchParams>;
type ItemState = { loading: boolean, user: UserDetails | null };

class UserItemBase extends React.Component<ItemProps, ItemState> {
	readonly state: ItemState = {loading: false, user: null, ...this.props.location.state};

	render() {
		const {user, loading} = this.state;
		const {id} = this.props.match.params;
		return (
			<div>
				<h2>User ({id})</h2>
				{loading && <div>Loading ...</div>}

				{user && (
					<div>
						<span>
							<strong>ID:</strong> {user.uid}
						</span>
						<span>
							<strong>E-Mail:</strong> {user.email}
						</span>
						<span>
							<strong>Username:</strong> {user.username}
						</span>
						<button
							type="button"
							onClick={this.onSendPasswordResetEmail}
						>
							Send Password Reset
						</button>
					</div>
				)}
			</div>
		);
	}

	componentDidMount(): void {
		if (this.state.user) {
			return;
		}

		this.setState({loading: true});

		this.props.firebase
			.user(this.props.match.params.id)
			.on('value', snapshot => {
				this.setState({
					user: snapshot!.val(),
					loading: false,
				})
			})
	}

	componentWillUnmount(): void {
		this.props.firebase.user(this.props.match.params.id).off();
	}

	onSendPasswordResetEmail = () => {
		const {user} = this.state;
		if (user) {
			this.props.firebase.doPasswordReset(user.email);
		}
	}
}

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

const condition: Condition = (userInfo => userInfo != null && (!!userInfo.roles[ROLES.ADMIN]));

export default compose<ListProps, {}>(
	withEmailVerification,
	withAuthorization(condition),
	withFirebase,
)(AdminPage);
