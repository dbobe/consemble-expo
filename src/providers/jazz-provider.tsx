import { useClerk } from '@clerk/clerk-expo';
import { JazzExpoProviderWithClerk } from 'jazz-tools/expo';
import type { ReactNode } from 'react';
import { ConsembleAccount } from '../db/jazz/schema';

export function MyJazzProvider({ children }: { children: ReactNode }) {
  const clerk = useClerk();
  const syncUrl = (process.env.EXPO_PUBLIC_JAZZ_SYNC_URL ||
    'wss://cloud.jazz.tools/?key=dev@joyofcoding.academy') as `wss://${string}`;
  return (
    <JazzExpoProviderWithClerk
      clerk={clerk}
      sync={{ peer: syncUrl, when: 'signedUp' }}
      AccountSchema={ConsembleAccount}
    >
      {children}
    </JazzExpoProviderWithClerk>
  );
}
