![Printess Logo](PrintessLogoS.png)

# Getting Started with Printess in React

This repo shows how to get started with the printess editor in React.

To see how to get started with React itself, [click here](#how-to-get-started-with-create-react-app).

To get started with the printess editor in Vanilla JavaScript, go here <https://github.com/PrintessEditor/getting-started>.

## &nbsp;

# Embedding the Printess Editor

Printess can easily be loaded from our CDN.

Be aware that Printess itself is loaded after the webcomponents polyfills. So first we need to load **webcomponentjs** from the Printess CDN by adding the following script inside the `index.html` file.

```html
<script src="https://editor.printess.com/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
```

The next step is to wait for **WebComponentsReady** before loading Printess itself.

```html
<script type="module">
  window.WebComponents = window.WebComponents || {
    waitFor(cb) {
      addEventListener('WebComponentsReady', cb);
    },
  };
  function loadPrintessEditor() {
    return new Promise(async (resolve) => {
      WebComponents.waitFor(async () => {
        let printessLoader = await import(
          'https://editor.printess.com/printess-editor/printess-editor.js'
        );
        resolve(printessLoader);
      });
    });
  }
  window.loadPrintessEditor = loadPrintessEditor;
</script>
```

## &nbsp;

# Initializing Printess

In the app (e.g. `index.tsx`) Printess will be initialized by calling `attachPrintess`. The call also passes the authentication token and the name of the template to be loaded.

```javascript
let printessLoader: PrintessLoader | null = null;
let printess: Printess | null

function loadPrintessEditor(): Promise<boolean> {
  return new Promise(async resolve => {
    console.log('PrintessEditor loading');

    async function loadEditor() {
      try {
        printessLoader = await (window as any).loadPrintessEditor();
        return true;
      } catch {
        return false;
      }
    }

    let loadResult = await loadEditor();
    if (!loadResult) {
      resolve(false);
      return;
    }

    resolve(true);

    attachPrintessToDiv();
  });
};

loadPrintessEditor();

async function attachPrintessToDiv() {
  if (printessLoader === null) {
    throw new Error ('Printess library has not been loaded');
  } else {
    printess = await printessLoader?.attachPrintess({
      resourcePath: "https://editor.printess.com/printess-editor", // needs to be always set
      domain: 'api.printess.com',
      div: document.getElementById('printess'),
      basketId: 'CurrentShopBasketId',
      shopUserId: 'CurrentShopCustomerId',
      token: "YOUR TOKEN",
      showBuyerSide: true,
      templateName: 'Sign'
    })
  }
};
```

Please be aware that you'll need to tell Printess the path to its resource files (Web-Assembly and Default Fonts) in a separate property `resourcePath`. Please do not change this value.

The `domain` should also remain unchanged. It only needs to be changed if you are using a private Printess cloud.

In the `div` property you need to pass a div-element which Printess Editor will attach to.
Printess is intended to have as much space as possible, so it is highly recommended to not leave space on left and right side. Especially on mobile.

`token` should be set to a **Shop-Token** which points to yout Printess Account. You can get this token once you are logged in in the Printess Editor -> Account Menu -> API-Token. You'll see 3 different tokens in the dialog. Please always use the **Shop-Token**.

Finally the variable named `printess` contains a **js-api** reference to the Printess editor.

If you use typescript you'll find a `printess-editor.d.ts` as well as a `types.d.ts` file in the repro which contain all types for the printess object.

## &nbsp;

## `basketId` and `shopUserId`

To enable your customer to upload images and to save or load the state of work - you need to pass in minimum a `BasketId` to printess on `attachPrintess()`.

Optionally you can pass a `shopUserId` to make Printess store in the context of the current customer (user). Also when the customer uploads an image it will be stored under the `shopUserId`. So if the customer returns later he or she will see its previous uploaded images.

```json
{
  "basketId": "CurrentShopBasketId",
  "shopUserId": "CurrentShopCustomerId"
}
```

We are working on a method to assign an existing `basketId` to a `shopUserId` in the case the user logs in after he or she has already designed his or her artwork. So you can ensure that even with late sign in or user creation the existing uploaded images are assigned to that customer.

## &nbsp;

### Please find more documentation in the [Printess Knowledge Base](https://printess.com/kb/api-reference/js-api/getting-started.html) 

## &nbsp;

# How to get started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To generate your own Create React App with TypeScript run:

- `npx create-react-app my-app --template typescript` or
- `yarn create react-app my-app --template typescript `

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
