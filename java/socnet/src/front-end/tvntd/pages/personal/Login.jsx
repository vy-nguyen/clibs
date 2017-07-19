/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'uses strict';

import React         from 'react-mod';
import { Link }      from 'react-router';
import AboutUsStore  from 'vntd-root/stores/AboutUsStore.jsx';
import ImageCarousel from 'vntd-shared/layout/ImageCarousel.jsx';
import { LoginHeader, LoginForm }   from 'vntd-root/pages/login/Login.jsx';

class LoginAbout extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            login: AboutUsStore.getData().login
        }
        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = AboutUsStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        this.setState({
            login: AboutUsStore.getData().login
        });
    }

    render() {
        let login = this.state.login, loginBox, imgUrl, footUrl, imgList, style;

        if (login == null) {
            return null;
        }
        loginBox = login || { header: "Viet Nam Tu Do" };
        imgUrl   = this.props.logoImg || "/rs/img/logo/flag.png";
        footUrl  = this.props.footImg || "/rs/img/bg/letamanh.jpg";

        style = {
            width : "100%",
            height: "auto"
        };
        return (
            <div className="well">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="profile-carousel">
                        <img src={imgUrl} className="pull-right display-image"/>
                    </div>
                    <div className="air air-top-left padding-10">
                        <h1 className="txt-color-red login-header-big">
                            {loginBox.headerBar}
                        </h1>
                        <div className="pull-left login-desc-box-l">
                            <h4 className="paragraph-header">{loginBox.headerText}</h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <img style={style} src={footUrl}/>
                </div>
                <div className="row">
                    <h5 className="about-heading">{loginBox.aboutBrief}</h5>
                    <p>{loginBox.aboutText}</p>
                </div>
            </div>
        );
    }
}

class CustLogin extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        console.log("render cust login");
        return (
            <div id="extr-page" >
                <LoginHeader/>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <div className="col-md-7 col-lg-8 hidden-xs hidden-sm">
                                <LoginAbout/>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <LoginForm suffix="cust"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustLogin;
export { CustLogin }
