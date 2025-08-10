import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports'; // adjust path if aws-exports.js is not in root

Amplify.configure(awsExports);
