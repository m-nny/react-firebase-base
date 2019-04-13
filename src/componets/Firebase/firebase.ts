import * as app from 'firebase';
import 'firebase/auth';

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

console.log(config);

class Firebase {
	readonly auth: app.auth.Auth;

	constructor() {
		app.initializeApp(config);

		this.auth = app.auth()
	}

	// *** Auth API ***

	doCreateUserWithEmailAndPassword = (email: string, password: string) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email: string, password: string) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = (password: string) => {
		this.auth.currentUser!.updatePassword(password);
	}
}

export default Firebase;
