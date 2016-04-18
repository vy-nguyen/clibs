/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import marked  from 'marked';
import React   from 'react-mod';
import _       from 'lodash';

import PostItem     from 'vntd-root/components/PostItem.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';

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
        let div_style = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };
        let pictures = this.props.data.pictures;
        return (
            <JarvisWidget togglebutton={true} color={'blue'}>
                <header>
                    <span className="widget-icon"><i className="fa fa-book"/></span>
                    <h2><strong>{this.props.data.postDate}</strong></h2>
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
    }
});

export default PostPane;
