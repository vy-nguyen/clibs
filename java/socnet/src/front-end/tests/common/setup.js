require('../../webpack/tvntd.test.config.js');
require('babel-register')();

import jsdom from 'jsdom';

var FAKE_DOM_HTML = `
<html>
<body>
    <script src="https://cdn.tinymce.com/4/tinymce.min.js"></script>
    <script src="src/main/webapp/client/tvntd-vendor-bundle.js"></script>
</body>
</html>
`;

function setupFakeDOM() {
    if (typeof document !== 'undefined') {
        // if the fake DOM has already been set up, or
        // if running in a real browser, do nothing
        return;
    }

    // setup the fake DOM environment.
    //
    // Note that we use the synchronous jsdom.jsdom() API
    // instead of jsdom.env() because the 'document' and 'window'
    // objects must be available when React is require()-d for
    // the first time.
    //
    // If you want to do any async setup in your tests, use
    // the before() and beforeEach() hooks.
    //
    global.document = jsdom.jsdom(FAKE_DOM_HTML);

    global.window = global.document.defaultView;
    global.navigator = window.navigator;
}

setupFakeDOM();

var documentRef = document;
var exposedProperties = ['window', 'navigator', 'document'];

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
  userAgent: 'node.js'
};

