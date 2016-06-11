/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';

let AboutUsStore = Reflux.createStore({

    init: function() {
        console.log("about us init");
        $.getJSON("/public/get-json/abc").then(function(json) {
            console.log(json);
            console.log(json.abc);
        }, function(fail) {
            console.log(fail);
        });
    },

    getData: function() {
        return this.data;
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default AboutUsStore;
