/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import TA            from 'react-typeahead';

import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';
import UserStore     from 'vntd-shared/stores/UserStore.jsx';
import AuthorBase    from 'vntd-shared/layout/AuthorBase.jsx';

class TypeAhead extends AuthorBase
{
    constructor(props) {
        let myUuid, artRank;

        super(props);
        this._onBlur = this._onBlur.bind(this);
        this._onOptionSelected = this._onOptionSelected.bind(this);

        myUuid  = UserStore.getSelf().userUuid;
        artRank = AuthorStore.getArticleRankByUuid(props.articleUuid);

        this.state = _.merge(this.state, {
            myUuid   : myUuid,
            artRank  : artRank,
            allTags  : AuthorStore.getTagsByAuthorUuid(myUuid),
            authorTag: AuthorStore.getAuthorTag(myUuid, artRank.tagName)
        });
    }

    componentWillMount() {
        let artRank, authorTag, myUuid = this.state.myUuid;

        if (this.props.articleUuid != null) {
            artRank = this.state.artRank;
            if (artRank == null) {
                return;
            }
            authorTag = this.state.authorTag;
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
    }

    _updateAuthor(data) {
        let myUuid = this.state.myUuid,
            artRank = AuthorStore.getArticleRankByUuid(this.props.articleUuid);

        this.setState({
            artRank  : artRank,
            authorTag: AuthorStore.getAuthorTag(myUuid, artRank.tagName)
        });
    }

    _onBlur(val) {
        this.props.selectValue(val.target.value);
    }

    _onOptionSelected(val) {
        this.props.selectValue(val);
    }

    render() {
        let allTags = this.state.allTags;
        let tagName = this.state.artRank.tagName;
        return (
            <TA.Typeahead options={allTags} maxVisible={6}
                placeholder={tagName} value={tagName}
                customClasses={{input: "form-control input-sm"}}
                onBlur={this._onBlur}
                onOptionSelected={this._onOptionSelected}/>
        );
    }
}

export default TypeAhead;
