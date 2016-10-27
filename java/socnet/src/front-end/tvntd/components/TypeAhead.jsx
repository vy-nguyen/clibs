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

class TypeAhead extends React.Component
{
    constructor(props) {
        super(props);
        this._onBlur = this._onBlur.bind(this);
        this._updateState = this._updateState.bind(this);
        this._onOptionSelected = this._onOptionSelected.bind(this);

        let myUuid  = UserStore.getSelf().userUuid;
        let artRank = AuthorStore.getArticleRank(myUuid, props.articleUuid);
        this.state = {
            myUuid   : myUuid,
            artRank  : artRank,
            allTags  : AuthorStore.getTagsByAuthorUuid(myUuid),
            authorTag: AuthorStore.getAuthorTag(myUuid, artRank.tagName)
        };
    }

    componentWillMount() {
        let myUuid = this.state.myUuid;
        if (this.props.articleUuid != null) {
            let artRank = this.state.artRank;
            if (artRank == null) {
                return;
            }
            let authorTag = this.state.authorTag;
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

    componentDidMount() {
        this.unsub = AuthorStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        let artRank = AuthorStore.getArticleRank(this.state.myUuid, this.props.articleUuid);
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
