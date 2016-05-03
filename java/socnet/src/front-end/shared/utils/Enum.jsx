/**
 * Vy Nguyen (2016)
 */
'use strict';

export function Enum() {
    let args = arguments;
    let kv = {
        keys: args
    };
    for (let i = args.length; i--; ) {
        kv[args[i]] = i;
    }
    return kv;
};

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

export { Enum, safeStringify }
