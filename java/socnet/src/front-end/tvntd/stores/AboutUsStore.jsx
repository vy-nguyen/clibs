/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';
import Actions   from 'vntd-root/actions/Actions.jsx';

let AboutUsStore = Reflux.createStore({
    data: {},
    listenables: [Actions],

    init: function() {
        Actions.getPublicJson("/public/get-json/json/aboutus");
    },

    onGetPublicJsonCompleted: function(data) {
        this.data = {
            features: data.features,
            goals   : data.goals,
            plan    : data.plan,
            screen  : data.screen,
            team    : data.team,
            welcome : data.welcome,
            register: data.register
        };
        this.trigger(this.data);
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
