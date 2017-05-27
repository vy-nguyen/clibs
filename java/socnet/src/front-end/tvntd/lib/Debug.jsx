/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import NavigationStore  from 'vntd-shared/stores/NavigationStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import NestableStore    from 'vntd-shared/stores/NestableStore.jsx';
import ErrorStore       from 'vntd-shared/stores/ErrorStore.jsx';
import AboutUsStore     from 'vntd-root/stores/AboutUsStore.jsx';
import AuthorStore      from 'vntd-root/stores/AuthorStore.jsx';
import CommentStore     from 'vntd-root/stores/CommentStore.jsx';
import RenderStore      from 'vntd-root/stores/RenderStore.jsx';
import AdminStore       from 'vntd-root/stores/AdminStore.jsx';
import ArtTagStore      from 'vntd-root/stores/ArticleTagStore.jsx';
import LanguageStore    from 'vntd-root/stores/LanguageStore.jsx';

import {
    ArticleStore, EProductStore, AdsStore
} from 'vntd-root/stores/ArticleStore.jsx';

class Debug extends React.Component {

    constructor(props) {
        super(props);
    }

    debugUserStore() {
        UserStore.dumpData("User Store Content");
    }

    debugNavStore() {
        NavigationStore.dumpData("NavStore Content");
    }

    debugAboutUsStore() {
        AboutUsStore.dumpData("About Us Content");
    }

    debugArticleStore() {
        ArticleStore.dumpData("Article Store Content");
        EProductStore.dumpData("Product Store Content");
        AdsStore.dumpData("Ads Store Content");
    }

    debugAuthorStore() {
        AuthorStore.dumpData("Author Store Content");
    }

    debugCommentStore() {
        CommentStore.dumpData("Comment Store Content");
    }

    debugRenderStore() {
        RenderStore.dumpData("Render Store Content");
    }

    debugAdminStore() {
        AdminStore.dumpData("Admin Store Content");
    }

    debugArtTagStore() {
        ArtTagStore.dumpData("Article Tag Content");
    }

    debugStateButtonStore() {
        StateButtonStore.dumpData("State Button Content");
    }

    debugLanguageStore() {
        LanguageStore.dumpData("Language Store");
    }

    debugNestTable() {
        NestableStore.dumpData("Nestable Store");
    }

    debugErrorStore() {
        ErrorStore.dumpData("Error Store");
    }

    debugAdsStore() {
        AdsStore.dumpData("Ads Store");
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <a onClick={this.debugUserStore}>Debug User Store</a>
                    <br/>
                    <a onClick={this.debugAboutUsStore}>Debug About Us Store</a>
                    <br/>
                    <a onClick={this.debugArticleStore}>Debug Article Store</a>
                    <br/>
                    <a onClick={this.debugAuthorStore}>Debug Author Store</a>
                    <br/>
                    <a onClick={this.debugCommentStore}>Debug Comment Store</a>
                    <br/>
                    <a onClick={this.debugLanguageStore}>Debug Language Store</a>
                    <br/>
                    <a onClick={this.debugAdsStore}>Debug Ads Store</a>
                </div>
                <div className="col-md-6">
                    <a onClick={this.debugNavStore}>Debug Nav Store</a>
                    <br/>
                    <a onClick={this.debugRenderStore}>Debug Render Store</a>
                    <br/>
                    <a onClick={this.debugAdminStore}>Debug Admin Store</a>
                    <br/>
                    <a onClick={this.debugArtTagStore}>Debug ArticleTag Store</a>
                    <br/>
                    <a onClick={this.debugStateButtonStore}>Debug State Button Store</a>
                    <br/>
                    <a onClick={this.debugNestTable}>Debug Nest Table Store</a>
                    <br/>
                    <a onClick={this.debugErrorStore}>Debug Error Store</a>
                </div>
                <br/>
                <hr/>
            </div>
        );
    }
}

export default Debug;
