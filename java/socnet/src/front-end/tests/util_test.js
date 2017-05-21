/**
 * Written by Vy Nguyen (2016)
 */
import _                  from 'lodash';
import React              from 'react';
import { expect, assert } from 'chai';
import setup              from './setup.js';

import Startup            from 'vntd-root/pages/login/Startup.jsx';
import { insertSorted, getRandomInt, findSorted } from 'vntd-shared/utils/Enum.jsx';

const testParams = {
    insertSorted: [ 100, 1000, 10000, 10000 ]
};

describe('Test Sorted Functions', function() {
    it('Insert sorted', function() {
        let cmpFn = function(a, b) {
            return a - b;
        };
        let verifySorted = function(array) {
            let verify = [];
            let length = array.length - 1;

            for (let i = 0; i < length; i++) {
                assert(array[i] <= array[i + 1], "Wrong sorted element at " + i);
                verify.push({
                    index: i,
                    value: array[i]
                });
            }
            for (let i = 0; i < length; i++) {
                let idx = findSorted(verify[i].value, array, cmpFn);
                assert(idx !== -1, "Failed to locate back the element");
                assert(idx === verify[i].index || array[idx] == verify[i].value,
                       "Wrong lookup recheck at " + idx);
            }
        };
        let sortTest = function(loop) {
            let array = [];
            for (let i = 0; i < loop; i++) {
                let num = getRandomInt(0, 100000);
                insertSorted(num, array, cmpFn);
            }
            verifySorted(array);
        }
        _.forEach(testParams.insertSorted, function(it) {
            sortTest(it);
            console.log("Tested insertSorted with " + it + " elements");
        });
    });
});

function cmpObjs(o1, o2){
    for (let p in o1) {
        if (o1.hasOwnProperty(p)) {
            if (o1[p] !== o2[p]) {
                return false;
            }
        }
    }
    for (let p in o2) {
        if (o2.hasOwnProperty(p)) {
            if (o1[p] !== o2[p]) {
                return false;
            }
        }
    }
    return true;
};

describe('Test Parse Startup String', function() {
    const testParseStartup = [ {
        input : "abc arg1=435   arg2=433-223-2322 arg3=332-3333-4dd-seer-dfsf",
        verify: {
            startLink: "abc",
            arg1     : "435",
            arg2     : "433-223-2322",
            arg3     : "332-3333-4dd-seer-dfsf"
        }
    }, {
        input : "noUser  arg1=435Abc#def   arg2=433-223-2322 arg3=332-3333-4dd-seer-dfsf",
        verify: {
            startLink: "noUser",
            arg1     : "435Abc#def",
            arg2     : "433-223-2322",
            arg3     : "332-3333-4dd-seer-dfsf"
        }
    }, {
        input : "noArg",
        verify: {
            startLink: "noArg"
        }
    }, {
        input : "NoArg    ",
        verify: {
            startLink: "NoArg"
        }
    } ];

    it('Parse Startup String', function() {
        _.forEach(testParseStartup, function(test) {
            let result = Startup.parseStartup(test.input);

            assert(cmpObjs(result, test.verify) === true,
                   "Unexpected result " + result);
        });
    });
});
