import firebase from "firebase";

export class FirebaseError extends Error {
  public code?: string = undefined;

  constructor(code: string, message: string) {
    super(`FirebaseErrorCode: ${code}, FirebaseErrorMessage: ${message}`);
    this.code = code;
    this.message = message;
  }
}

export async function createUserWithEmailAndPassword(
  email: string,
  password: string
): Promise<firebase.auth.UserCredential> {
  try {
    const signUp = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    console.info("signUp done");
    console.info(signUp);
    return signUp;
  } catch (error) {
    console.error("createUserWithEmailAndPassword failed!");
    console.error(error);
    console.error(error.code);
    console.error(error.message);
    throw new FirebaseError(error.code, error.message);
  }
}

export async function getCurrentUser(): Promise<firebase.User | null> {
  return firebase.auth().currentUser;
}

export async function sendEmailVerification(
  user: firebase.User
): Promise<void> {
  try {
    const verification = await user.sendEmailVerification();
    console.info("sendEmailVerification done");
    console.info(verification);
    return verification;
  } catch (error) {
    console.error("sendEmailVerification failed!");
    console.error(error);
    console.error(error.code);
    console.error(error.message);
    throw new FirebaseError(error.code, error.message);
  }
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<firebase.auth.UserCredential> {
  try {
    const signIn = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    console.info("signIn done");
    console.info(signIn);
    return signIn;
  } catch (error) {
    console.error("signInWithEmailAndPassword failed!");
    console.error(error);
    console.error(error.code);
    console.error(error.message);
    throw new FirebaseError(error.code, error.message);
  }
}

export async function signOut(): Promise<void> {
  try {
    const signOut = await firebase.auth().signOut();
    console.info("signOut done");
    console.info(signOut);
    return signOut;
  } catch (error) {
    console.error("signOut failed!");
    console.error(error);
    console.error(error.code);
    console.error(error.message);
    throw new FirebaseError(error.code, error.message);
  }
}
