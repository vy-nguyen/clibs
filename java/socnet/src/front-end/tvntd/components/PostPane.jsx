/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React        from 'react-mod';
import _            from 'lodash';
import TA           from 'react-typeahead';

import Actions      from 'vntd-root/actions/Actions.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import PostItem     from 'vntd-root/components/PostItem.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

import Panel            from 'vntd-shared/widgets/Panel.jsx'; 
import { toDateString } from 'vntd-shared/utils/Enum.jsx';

let TagPost = React.createClass({

    _onOptionSelected: function(val) {
        this.setState({
            tagName: val
        });
    },

    _onBlur: function(val) {
        this.setState({
            tagName: val.target.value
        });
    },

    _onChangeFav: function() {
        this.setState({
            favorite: !this.state.favorite
        });
    },

    _submitUpdate: function(e) {
        e.preventDefault();
        let rank = parseInt(this.refs.rank.value, 10);
        if (rank === NaN || rank < 0 || rank > 100) {
            rank = 50;
            this.refs.rank.value = rank;
        }
        Actions.updateArtRank({
            tagName    : this.state.tagName,
            favorite   : this.state.favorite,
            tagRank    : 50,
            articleRank: rank,
            likeInc    : 0,
            shareInc   : 0,
            userUuid   : UserStore.getSelf().userUuid,
            title      : this.props.postTitle,
            articleUuid: this.props.articleUuid
        });
        this.setState({
            rankVal : rank,
        });
    },

    getInitialState: function() {
        return {
            tagText: "Tag your article",
            tagName: "My Posts",
            rankVal: "Rank 0-100",
            favorite: true
        }
    },

    render: function() {
        let myUuid = UserStore.getSelf().userUuid;
        let tags = AuthorStore.getTagsByAuthorUuid(myUuid);

        return (
            <form enclType="form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="row">
                    <div className="col-xs-5 col-sm-5 col-md-5">
                        <TA.Typeahead options={tags} maxVisible={4}
                            placeholder="Tag your article"
                            value={this.state.tagName}
                            customClasses={{input: "form-control input-sm"}}
                            onBlur={this._onBlur}
                            onOptionSelected={this._onOptionSelected}/>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3">
                        <input className="form-control input-sm" ref="rank" placeholder={this.state.rankVal}/>
                    </div>
                    <div className="col-xs-2 col-sm-2 col-md-2">
                        <section>
                            <label className="checkbox">
                                <input type="checkbox" checked={this.state.favorite} onChange={this._onChangeFav}/>
                                <i/>Mark Favorite
                            </label>
                        </section>
                    </div>
                    <button onClick={this._submitUpdate} className="btn btn-primary">Update</button>
                </div>
            </form>
        );
    }
});

let PostPane = React.createClass({

    _rawMarkup: function() {
        return { __html: this.props.data.content };
    },

    render: function() {
        let ownerPostMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: 'Options',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Mark Favorite',
                itemHandler: function() {
                }
            }, {
                itemFmt : 'fa fa-circle txt-color-red',
                itemText: 'Delete Post',
                itemHandler: function(e, pane) {
                    e.preventDefault();
                    Actions.deleteUserPost(this.props.data.articleUuid);
                    console.log(this);
                    console.log("Delete uuid " + this.props.data.articleUuid);
                    console.log("----------");
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: 'Tag Post',
                itemHandler: function() {
                }
            } ]
        };
        let panelData = {
            icon   : 'fa fa-book',
            header : toDateString(this.props.data.createdDate),
            headerMenus: [ownerPostMenu],
            panelLabel: [ {
                labelIcon: 'label label-success',
                labelText: this.props.data.moneyEarned
            }, {
                labelIcon: 'label label-warning',
                labelText: this.props.data.creditEarned
            } ]
        };
        let divStyle = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };
        let tagPost = null;
        let article = this.props.data;
        if (UserStore.isUserMe(article.authorUuid)) {
            tagPost = <TagPost articleUuid={article.articleUuid} title={article.topic}/>
        }
        return (
            <Panel className="well no-padding" context={panelData}>
                {tagPost}
                <h2>{article.topic ? article.topic : "Post"}</h2>
                <PostItem data={article.pictureUrl}/>
                <div style={divStyle} dangerouslySetInnerHTML={this._rawMarkup()}/>
                <PostComment articleUuid={article.articleUuid}/>
            </Panel>
        )
    }
});

export default PostPane;
