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
function safeStringify(str) {
    let returnText = "" + str;

    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br>/gi, "\n");
    returnText = returnText.replace(/<br\s\/>/gi, "\n");
    returnText = returnText.replace(/<br\/>/gi, "\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");

    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g,'');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/&nbsp;/gi," ");
    returnText = returnText.replace(/&amp;/gi,"&");
    returnText = returnText.replace(/&quot;/gi,'"');
    returnText = returnText.replace(/&lt;/gi,'<');
    returnText = returnText.replace(/&gt;/gi,'>');

    return returnText;
}

/**
 * Get a random integer between `min` and `max`.
 * 
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {int} a random integer
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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

export { Enum, safeStringify, insertSorted, toDateString, preend, getRandomInt }
