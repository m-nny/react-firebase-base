import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';

import UserInfo from '../../models/UserInfo';

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
	readonly auth: firebase.auth.Auth;
	readonly db: firebase.database.Database;
	readonly googleProvider: firebase.auth.GoogleAuthProvider;
	readonly githubProvider: firebase.auth.GithubAuthProvider;
	readonly serverValue = firebase.database.ServerValue;
	readonly emailProvider = firebase.auth.EmailAuthProvider;

	[provider: string]: firebase.auth.AuthProvider | any;

	constructor() {
		firebase.initializeApp(config);

		this.auth = firebase.auth();
		this.db = firebase.database();

		this.googleProvider = new firebase.auth.GoogleAuthProvider();
		this.githubProvider = new firebase.auth.GithubAuthProvider();
		this.googleProvider.addScope('email');
		this.githubProvider.addScope('user:email');
	}

	// *** Auth API ***

	doCreateUserWithEmailAndPassword = (email: string, password: string) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email: string, password: string) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignInWithGoogle = () =>
		this.auth.signInWithPopup(this.googleProvider);

	doSignInWithGithub = () =>
		this.auth.signInWithPopup(this.githubProvider);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = (password: string) => this.auth.currentUser!.updatePassword(password);

	doSendEmailVerification = () =>
		this.auth.currentUser!.sendEmailVerification({
			url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT || ''
		});

	// *** Merge Auth and DB User API *** //
	onUserInfoListener = (next: (userInfo: UserInfo) => void, fallback: () => void) =>
		this.auth.onAuthStateChanged(authUser => {
			if (authUser) {
				this.user(authUser.uid)
					.once('value')
					.then(snapshot => {
						if (!authUser)
							return;
						const dbUser = snapshot.val() || {};

						if (!dbUser.roles) {
							dbUser.roles = {};
						}

						const userInfo: UserInfo = {
							uid: authUser.uid,
							email: authUser.email,
							emailVerified: authUser.emailVerified,
							providerData: authUser.providerData,
							...dbUser,
						};
						next(userInfo);
					});
			} else {
				fallback();
			}
		});

	// *** User API ***

	user = (uid: string) => this.db.ref(`users/${uid}`);

	users = () => this.db.ref('users');

	// *** Message API ***

	message = (uid: string) => this.db.ref(`messages/${uid}`);

	messages = () => this.db.ref(`messages`);
}

export default Firebase;
