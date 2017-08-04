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
        let domain = UserStore.getDomain();

        if (domain == null) {
            domain = {
                footHdr     : "Login footer title",
                footTxt     : "Login footer text",
                loginHdr    : "Login header title",
                loginTxt    : "Login header text",
                loginFootImg: "/rs/img/demo/s3.jpg",
                loginMainImg: "/rs/img/demo/s2.jpg"
            };
        }
        return {
            login: {
                headerBar : domain.loginHdr,
                headerText: domain.loginTxt,
                aboutBrief: domain.footHdr,
                aboutText : domain.footTxt,
                logoImg   : domain.loginMainImg || "/rs/img/demo/s2.jpg",
                footImg   : domain.loginFootImg
            }
        };
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default AboutUsStore;
