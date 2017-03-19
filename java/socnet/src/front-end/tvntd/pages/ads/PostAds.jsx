/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import ErrorView        from 'vntd-shared/layout/ErrorView.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import InputStore       from 'vntd-shared/stores/NestableStore.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore       from 'vntd-shared/stores/ErrorStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang             from 'vntd-root/stores/LanguageStore.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx';

import {
    GenericForm, SelectWrap, DropZoneWrap, InputBox, InputInline
} from 'vntd-shared/forms/commons/GenericForm.jsx';

class PostAds extends React.Component
{
    constructor(props) {
        super(props);

        this._imgDz       = null;
        this._errorId     = 'post-ads-err';
        this._postAdId    = 'post-ads-id';
        this._editAd      = this._editAd.bind(this);
        this._postAdClick = this._postAdClick.bind(this);
        this._updateState = this._updateState.bind(this);

        this._postAdBtn = StateButtonStore.createButton(this._postAdId, function() {
            return StateButton.saveButtonFsm("Post", "Post Ad", "Published Ad");
        });
        this.state = {
            errFlags: {}
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState() {
    }

    _postAdClick() {
    }

    _editAd() {
        let post = this.props.post, errFlag = this.state.errFlags,
            adImg, twoCols,
        adCat = {
            select   : true,
            inpName  : 'ad-category',
            inpDefVal: null,
            selectOpt: null,
            onSelect : null,
            labelTxt : 'Category',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busName = {
            inpName  : 'bus-name',
            inpDefVal: null,
            inpHolder: Lang.translate('ABC Service'),
            errorId  : 'bus-name',
            errorFlag: errFlag.adName,
            labelTxt : 'Business Name',
            labelFmt : 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt : 'control-label col-sx-9 col-sm-9 col-md-9 col-lg-9'
        },
        busHour = {
            inpName  : 'bus-hour',
            inpDefVal: null,
            ipgHolder: Lang.translate('M-F: 9am-5pm'),
            editor   : true,
            errorId  : 'bus-hour',
            errorFlag: errFlag.busHour,
            labelTxt : 'Business Hour',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busDesc = {
            inpName  : 'bus-desc',
            inpDefVal: null,
            ipgHolder: Lang.translate('About your busines'),
            editor   : true,
            errorId  : 'bus-hour',
            errorFlag: errFlag.busHour,
            labelTxt : 'Business Description',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busPhone = {
            inpName  : 'bus-phone',
            inpDefVal: null,
            inpHolder: Lang.translate('123-123-1234'),
            errorId  : 'bus-phone',
            errorFlag: errFlag.busPhone,
            labelTxt : 'Phone',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busStreet = {
            inpName  : 'bus-street',
            inpDefVal: null,
            inpHolder: Lang.translate('123 Main Street'),
            errorId  : 'bus-street',
            errorFlag: errFlag.busStreet,
            labelTxt : 'Address',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busCity = {
            inpName  : 'bus-city',
            inpDefVal: null,
            inpHolder: Lang.translate('Some City'),
            errorId  : 'bus-city',
            errorFlag: errFlag.busCity,
            labelTxt : 'City',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busState = {
            inpName  : 'bus-state',
            inpDefVal: null,
            inpHolder: 'CA',
            errorId  : 'bus-state',
            errorFlag: errFlag.busState,
            labelTxt : 'State',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busZip = {
            inpName  : 'bus-zip',
            inpDefVal: null,
            inpHolder: '12345',
            errorId  : 'bus-zip',
            errorFlag: errFlag.busZip,
            labelTxt : 'Zip',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-109 col-lg-10'
        },
        busWeb = {
            inpName  : 'bus-web',
            inpDefVal: null,
            inpHolder: 'https://something.com',
            errorId  : 'bus-zip',
            errorFlag: errFlag.busWeb,
            labelTxt : 'Your Web URL',
            labelFmt : 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt : 'control-label col-sx-9 col-sm-9 col-md-9 col-lg-9'
        },
        email = {
            inpName  : 'email',
            inpDefVal: null,
            inpHolder: 'you@something.com',
            errorId  : 'email',
            errorFlag: errFlag.email,
            labelTxt : 'Your email (to claim this ad later)',
            labelFmt : 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt : 'control-label col-sx-9 col-sm-9 col-md-9 col-lg-9'
        },
        imgDz = {
            sending  : this._dzSend,
            success  : this._dzSuccess,
            error    : this._dzError,
            init     : function(dz) {
                this._imgDz = dz;
            }.bind(this)
        },
        imgDzInfo = {
            url        : '/public/upload-ad-img',
            errorId    : 'ad-img',
            errorFlag  : errFlag.busImg,
            defaultMesg: 'Drop your image here'
        };

        if (post != null) {
            adImg = null;
        } else {
            adImg = (
                <div className="row">
                    <div className="product-deatil">
                        <h3><Mesg text="Upload your ad pictures"/></h3>
                        <DropZoneWrap entry={imgDzInfo} eventHandlers={imgDz}/>
                    </div>
                </div>
            );
        }
        twoCols = (
            <div className="product-deatil">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={adCat}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busPhone}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busStreet}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busCity}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busState}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busZip}/>
                    </div>
                </div>
            </div>
        );
        return (
            <div className="product-content product-wrap clearfix">
                {adImg}
                <div className="row">
                    <div className="product-deatil">
                        <InputInline entry={busName}/>
                        <InputInline entry={email}/>
                        <InputInline entry={busWeb}/>
                    </div>
                </div>
                {twoCols}
                <div className="row">
                    <div className="product-deatil">
                        <InputInline entry={busHour}/>
                        <InputInline entry={busDesc}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <ErrorView errorId={this._errorId}/>
                        <div className="btn-group pull-right" role="group">
                            <StateButton btnId={this._postAdId}
                                className="btn btn-success"
                                onClick={this._postAdClick}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <JarvisWidget id="estore-post" color="purple">
                <header>
                    <span className="widget-icon">
                        <i className="fa fa-pencil"/>
                    </span>
                    <h2><Mesg text="Post Your Ads"/></h2>
                </header>
                <div className="widget-body">
                    {this._editAd()}
                </div>
            </JarvisWidget>
        );
    }
}

PostAds.propTypes = {
};

export default PostAds;
