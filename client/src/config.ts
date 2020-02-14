// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'i2yoez7wv3'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-lvrrz16d.auth0.com',            // Auth0 domain
  clientId: 'cPw3EAq81Hdf6jo8xPNTHN2JhSBc430a',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
