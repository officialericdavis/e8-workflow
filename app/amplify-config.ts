'use client';

import { Amplify } from 'aws-amplify';

const region = process.env.NEXT_PUBLIC_AWS_REGION ?? '';
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? '';
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ?? '';

const hasCognito = !!(region && userPoolId && userPoolClientId);

if (hasCognito) {
  Amplify.configure({
    Auth: {
      Cognito: {
        region,
        userPoolId,
        userPoolClientId,
      },
    },
  });
}

export const AMPLIFY_MOCK = !hasCognito;
