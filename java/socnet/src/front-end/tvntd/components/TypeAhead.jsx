/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React         from 'react-mod';
import Reflux        from 'reflux';
import TA            from 'react-typeahead';

import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';
import UserStore     from 'vntd-shared/stores/UserStore.jsx';

let TypeAhead = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    componentWillMount: function() {
        let myUuid = UserStore.getSelf().userUuid;

        if (this.props.articleUuid != null) {
            let artRank = AuthorStore.getArticleRank(myUuid, this.props.articleUuid);
            if (artRank == null) {
                return;
            }
            let authorTag = AuthorStore.getAuthorTag(myUuid, artRank.tagName)
            this.setState({
                myUuid : myUuid,
                artRank: artRank,
                tagName: artRank.tagName,
                favorite : artRank.favorite,
                authorTag: authorTag
            });
            if (this.props.artRankSave != null) {
                this.props.artRankSave(artRank, authorTag);
            }
        }
    },

    _onBlur: function(val) {
        this.props.selectValue(val.target.value);
    },

    _onOptionSelected: function(val) {
        this.props.selectValue(val);
    },

    render: function() {
        let allTags = AuthorStore.getTagsByAuthorUuid(this.state.myUuid);
        return (
            <TA.Typeahead options={allTags} maxVisible={6}
                placeholder={this.state.tagName} value={this.state.tagName}
                customClasses={{input: "form-control input-sm"}}
                onBlur={this._onBlur}
                onOptionSelected={this._onOptionSelected}/>
        );
    }
});

export default TypeAhead;
