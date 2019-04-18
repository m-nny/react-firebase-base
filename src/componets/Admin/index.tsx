import React from 'react';
import { withFirebase, WithFirebase } from '../Firebase';

type Props = WithFirebase;
type State = { loading: boolean, users: any[] }

class AdminPage extends React.Component<Props, State> {
	readonly state: State = {
		loading: false, users: []
	};

	render() {
		const {users, loading} = this.state;
		return (
			<div>
				<h1>Admin</h1>
				{loading && <div>Loading ...</div>}
				<UserList users={users}/>
			</div>
		);
	}

	componentDidMount(): void {
		this.setState({loading: true});
		this.props.firebase.users().on('value', snapshot => {
			if (!snapshot) return;
			const usersObject = snapshot.val();
			if (!usersObject) return;
			const usersList = Object.keys(usersObject).map(key => ({
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

const UserList: React.FC<{ users: any[] }> = ({users}) => (
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
			</li>
		))}
	</ul>
);

export default withFirebase(AdminPage);
