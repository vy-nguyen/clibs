/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'uses strict';

import React         from 'react-mod';
import { Link }      from 'react-router';
import AboutUsStore  from 'vntd-root/stores/AboutUsStore.jsx';
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
        let login = this.state.login,
            loginBox = login || { header: "Viet Nam Tu Do" },
            logoImg = this.props.logoImg == null ?
                <img src="/rs/img/logo/flag.png" className="pull-right display-image"
                    alt="" style={{width:'210px'}}/> : null;

        if (login == null) {
            return null;
        }
        return (
            <div>
                <h1 className="txt-color-red login-header-big">
                    {loginBox.headerBar}
                    Le Tam Anh Login
                </h1>
                <div className="hero">
                    <div className="pull-left login-desc-box-l">
                        <h4 className="paragraph-header">{loginBox.headerText}</h4>
                        <div className="login-app-icons">
                            <button href="#" className="btn btn-danger btn-sm">
                                {loginBox.tourButton}
                            </button>
                            <span> </span>
                            <Link to="/public/aboutus"
                                className="btn btn-danger btn-sm">
                                {loginBox.aboutButton}
                            </Link>
                        </div>
                    </div>
                    {logoImg}
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h5 className="about-heading">{loginBox.aboutBrief}</h5>
                        <p>{loginBox.aboutText}</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h5 className="about-heading">{loginBox.siteBrief}</h5>
                        <p>{loginBox.siteText}</p>
                    </div>
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
