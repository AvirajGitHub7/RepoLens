import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
} from "firebase/firestore";

const missingEnvVars: string[] = [];
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingEnvVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missingEnvVars.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingEnvVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) missingEnvVars.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missingEnvVars.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missingEnvVars.push("NEXT_PUBLIC_FIREBASE_APP_ID");

if (missingEnvVars.length > 0) {
  throw new Error(
    `[RepoLens Configuration Error]: Missing required Firebase environment variables in .env.local:\n` +
      missingEnvVars.map((name) => `  - ${name}`).join("\n") +
      `\n\nPlease check your .env.local file. You can use .env.local.example as a template.`
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID })
};

// Initialize Firebase client side
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore with IndexedDB offline persistence.
// persistentLocalCache serves reads from cache when the network isn't ready yet,
// which prevents the "client is offline" error that fires on page load when
// onAuthStateChanged restores a cached session before Firestore connects.
//
// The try/catch handles the HMR/fast-refresh case where initializeFirestore
// has already been called for this app instance.
function initDb() {
  if (typeof window === "undefined") {
    return getFirestore(app);
  }
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    // Already initialized (e.g. HMR in development) — return existing instance
    return getFirestore(app);
  }
}

export const db = initDb();

// Ensure session is persisted across page refreshes (localStorage)
// Fire-and-forget — any failure is non-fatal; Firebase defaults to LOCAL anyway
setPersistence(auth, browserLocalPersistence).catch(() => {});

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Set up scopes for provider
googleProvider.addScope("profile");
googleProvider.addScope("email");
githubProvider.addScope("repo");
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");
