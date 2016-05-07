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

/*
 * http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
 */
function _locationOf(elm, array, compareFn, start, end) {
    start = start || 0;
    end = end || array.length;

    let cmp = 0;
    let pivot = parseInt(start + (end - start) / 2, 10);

    if (compareFn) {
        cmp = compareFn(array[pivot], elm);
    } else {
        if (array[pivot] === elm) {
            cmp = 0;
        } else if (array[pivot] < elm) {
            cmp = -1;
        } else {
            cmp = 1;
        }
    }
    if ((end - start) <= 1 || cmp === 0) {
        return pivot;
    }
    if (cmp === -1) {
        return _locationOf(elm, array, compareFn, pivot, end);
    } else {
        return _locationOf(elm, array, compareFn, start, pivot);
    }
}

function insertSorted(elm, array, compareFn) {
    array.splice(_locationOf(elm, array, compareFn) + 1, 0, elm);
    return array;
}

function toDateString(milli) {
    if (milli) {
        let d = new Date(milli);
        return d.toString();
    }
    return 'No date';
}

function preend(elm, array) {
    let newArr = array.slice(0);
    newArr.unshift(elm);
    return newArr;
}

export { Enum, safeStringify, insertSorted, toDateString, preend }
