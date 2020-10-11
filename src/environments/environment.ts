// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: 'Open Pe O',
  host: 'http://localhost:8000',
  hostName: '127.0.0.1:8000',
  debug: true,
  firebase: {
    apiKey: "AIzaSyBACirC-oZMsl8AXSL2YkQ5jmjbcrq34MU",
    authDomain: "openpeo-dev.firebaseapp.com",
    databaseURL: "https://openpeo-dev.firebaseio.com",
    projectId: "openpeo-dev",
    storageBucket: "openpeo-dev.appspot.com",
    messagingSenderId: "343674155373",
    appId: "1:343674155373:web:d032c0d1ca7ba15dda6a64",
    measurementId: "G-FN3EXTZMKQ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
