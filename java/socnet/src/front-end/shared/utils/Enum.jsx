/**
 * Vy Nguyen (2016)
 */
'use strict';

import _ from 'lodash';

function Enum() {
    let args = arguments;
    let kv = {
        keys: args
    };
    for (let i = args.length; i--; ) {
        kv[args[i]] = i;
    }
    return kv;
}

/*
 * return the index to insert into the sorted array.
 */
function _locationOf(elm, array, compareFn) {
    let cmp = 0;
    let minIdx = 0;
    let curIdx = -1;
    let maxIdx = array.length;

    while (minIdx < maxIdx) {
        curIdx = (minIdx + maxIdx) / 2 | 0;
        let pivot = array[curIdx];

        if (compareFn) {
            cmp = compareFn(pivot, elm);
        } else {
            if (pivot == elm) {
                cmp = 0;
            } else if (pivot < elm) {
                cmp = -1;
            } else {
                cmp = 1;
            }
        }
        if (cmp <= -1) {
            if (minIdx == curIdx) {
                break;
            }
            minIdx = curIdx;
        } else if (cmp >= 1) {
            if (maxIdx == curIdx) {
                break;
            }
            maxIdx = curIdx;
        } else {
            return curIdx;
        }
    }
    if (cmp >= 1) {
        return (curIdx > 1 ? curIdx - 1 : 0);
    }
    return curIdx + 1;
}

class BoundArray
{
    constructor(max) {
        this.data   = [];
        this.maxLen = max;
    }

    push(key, elm) {
        let i, len = this.data.length;

        if (len === this.maxLen) {
            len--;
            this.data.shift();
        }
        for (i = 0; i < len; i++) {
            if (this.data[i].key === key) {
                if ((i + 1) === len) {
                    return;
                }
                len--;
                for (; i < len; i++) {
                    this.data[i] = this.data[i + 1];
                }
                this.data.pop();
            }
        }
        this.data.push({
            key: key,
            elm: elm
        });
    }

    pop() {
        return this.data.pop();
    }

    popElm(key) {
        let i, len, ret = null;

        len = this.data.length;
        for (i = 0; i < len; i++) {
            if (this.data[i].key === key) {
                ret = this.data[i];
                for (; i < len; i++) {
                    this.data.pop();
                }
                break;
            }
        }
        return ret;
    }

    getData() {
        return this.data;
    }
}

class Util
{
    // A utility function to safely escape JSON for embedding in a <script> tag
    static safeStringify(str) {
        let returnText = "" + str;

        /*
        //-- remove BR tags and replace them with line break
        returnText = returnText.replace(/<br>/gi, "\n");
        returnText = returnText.replace(/<br\s\/>/gi, "\n");
        returnText = returnText.replace(/<br\/>/gi, "\n");

        //-- remove P and A tags but preserve what's inside of them
        returnText = returnText.replace(/<p.*?>/gi, "\n");
        returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");
         */

        //-- remove all inside SCRIPT and STYLE tags
        returnText =
            returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");

        returnText =
            returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");

        /*
        //-- remove all else
        returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

        //-- get rid of more than 2 multiple line breaks:
        returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

        //-- get rid of html-encoded characters:
        returnText = returnText.replace(/&nbsp;/gi," ");
        returnText = returnText.replace(/&amp;/gi,"&");
        returnText = returnText.replace(/&quot;/gi,'"');
        returnText = returnText.replace(/&lt;/gi,'<');
        returnText = returnText.replace(/&gt;/gi,'>');
         */
        return returnText;
    }

    /**
     * Get a random integer between `min` and `max`.
     * 
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {int} a random integer
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static insertUnique(elm, array, compareFn) {
        let length = array.length;
        for (let i = 0; i < length; i++) {
            if (compareFn(array[i], elm) === true) {
                return -1;
            }
        }
        array.push(elm);
        return array.length;
    }

    static stringCmp(s1, s2) {
        return s1.attr.localeCompare(s2.attr);
    }

    static insertSorted(elm, array, compareFn) {
        if (array.length === 0) {
            return array.splice(0, 0, elm);
        }
        return array.splice(_locationOf(elm, array, compareFn), 0, elm);
    }

    static insertSortedUnique(elm, array, compareFn) {
        let index = Util.findSorted(elm, array, compareFn);
        if (index == -1) {
            return Util.insertSorted(elm, array, compareFn);
        }
        return index;
    }

    static findSorted(elm, array, compareFn) {
        if (array.length === 0) {
            return -1;
        }
        let index = _locationOf(elm, array, compareFn);
        if (compareFn(array[index], elm) === 0) {
            return index;
        }
        return -1;
    }

    static toDateString(milli) {
        if (milli) {
            let d = new Date(milli);
            return d.toString();
        }
        return 'No date';
    }

    static preend(elm, array) {
        let newArr = array.slice(0);
        newArr.unshift(elm);
        return newArr;
    }

    static removeArray(array, elm, fromIdx, cmp) {
        if (array == null) {
            return -1;
        }
        let o = Object(array);
        let len = o.length >>> 0;
        if (len === 0) {
            return -1;
        }
        let n = +fromIdx || 0;
        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in o && cmp(o[k], elm) === 0) {
                array.splice(k, 1);
                return k;
            }
            k++;
        }
        return -1;
    }

    static compareUuid(uuid, elm, field) {
        if (field != null) {
            return elm[field] === uuid ? true : false;
        }
        return elm === uuid ? true : false;
    }

    static findUuid(array, field, uuid) {
        if (array != null) {
            return _.findIndex(array, function(elm) {
                if (field != null) {
                    return elm[field] === uuid;
                }
                return elm === uuid;
            });
        }
        return -1;
    }

    static choose(value, key, defVal) {
        if (!_.isEmpty(key) && !_.isEmpty(defVal)) {
            if (!_.isEmpty(value)) {
                return !_.isEmpty(value[key]) ? value[key] : defVal;
            }
            return defVal;
        }
        return !_.isEmpty(value) ? value : defVal;
    }

    static setCookie(cname, cvalue, exdays) {
        let expires, d = new Date();

        if (exdays == null) {
            exdays = 10000;
        }
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static getCookie(cname) {
        let decodedCookie, ca, name = cname + "=";
        decodedCookie = decodeURIComponent(document.cookie);
        ca = decodedCookie.split(';');

        for(let i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    static noOpRetNull() {
        return null;
    }
}

export { BoundArray, Enum, Util }
