/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';

import History            from 'vntd-shared/utils/History.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore         from 'vntd-shared/stores/ErrorStore.jsx';

let _startupCount = 0;

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
        let url, start, self = UserStore.getSelf();

        _startupCount = _startupCount + 1;
        if (_startupCount < 2) {
            return;
        }
        if (self.loadStart != null) {
            return;
        }
        self.loadStart = true;
        if (self.startPage == null) {
            self.secureAcct = true;
            History.pushState(null, "/");
            return;
        }
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
                if (start.author == null || start.articleUuid == "0") {
                    History.pushState(null, "/");
                    ErrorStore.reportMesg("main-error", "Could not find the article",
                            null, "The link you're looking for doesn't exist.");
                    return;
                }
                url = "/public/article/" + start.author + "/" + start.articleUuid;
                History.push(url);
                break;

            default:
                console.log("Unknown command");
                console.log(start);
        }
    }
}

export default Startup;
