'use client';

import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Authenticator } from '@aws-amplify/ui-react';
import { AMPLIFY_MOCK } from '../amplify-config';
import { fetchAuthSession } from 'aws-amplify/auth';

export const dynamic = 'force-dynamic';

function LoginInner() {
  const router = useRouter();
  const [nextUrl, setNextUrl] = useState('/');

  // Read ?next=... from the URL on the client (no useSearchParams)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('next') || '/';
      setNextUrl(p);
    }
  }, []);

  // Mock mode: skip login entirely
  useEffect(() => {
    if (AMPLIFY_MOCK) router.replace('/');
  }, [router]);

  // If already signed in, bounce to nextUrl
  useEffect(() => {
    (async () => {
      if (AMPLIFY_MOCK) return;
      try {
        const { tokens } = await fetchAuthSession();
        if (tokens?.idToken) router.replace(nextUrl);
      } catch {
        // not signed in yet — show Authenticator
      }
    })();
  }, [nextUrl, router]);

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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
