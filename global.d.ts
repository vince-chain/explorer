import type { WindowProvider } from 'wagmi';

type CPreferences = {
  zone: string;
  width: string;
  height: string;
}

declare global {
  export interface Window {
    ethereum?: WindowProvider;
    coinzilla_display: Array<CPreferences>;
    ga?: {
      getAll: () => Array<{ get: (prop: string) => string }>;
    };
  }
}
