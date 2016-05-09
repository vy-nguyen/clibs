/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React   from 'react-mod';
import _       from 'lodash';

import PostItem     from 'vntd-root/components/PostItem.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';

import Panel            from 'vntd-shared/widgets/Panel.jsx'; 
import { toDateString } from 'vntd-shared/utils/Enum.jsx';

let commentMock = [ {
    moment: "2 days",
    likes: "3",
    comment: "Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it.",
    user: {
        userImgUrl: "/rs/img/avatars/4.png",
        firstName: "Thao",
        lastName: "Nguyen"
    }
}, {
    moment: "3 days",
    likes: "2",
    comment: "Wow, sign me up.  I will go there next month",
    user: {
        userImgUrl: "/rs/img/avatars/3.png",
        firstName: "Truong",
        lastName: "Nguyen"
    }
} ];

let commentFavMock = [ {
    moment: "5 days",
    likes: "30",
    comment: "This is very very popular comment",
    user: {
        userImgUrl: "/rs/img/avatars/2.png",
        firstName: "Phi",
        lastName: "Nguyen"
    }
}, {
    moment: "30 days",
    likes: "200",
    comment: "Wow, sign me up.  This is way better comment",
    user: {
        userImgUrl: "/rs/img/avatars/5.png",
        firstName: "Thanh",
        lastName: "Nguyen"
    }
} ];


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
            headerMenus: [ownerPostMenu]
        };
        let div_style = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };

        let pictures = this.props.data.pictures;
        return (
            <Panel className="well no-padding" context={panelData}>
                <h2>UUID: {this.props.data.articleUuid}</h2>
                <div style={div_style} dangerouslySetInnerHTML={this._rawMarkup()}/>
            </Panel>
        )
            /*
        return (
            <JarvisWidget color={'purple'}>
                <header>
                    <span className="widget-icon"><i className="fa fa-book"/></span>
                    <h2><strong>{postedDate}</strong></h2>
                    <div className="widget-toolbar">
                        <div className="label label-success">${this.props.data.moneyEarned}</div>
                    </div>
                    <div className="widget-toolbar">
                        <div className="label label-warning">{this.props.data.creditEarned}</div>
                    </div>
                </header>
                <div className="panel panel-default">
                    <div className="panel-body status">
                        {!_.isEmpty(pictures) ? <PostItem pictures={pictures}/> : <img src={this.props.data.coverImgUrl}/>}

                    <div style={div_style} dangerouslySetInnerHTML={this._rawMarkup()}/>
                        <ul className="links">
                            <li><a href="#"><i className="fa fa-thumbs-o-up"></i> Like ({this.props.data.likeCount})</a></li>
                            <li><a href="#"><i className="fa fa-comment-o"></i> Comment</a></li>
                            <li><a href="#"><i className="fa fa-share-square-o"></i> Share</a></li>
                        </ul>
                        <ul className="comments">
                            <li>
                                <img src="/rs/img/avatars/sunny.png" alt="img"/>
                                <textarea type="text" className="form-control" placeholder="Post your comment..."/>
                            </li>
                        </ul>
                        <PostComment comments={commentMock} favorites={commentFavMock}/>
                    </div>
                </div>
            </JarvisWidget>
        )
             */
    }
});

export default PostPane;
