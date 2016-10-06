/**
 * Written by Vy Nguyen (2016)
 */
import _     from 'lodash';
import React from 'react';
import { expect, assert } from 'chai';

import { insertSorted, getRandomInt, findSorted } from 'vntd-shared/utils/Enum.jsx';

import setup from './setup.js';

const testParams = {
    insertSorted: [ 100, 1000, 10000, 10000 ]
};

describe('Test', function() {
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
