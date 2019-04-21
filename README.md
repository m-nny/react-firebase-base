> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# React Firebase bootstrap project
This project implements general firebase usage tutorial using TypeScript.

## Todo
- [x] [A Firebase in React Tutorial for Beginners](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/)
- [x] [React Firebase Authorization with Roles](https://www.robinwieruch.de/react-firebase-authorization-roles-permissions/) 
- [x] [React Firebase Auth Persistence with Local Storage](https://www.robinwieruch.de/react-firebase-auth-persistence/)
- [x] [Social Logins in Firebase React: Google, Facebook, Twitter](https://www.robinwieruch.de/react-firebase-social-login/)
- [x] [How to link Social Logins with Firebase in React](https://www.robinwieruch.de/react-firebase-link-social-logins/)
- [x] [Email Verification with Firebase in React](https://www.robinwieruch.de/react-firebase-email-verification/)
- [x] [How to use React Router with Firebase](https://www.robinwieruch.de/react-firebase-router/)
- [x] [How to use Firebase Realtime Database in React](https://www.robinwieruch.de/react-firebase-realtime-database/)
- [x] [How to deploy a React application to Firebase](https://www.robinwieruch.de/firebase-deploy-react-js/)
- [ ] [How to use Redux in React Firebase](https://www.robinwieruch.de/react-firebase-redux-tutorial/)


### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Installation

* `git clone git@github.com:the-road-to-react-with-firebase/react-firebase-authentication.git`
* `cd react-firebase-authentication`
* `npm install`
* `npm start`
* visit http://localhost:3000

Get an overview of Firebase, how to create a project, what kind of features Firebase offers, and how to navigate through the Firebase project dashboard in this [visual tutorial for Firebase](https://www.robinwieruch.de/firebase-tutorial/).

#### Firebase Configuration

* copy/paste your configuration from your Firebase project's dashboard into one of these files
  * *src/components/Firebase/firebase.js* file
  * *.env* file
  * *.env.development* and *.env.production* files

The *.env* or *.env.development* and *.env.production* files could look like the following then:

```
REACT_APP_API_KEY=AIzaSyBtxZ3phPeXcsZsRTySIXa7n33NtQ
REACT_APP_AUTH_DOMAIN=react-firebase-s2233d64f8.firebaseapp.com
REACT_APP_DATABASE_URL=https://react-firebase-s2233d64f8.firebaseio.com
REACT_APP_PROJECT_ID=react-firebase-s2233d64f8
REACT_APP_STORAGE_BUCKET=react-firebase-s2233d64f8.appspot.com
REACT_APP_MESSAGING_SENDER_ID=701928454501
```

#### Activate Sign-In Methods

![firebase-enable-google-social-login_640](https://user-images.githubusercontent.com/2479967/49687774-e0a31e80-fb42-11e8-9d8a-4b4c794134e6.jpg)

* Email/Password
* [Google](https://www.robinwieruch.de/react-firebase-social-login/)
* [Facebook](https://www.robinwieruch.de/firebase-facebook-login/)
* [Twitter](https://www.robinwieruch.de/firebase-twitter-login/)
* [Troubleshoot](https://www.robinwieruch.de/react-firebase-social-login/)

#### Activate Verification E-Mail

* add a redirect URL for redirecting a user after an email verification into one of these files
  * *src/components/Firebase/firebase.js* file
  * *.env* file
  * *.env.development* and *.env.production* files

The *.env* or *.env.development* and *.env.production* files could look like the following then (excl. the Firebase configuration).

**Development:**

```
REACT_APP_CONFIRMATION_EMAIL_REDIRECT=http://localhost:3000
```

**Production:**

```
REACT_APP_CONFIRMATION_EMAIL_REDIRECT=https://mydomain.com
```

#### Security Rules

```
{
  "rules": {
    ".read": false,
    ".write": false,
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])",
        ".write": "$uid === auth.uid || root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])"
      },
      ".read": "root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])",
      ".write": "root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])"
    },
    "messages": {
      ".indexOn": ["createdAt"],
      "$uid": {
        ".write": "data.exists() ? data.child('userId').val() === auth.uid : newData.child('userId').val() === auth.uid"
      },
      ".read": "auth != null",
      ".write": "auth != null",
    },
  }
}
```

#### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
