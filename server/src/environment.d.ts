declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLOUD_RUNTIME_CONFIG?: string;
      FIREBASE_CONFIG?: string;
      FUNCTIONS_EMULATOR?: string;
      GCLOUD_PROJECT?: string;
      FIRESTORE_EMULATOR_HOST?: string;
      /**
       * Path to local application credentials
       */
      GOOGLE_APPLICATION_CREDENTIALS?: string;
      LANG?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
