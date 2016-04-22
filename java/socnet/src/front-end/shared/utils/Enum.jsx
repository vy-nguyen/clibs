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

export { Enum }
