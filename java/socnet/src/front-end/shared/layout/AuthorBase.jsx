/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React         from 'react-mod';

import ComponentBase from 'vntd-shared/layout/ComponentBase.jsx';
import Mesg          from 'vntd-root/components/Mesg.jsx';
import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';

class AuthorBase extends ComponentBase
{
    constructor(props) {
        super(props, null, AuthorStore);
        this._updateAuthor     = this._updateAuthor.bind(this);
        this._updateAllAuthors = this._updateAllAuthors.bind(this);

        this.state = this._updateAllAuthors();
    }

    _updateState(data, elm, what) {
        this._updateAuthor(data, elm, what);
    }

    _updateAuthor(data, elm, what) {
        if (AuthorStore.hasDiffAuthor(this.state.authorCnt)) {
            this.setState(this._updateAllAuthors());
        }
    }

    _updateAllAuthors() {
        let authors = AuthorStore.getAuthorUuidList();
        return {
            authorCnt : authors.length,
            authorList: authors
        };
    }

    _hasAuthorUpdate(author, elm, what) {
        if (what === "update" || what === "remove" || what === "domain") {
            if (author.userUuid === elm.userUuid) {
                return true;
            }
            return false;
        }
        return AuthorStore.hasDiffAuthor(this.state.authorCnt);
    }
}

export default AuthorBase;
