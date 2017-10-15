// https://github.com/fullstackreact/google-maps-react
//
'use strict';

let counter   = 0;
let scriptMap = typeof window !== 'undefined' && window._scriptMap || new Map();
const window  = require('vntd-shared/lib/windowOrGlobal.js');

export const ScriptCache = (function(global) {
    global._scriptMap = global._scriptMap || scriptMap;

    return function ScriptCache(scripts) {
        const Cache = {};

        Cache._onLoad = function(key) {
            return function(cb) {
                let stored = scriptMap.get(key);
                if (stored) {
                    stored.promise.then(function() {
                        stored.error ? cb(stored.error) : cb(null, stored)
                        return stored;
                    });
                } else {
                    // TODO:
                }
            }
        }

        Cache._scriptTag = function(key, src) {
            if (!scriptMap.has(key)) {
                let tag = document.createElement('script');
                let promise = new Promise(function(resolve, reject) {
                    let cb, resolved = false,
                        errored = false,
                        body = document.getElementsByTagName('body')[0];

                    tag.type  = 'text/javascript';
                    tag.async = false; // Load in order

                    const cbName = `loaderCB${counter++}${Date.now()}`;
                    const handleResult = function(state) {
                        return function(evt) {
                            let stored = scriptMap.get(key);
                            if (state === 'loaded') {
                                stored.resolved = true;
                                resolve(src);
                            } else if (state === 'error') {
                                stored.errored = true;
                                reject(evt)
                            }
                            stored.loaded = true;
                            cleanup();
                        }
                    }
                    const cleanup = function() {
                        if (global[cbName] && typeof global[cbName] === 'function') {
                            global[cbName] = null;
                            delete global[cbName]
                        }
                    }

                    tag.onload  = handleResult('loaded');
                    tag.onerror = handleResult('error')
                    tag.onreadystatechange = function() {
                        handleResult(tag.readyState)
                    }

                    // Pick off callback, if there is one
                    if (src.match(/callback=CALLBACK_NAME/)) {
                        src = src.replace(/(callback=)[^\&]+/, `$1${cbName}`)
                        cb = window[cbName] = tag.onload;
                    } else {
                        tag.addEventListener('load', tag.onload)
                    }
                    tag.addEventListener('error', tag.onerror);

                    tag.src = src;
                    body.appendChild(tag);
                    return tag;
                });
                let initialState = {
                    loaded : false,
                    error  : false,
                    promise: promise,
                    tag
                }
                scriptMap.set(key, initialState);
            }
            return scriptMap.get(key);
        }

        Object.keys(scripts).forEach(function(key) {
            const script = scripts[key];
            const tag = window._scriptMap.has(key) ?
                window._scriptMap.get(key).tag :
                Cache._scriptTag(key, script);

            Cache[key] = {
                tag   : tag,
                onLoad: Cache._onLoad(key),
            }
        })
        return Cache;
    }
})(window);

export default ScriptCache;
