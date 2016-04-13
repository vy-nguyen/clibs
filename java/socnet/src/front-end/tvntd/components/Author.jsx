/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import ProfileCover     from './ProfileCover.jsx';
import { htmlCodes }    from 'vntd-root/config/constants';

let Author = React.createClass({
    render: function() {
        var topic_fn = function(item) {
            var out = [];
            out.push(<br key="0"/>);
            item.topicList.map(function(it, index) {
                out.push(<span key={index + 1}><span className={it.icon}>{it.tag}</span> {it.text}<br/></span>);
            });
            return out;
        };
        var about_me = this.props.data.aboutList.map(function(item, index) {
            return (
                <div key={index}>
                    <hr/>
                    <strong><i className={item.topicIcon}></i>{item.topicText}</strong>
                    {topic_fn(item)}
                </div>
            );
        });
        return (
<div className="row">
    <div className="col-sm-12">
        <div className="row">
            <div className="col-sm-5 profile-pic">
                <img src={this.props.user.userImgUrl}/>
            </div>
            <div className="col-sm-7">
            </div>
        </div>
        <div className="well well-sm">
            <div className="box-header">
                <h1 className="profile-username text-center">
                    {this.props.user.firstName} <span className="semi-bold">{this.props.user.lastName}</span>
                    <br/>
                    <small>{this.props.user.userStatus}</small>
                </h1>
                <h4 className="font-md"><strong>{this.props.user.followers}</strong><small> Followers</small></h4>
                <h4 className="font-md"><strong>{this.props.user.connections}</strong><small> Connections</small></h4>
            </div>
            <div className="box-body">
                <strong><i className='fa fa-book margin-r-5'></i>Public Transactions</strong>
                <p className='text-muted'>
                    <span className='label label-success'>Money Earned </span> {this.props.user.moneyEarned}<br/>
                    <span className='label label-warning'>Credit Given </span> {this.props.user.creditEarned}<br/>
                    <span className='label label-success'>Money Issued </span> {this.props.user.moneyIssued}<br/>
                    <span className='label label-warning'>Credit Issued</span> {this.props.user.creditIssued}<br/>
                </p>
                {about_me}
            </div>
        </div>
    </div>
</div>
        )
    }
});

export default Author;
