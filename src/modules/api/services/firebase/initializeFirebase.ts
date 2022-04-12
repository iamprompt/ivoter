import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app'

export const initializeFirebase = () => {
  if (!getApps().length) {
    return process.env.NODE_ENV === 'development'
      ? initializeApp({
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        })
      : initializeApp({
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
          }),
        })
  }

  return getApp()
}
