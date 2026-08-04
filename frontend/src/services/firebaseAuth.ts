import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, type UserCredential } from 'firebase/auth';

// Standard Web Firebase App Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAetherDesignAIWebOAuthKey2026',
  authDomain: 'aetherdesign-ai.firebaseapp.com',
  projectId: 'aetherdesign-ai',
  storageBucket: 'aetherdesign-ai.appspot.com',
  messagingSenderId: '717267008139',
  appId: '1:717267008139:web:aetherdesignai',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface FirebaseGoogleAuthResult {
  email: string;
  name: string;
  avatar?: string;
}

export const signInWithGoogleFirebase = async (): Promise<FirebaseGoogleAuthResult | null> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;
    
    if (user && user.email) {
      return {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || undefined,
      };
    }
    return null;
  } catch (error: any) {
    console.warn('Firebase Google Sign-In error / configuration required:', error);
    return null;
  }
};
