// Firebase Authentication Module
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "podelli-dev.firebaseapp.com",
    projectId: "podelli-dev",
    storageBucket: "podelli-dev.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authStateCallbacks = [];
        
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.setupAuthStateListener();
    }

    setupAuthStateListener() {
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded');
            return;
        }

        firebase.auth().onAuthStateChanged(async (user) => {
            this.currentUser = user;

            if (user) {
                const token = await user.getIdToken();
                api.setToken(token);
                localStorage.setItem('podelli_user', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName
                }));
            } else {
                api.setToken(null);
                localStorage.removeItem('podelli_user');
            }

            this.authStateCallbacks.forEach(callback => callback(user));
        });
    }

    onAuthStateChanged(callback) {
        this.authStateCallbacks.push(callback);
        if (this.currentUser !== null) {
            callback(this.currentUser);
        }
    }

    async signInWithEmail(email, password) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw this.formatAuthError(error);
        }
    }

    async signUpWithEmail(email, password, displayName) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName: displayName });
            return userCredential.user;
        } catch (error) {
            throw this.formatAuthError(error);
        }
    }

    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await firebase.auth().signInWithPopup(provider);
            return userCredential.user;
        } catch (error) {
            throw this.formatAuthError(error);
        }
    }

    async signOut() {
        await firebase.auth().signOut();
    }

    async getIdToken() {
        if (!this.currentUser) throw new Error('No user signed in');
        return await this.currentUser.getIdToken();
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/signin.html';
        }
    }

    formatAuthError(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered',
            'auth/invalid-email': 'Invalid email address',
            'auth/weak-password': 'Password is too weak',
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
        };
        return new Error(errorMessages[error.code] || error.message);
    }
}

const auth = new AuthManager();
