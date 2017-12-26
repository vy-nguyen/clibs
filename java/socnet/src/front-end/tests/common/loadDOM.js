/**
 * Code to load a fake dom with external scripts.
 */
const jsdom = require("jsdom/lib/old-api.js");

var FAKE_DOM_HTML = `
<html>
  <head></head>
    <body>
    </body>
</html>
`;

export default (documentLoaded) => {
      // Mock Image class since it's not found by default in jsdom
    global.Image = class Image {
        get complete() {
            return true;
        }
    };
    // '<script src="https://cdn.tinymce.com/4/tinymce.min.js"></script>' +

    jsdom.env({
        html: FAKE_DOM_HTML,
        scripts: [
            'https://cdn.tinymce.com/4/tinymce.min.js',
            'src/main/webapp/client/tvntd-vendor-bundle.js'
        ],
        done: (err, win) => {
            global.window = win;
            global.document = win.document;
            global.$ = win.jQuery;

            console.log("done with " + win);

            // Add other common globals
            Object.keys(win).forEach((property) => {
                if (typeof global[property] === 'undefined') {
                    global[property] = win[property];
                }
            });
            // Done!
            documentLoaded();
        }
    });
};
