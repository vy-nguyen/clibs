/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React           from 'react-mod';
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';

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

    _renderAvatar() {
        let self = this.state.self;
        const style = {
            background: "#ffffff",
            opacity   : "0.5"
        };

        return (
            <div className="padding-10">
                <div className="row">
                    <div className="profile-pic">
                        <img src={self.userImgUrl}/>
                    </div>
                </div>
                <div style={style} className="row">
                    <h1 className="login-header-big">
                        {self.firstName} {self.lastName}
                    </h1>
                    <div className="padding-10">
                        {this._renderKV(self.connections, "Connections", true)}
                        {this._renderKV(self.followers, "Followers", true)}
                    </div>
                </div>
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
}

export default UserBase;
export { UserBase, SectionWall }
