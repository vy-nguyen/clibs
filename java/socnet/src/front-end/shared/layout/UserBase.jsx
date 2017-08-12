/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React           from 'react-mod';
import { Link }        from 'react-router';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';
import { VntdGlob }    from 'vntd-root/config/constants.js';

class UserBase extends React.Component
{
    constructor(props) {
        super(props);
        this._updateUser = this._updateUser.bind(this);
        this.state = {
            self: UserStore.getUserByUuid(UserStore.getSelfUuid(props.userUuid))
        };
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._updateUser);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateUser(data) {
        this.setState({
            self: UserStore.getUserByUuid(UserStore.getSelfUuid(this.props.userUuid))
        });
    }

    _renderKV(key, value, small) {
        SectionWall.renderKV(key, value, small);
    }

    _renderAvatar() {
        let self = this.state.self,
        header = {
            title    : self.firstName + " " + self.lastName,
            keyValues: [ {
                key  : self.connections,
                value: "Connections",
                small: true
            }, {
                key  : self.followers,
                value: "Followers",
                small: true
            } ]
        };
        return (
            <div className="padding-10">
                <div className="row">
                    <div className="profile-pic">
                        <img src={self.userImgUrl}/>
                    </div>
                </div>
                {SectionWall.renderText(header)}
            </div>
        );
    }
}

class SectionWall extends React.Component
{
    constructor(props) {
        super(props);
        this._renderSection = this._renderSection.bind(this);
    }

    _renderSection() {
        return this.props.render();
    }

    render() {
        return (
            <div className={"panel " + this.props.className}>
                <div className="panel-heading">
                    <h3 className="panel-title"><Mesg text={this.props.title}/></h3>
                </div>
                <div className="panel-body">
                    <section id="widget-grid">
                        {this._renderSection()}
                    </section>
                </div>
            </div>
        );
    }

    static renderKV(key, value, small) {
        let val = <Mesg text={value}/>;

        if (small === true) {
            val = <small>{val}</small>;
        }
        return (
            <h4 className="font-md">
                <strong>{key}</strong> {val}
            </h4>
        );
    }

    static renderText(sect) {
        let keyValues = sect.keyValues.map(function(kv) {
            return SectionWall.renderKV(kv.key, kv.value, kv.small);
        });
        return (
            <div className="padding-10">
            <div style={VntdGlob.styleWhiteOpaque} className="row">
                <h1 className="login-header-big">
                    {sect.title}
                </h1>
                <div className="padding-10">
                    {keyValues}
                </div>
            </div>
            </div>
        );
    }

    static renderSection(sect) {
        return (
            <div className="well no-padding">
                <Link to={sect.link}>
                    <img src={sect.imgUrl} style={VntdGlob.styleFit}/>
                </Link>
                <div className="air air-top-left padding-10">
                    {SectionWall.renderText(sect)}
                </div>
            </div>
        );
    }
}

export default UserBase;
export { UserBase, SectionWall }
