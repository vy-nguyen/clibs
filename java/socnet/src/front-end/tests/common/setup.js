/**
 * Common setup file to setup fake dom.
 */
require('../../webpack/tvntd.test.config.js');
require('babel-register')();

var FAKE_DOM_HTML = `
<html>
<body>
    <script src="https://cdn.tinymce.com/4/tinymce.min.js"></script>
    <script src="src/main/webapp/client/tvntd-vendor-bundle.js"></script>
</body>
</html>
`;

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM(FAKE_DOM_HTML, {
    runScripts: "dangerously"
});

const { window } = jsdom;

function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .reduce((result, prop) => ({
            ...result,
            [prop]: Object.getOwnPropertyDescriptor(src, prop),
        }), {});
    // Object.defineProperties(target, props);
}

global.window    = window;
global.document  = window.document;
global.navigator = {
    userAgent: 'node.js',
};
copyProps(window, global);

var documentRef = document;
var exposedProperties = ['window', 'navigator', 'document'];

/*
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});
*/
