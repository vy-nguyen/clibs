/**
 * Copyright by Vy Nguyen (2017)
 * BSD License.
 */
'use strict';

import _               from 'lodash';
import Reflux          from 'reflux';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import Actions         from 'vntd-root/actions/Actions.jsx';
import Startup         from 'vntd-root/pages/login/Startup.jsx';
import Language        from 'vntd-root/stores/LanguageStore.jsx';
import RenderStore     from 'vntd-root/stores/RenderStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import CommentStore    from 'vntd-root/stores/CommentStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import {
    ArticleStore, EProductStore, GlobStore
} from 'vntd-root/stores/ArticleStore.jsx';

class MainStoreClass extends Reflux.Store
{
    constructor() {
        super();
        this.listenables = Actions;
    }

    /**
     * Main entry at startup after getting data returned back from the server.
     */
    onStartupCompleted(data) {
        Language.mainStartup(data);
        UserStore.mainStartup(data);
        RenderStore.mainStartup(data);

        AuthorStore.mainStartup(data);
        ArticleStore.mainStartup(data);
        ArticleTagStore.mainStartup(data);
        CommentStore.mainStartup(data);
        Startup.mainStartup();

        AuthorStore.mainTrigger(data);
    }
}

let MainStore = Reflux.initStore(MainStoreClass);

export default MainStore;
