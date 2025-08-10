'use client';

import { Amplify } from 'aws-amplify';

const region = process.env.NEXT_PUBLIC_AWS_REGION || '';
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '';

const hasCognito = Boolean(region && userPoolId && userPoolClientId);

// Configure Amplify; in mock mode we skip Auth entirely
Amplify.configure({
  ...(hasCognito ? { Auth: { Cognito: { region, userPoolId, userPoolClientId } } } : {}),
  ssr: false,
});

export const AMPLIFY_MOCK = !hasCognito;
