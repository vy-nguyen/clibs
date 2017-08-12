/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import ArticleTagStore     from 'vntd-root/stores/ArticleTagStore.jsx';

class ArtTagBase extends React.Component
{
    constructor(props) {
        let kind;

        super(props);
        this._updateArts = this._updateArts.bind(this);
        this._getTagKind = this._getTagKind.bind(this);
        this.state = this._updateState(props);
    }

    _getTagKind(props) {
        if (props.params != null) {
            return props.params.blog || props.tagKind;
        }
        return props.tagKind;
    }

    _updateState(props) {
        let kind = this._getTagKind(props);
        return {
            pubMode: kind,
            pubTags: ArticleTagStore.getAllPublicTags(true, kind)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._updateState(nextProps));
    }
        
    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateArts);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateArts(data) {
        this.setState(this._updateState(this.props));
    }
}

export default ArtTagBase;
