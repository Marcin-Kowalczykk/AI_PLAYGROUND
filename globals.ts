declare global {
  interface Window {
    OPENAI_API_KEY: string
  }

  interface ImportMeta {
    env: {
      VITE_OPENAI_API_KEY: string;
    };
  }
}

window.OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
