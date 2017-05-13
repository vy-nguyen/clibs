/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';

import History            from 'vntd-shared/utils/History.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore         from 'vntd-shared/stores/ErrorStore.jsx';

class Startup
{
    constructor() {
    }

    static mainStartup() {
        let self = UserStore.getSelf();

        if (self.loadStart != null) {
            return;
        }
        console.log(">>> do start page " + self.startPage);
        self.loadStart = true;
        if (self.startPage == null) {
            self.secureAcct = true;
            History.pushState(null, "/");
            return;
        }
        switch (self.startPage) {
            case "profile":
                History.pushState(null, "/user/profile");
                break;

            case "badEmailToken":
                History.pushState(null, "/");
                ErrorStore.reportMesg("main-error", "Login Failed", null,
                        "The email login link is bad or expiried.  Please try again");
                break;

            default:
        }
    }
}

export default Startup;
