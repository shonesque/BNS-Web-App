// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyApMuYhz4A8CLgBgfTStpcJfB2pTFZyGuY",
    authDomain: "bns-backdoorselling.firebaseapp.com",
    databaseURL: "https://bns-backdoorselling.firebaseio.com",
    projectId: "bns-backdoorselling",
    storageBucket: "bns-backdoorselling.appspot.com",
    messagingSenderId: "239972644790"
  }

};

export const actionCodeSettings = {
  // Your redirect URL
  url: 'https://actionablescience.com/login',
  handleCodeInApp: true,
};
