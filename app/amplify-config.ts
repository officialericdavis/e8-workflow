let awsExports: any = {};
try {
  // Amplify Hosting provides aws-exports.js in production; this works locally if present.
  awsExports = require('../aws-exports').default ?? {};
} catch {
  // Fallback so build doesn't fail if file isn't in repo or env.
  awsExports = {};
}
export default awsExports;
