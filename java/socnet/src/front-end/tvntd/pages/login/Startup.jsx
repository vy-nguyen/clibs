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

    static parseStartup(str) {
        let tokens = str.split(' '), args, key,
        result = {
            startLink: tokens[0]
        };

        for (let i = 1; i < tokens.length; i++) {
            args = tokens[i].split('=');
            key  = args[0];
            if (!_.isEmpty(key) && (key !== "startLink")) {
                result[key] = args[1];
            }
        }
        return result;
    }

    static mainStartup() {
        let start, self = UserStore.getSelf();

        if (self.loadStart != null) {
            return;
        }
        self.loadStart = true;
        if (self.startPage == null) {
            self.secureAcct = true;
            History.pushState(null, "/");
            return;
        }
        console.log(">>> do start page " + self.startPage);
        start = Startup.parseStartup(self.startPage);
        switch (start.startLink) {
            case "profile":
                History.pushState(null, "/user/profile");
                break;

            case "badEmailToken":
                History.pushState(null, "/");
                ErrorStore.reportMesg("main-error", "Login Failed", null,
                        "The email login link is bad or expiried.  Please try again");
                break;

            case "load":
                console.log("tag " + start.tag);
                console.log("title " + start.title);
                break;

            default:
        }
    }
}

export default Startup;
