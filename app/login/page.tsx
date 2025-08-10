'use client';

import '@aws-amplify/ui-react/styles.css';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AMPLIFY_MOCK } from '../amplify-config';

export default function LoginPage() {
  const router = useRouter();
  const next = useSearchParams()?.get('next') || '/';
  const { authStatus } = useAuthenticator((ctx) => [ctx.authStatus]);

  // If running in mock mode, skip login
  useEffect(() => {
    if (AMPLIFY_MOCK) router.replace('/');
  }, [router]);

  // After real sign-in, go to destination
  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.replace(next);
    }
  }, [authStatus, next, router]);

  if (AMPLIFY_MOCK) return null;

  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ width: 420, maxWidth: '100%', background:'#fff', border:'1px solid #edf0f6', borderRadius:16, boxShadow:'0 20px 50px rgba(0,0,0,.08)' }}>
        <div style={{ padding: 16, borderBottom:'1px solid #edf0f6', fontWeight:900 }}>Sign in</div>
        <div style={{ padding: 16 }}>
          <Authenticator
            signUpAttributes={['email']}
            loginMechanisms={['email']}
            formFields={{
              signIn: {
                username: { label: 'Email address' },
                password: { label: 'Password' },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
