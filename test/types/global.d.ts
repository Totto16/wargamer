declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPLICATION_ID: string;
    }
  }
}
export {};
