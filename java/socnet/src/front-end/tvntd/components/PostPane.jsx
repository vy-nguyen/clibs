/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React   from 'react-mod';
import _       from 'lodash';

import Actions      from 'vntd-root/actions/Actions.jsx';
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
    userUuid: "123450"
}, {
    moment: "3 days",
    likes: "2",
    comment: "Wow, sign me up.  I will go there next month",
    userUuid: "123451"
} ];

let commentFavMock = [ {
    moment: "5 days",
    likes: "30",
    comment: "This is very very popular comment",
    userUuid: "123452"
}, {
    moment: "30 days",
    likes: "200",
    comment: "Wow, sign me up.  This is way better comment",
    userUuid: "123453"
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

        return (
            <Panel className="well no-padding" context={panelData}>
                <h2>UUID: {this.props.data.articleUuid}</h2>
                <h2>{this.props.data.topic ? this.props.data.topic : "Post"}</h2>
                <PostItem data={this.props.data.pictureUrl}/>
                <div style={divStyle} dangerouslySetInnerHTML={this._rawMarkup()}/>
                <PostComment comments={commentMock} favorites={commentFavMock}/>
            </Panel>
        )
    }
});

export default PostPane;
