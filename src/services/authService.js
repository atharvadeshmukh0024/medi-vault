// src/services/authService.js

import { fetchAuthSession, getCurrentUser, signIn, signOut, signUp, confirmSignUp } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_fpaWtT4K1',
      userPoolClientId: 'c0an7e39jgq3639lgd7oaatol',
      region: 'ap-south-1',
    },
  },
});

// Signup
export const signUpUser = async (email, password) => {
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
      },
    },
  });
};

// Confirm signup
export const confirmUser = async (email, code) => {
  return confirmSignUp({ username: email, confirmationCode: code });
};

// Login
export const signInUser = async (email, password) => {
  return signIn({ username: email, password });
};

// Logout
export const signOutUser = async () => {
  return signOut();
};

// Get logged-in user
export async function getUser() {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();

    const now = Date.now();
    const idTokenExpiry = session.tokens?.idToken?.payload?.exp;
    const expiryTime = idTokenExpiry * 1000;

    if (expiryTime < now) {
      console.warn("Token expired. Logging out...");
      await signOut();  // auto logout
      return null;
    }

    return user;
  } catch (error) {
    console.log("session expired", error);
    return null;
  }
}