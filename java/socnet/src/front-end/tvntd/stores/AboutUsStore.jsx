/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';
import Actions   from 'vntd-root/actions/Actions.jsx';
import UserStore from 'vntd-shared/stores/UserStore.jsx';

let AboutUsStore = Reflux.createStore({
    data: {},
    listenables: [Actions],

    init: function() {
        Actions.getPublicJson("/public/get-json/json/aboutus");
    },

    onGetPublicJsonCompleted: function(data) {
        this.data = data;
        this.trigger(this.data);
    },

    getData: function() {
        return this.data;
    },

    getCustData: function() {
        return {
            login: {
                headerBar : "Welcome to Le Tam Anh",
                headerText: "Something about this web",
                aboutBrief: "Login footer here...",
                aboutText : "Someting about login footer here..",
                logoImg   : "/rs/img/demo/s2.jpg",
                footImg   : "/rs/img/bg/letamanh.jpg"
            }
        };
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default AboutUsStore;
