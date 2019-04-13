import React from 'react';
import { withFirebase, WithFirebase } from '../Firebase';


type Prop = WithFirebase;

const SignOutButton: React.FC<Prop> = ({firebase}) => (
	<button type="button" onClick={firebase.doSignOut}>
		Sign Out
	</button>
);

export default withFirebase(SignOutButton);
