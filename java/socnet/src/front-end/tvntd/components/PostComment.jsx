/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _        from 'lodash';
import marked   from 'marked';
import React    from 'react-mod';

import {Dropdown, MenuItem} from 'react-bootstrap';
import {htmlCodes}          from 'vntd-root/config/constants';

let CommentItem = React.createClass({
    _rawMarkup: function() {
        return { __html: marked(this.props.data.comment, {sanitize: true}) };
    },

    render: function() {
        return (
<li>
    <img src={this.props.data.user.userImgUrl}/>
    <span className="name margin-r-10">{this.props.data.user.firstName + ' ' + this.props.data.user.lastName + '   '}
        <span className="text-primary">
            <i className="fa fa-thumbs-o-up"></i>Likes ({this.props.data.likes})
        </span>
        <span className="text-mutex pull-right">
            <a href="#"> x </a>
        </span>
    </span>
    <div dangerouslySetInnerHTML={this._rawMarkup()}/>
    <a href="#" className="link-black text-sm"><i className="fa fa-thumbs-o-up margin-r-5"></i> Like</a>
</li>
        );
    }
});

let PostComment = React.createClass({
    render: function() {
        let fav_cmnts = _.map(this.props.favorites, function(item) {
            return (<CommentItem data={item}/>);
        });
        let nor_cmnts = _.map(this.props.comments, function(item) {
            return (<CommentItem data={item}/>);
        });

        return (
<div className="row">
    <div className="col-sm-12 col-md-6 col-lg-6">
        <ul className="comments">
            {fav_cmnts}
        </ul>
    </div>
    <div className="col-sm-12 col-md-6 col-lg-6">
        <ul className="comments">
            {nor_cmnts}
        </ul>
    </div>
</div>
        );
    }
});

export default PostComment;
