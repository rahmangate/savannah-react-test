import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { Profile } from '../model'
import { collection, addDoc, setDoc } from 'firebase/firestore'

//TODO: will later use .env
const firebaseConfig = {
  apiKey: 'AIzaSyButMgG3Zcdq2jug5Xi7ON_AagUpYxt8vQ',
  authDomain: 'react-test-app-78bd7.firebaseapp.com',
  projectId: 'react-test-app-78bd7',
  storageBucket: 'react-test-app-78bd7.appspot.com',
  messagingSenderId: '411771212932',
  appId: '1:411771212932:web:08ba31f8f3e825c0559ed1',
  measurementId: 'G-V23KX08RKZ',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

//auth.settings.appVerificationDisabledForTesting = true

export const signIn = async (phoneNumber: string) => {
  try {
    const applicationVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
    )

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      applicationVerifier,
    )

    return { success: true, confirmationResult: confirmationResult }
  } catch (err) {
    return { success: false, error: err?.toString(), confirmationResult: null }
  }
}

export const confirmCode = async (
  confirmationResult: any,
  verificationCode: any,
) => {
  try {
    const credential = await confirmationResult.confirm(verificationCode)

    return { success: true, credential: credential }
  } catch (err) {
    return { success: false, error: err?.toString(), credential: null }
  }
}

export const signOut = async () => {
  try {
    await auth.signOut()
    return { success: true }
  } catch (err) {
    console.log('auth error', err)
    return { success: false, error: err.toString() }
  }
}

export const addProfile = async (profile: Profile) => {
  try {
    const payload = { ...profile }
    delete payload['id']
    await setDoc(doc(db, 'users', profile.id), { ...payload })
    return { success: true, profile: profile }
  } catch (e) {
    return { success: false, error: e?.toString() }
  }
}

export const loadProfile = async (id: string) => {
  try {
    const docRef = doc(db, 'users', `${id}`)
    const profileDoc = await getDoc(docRef)
    if (profileDoc.exists()) {
      let profile: Profile = { id: profileDoc.id, ...profileDoc.data() }
      return { success: true, profile: profile }
    } else {
      return { success: true, profile: null, error: 'Profile does not exist' }
    }
  } catch (e) {
    return { success: false, error: e?.toString() }
  }
}
