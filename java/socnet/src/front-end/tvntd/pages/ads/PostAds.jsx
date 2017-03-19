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
        this._busCatId    = 'ad-category';
        this._busNameId   = 'bus-name';
        this._busHourId   = 'bus-hour';
        this._busDescId   = 'bus-desc';
        this._busPhoneId  = 'bus-phone';
        this._busStreetId = 'bus-street';
        this._busCityId   = 'bus-city';
        this._busStateId  = 'bus-state';
        this._busZipId    = 'bus-zip';
        this._busWebId    = 'bus-web';
        this._busEmailId  = 'bus-email';

        this._dzSend      = this._dzSend.bind(this);
        this._dzSuccess   = this._dzSuccess.bind(this);
        this._dzError     = this._dzError.bind(this);
        this._editAd      = this._editAd.bind(this);
        this._getAdData   = this._getAdData.bind(this);
        this._onBlurInput = this._onBlurInput.bind(this);
        this._postAdClick = this._postAdClick.bind(this);
        this._updateState = this._updateState.bind(this);
        this._imgUploadOk = this._imgUploadOk.bind(this);
        this._clearAdData = this._clearAdData.bind(this);

        this._postAdBtn = StateButtonStore.createButton(this._postAdId, function() {
            return StateButton.saveButtonFsm("Post", "Post Ad", "Published Ad");
        });
        this.state = {
            errFlags: {}
        };
    }

    componentWillMount() {
        let ad = this.props.ads;
        if (ad == null) {
            return;
        }
        InputStore.storeItemIndex(this._busCatId, ad.busCat, false);
        InputStore.storeItemIndex(this._busNameId, ad.busName, false);
        InputStore.storeItemIndex(this._busHourId, ad.busHour, false);
        InputStore.storeItemIndex(this._busDescId, ad.busDesc, false);
        InputStore.storeItemIndex(this._busPhoneId, ad.busPhone, false);
        InputStore.storeItemIndex(this._busStreetId, ad.busStreet, false);
        InputStore.storeItemIndex(this._busCityId, ad.busCity, false);
        InputStore.storeItemIndex(this._busStateId, ad.busState, false);
        InputStore.storeItemIndex(this._busZipId, ad.busZip, false);
        InputStore.storeItemIndex(this._busWebId, ad.busWeb, false);
        InputStore.storeItemIndex(this._busEmailId, ad.busEmail, false);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _dzSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', '');
        form.append('articleUuid', '');
    }

    _dzSuccess() {
    }

    _dzError() {
    }

    _onBlurInput() {
        ErrorStore.clearError(this._errorId);
        StateButtonStore.setButtonStateObj(this._postAdBtn, "needSave");
    }

    _clearAdData() {
    }

    _updateState() {
    }

    _postAdClick() {
        StateButtonStore.setButtonStateObj(this._postAdBtn, "saving");
    }

    _imgUploadOk(entry, result) {
    }

    _getAdData() {
    }

    _editAd() {
        let post = this.props.post, errFlag = this.state.errFlags,
            adImg, twoCols,
        busCat = {
            select   : true,
            inpName  : this._busCatId,
            inpDefVal: null,
            selectOpt: null,
            onSelect : null,
            labelTxt : 'Category',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busName = {
            inpName  : this._busNameId,
            inpDefVal: null,
            inpHolder: Lang.translate('ABC Service'),
            errorId  : this._busNameId,
            errorFlag: errFlag.adName,
            labelTxt : 'Business Name',
            labelFmt : 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt : 'control-label col-sx-9 col-sm-9 col-md-9 col-lg-9'
        },
        busHour = {
            inpName  : this._busHourId,
            inpDefVal: null,
            ipgHolder: Lang.translate('M-F: 9am-5pm'),
            editor   : true,
            errorId  : this._busHourId,
            errorFlag: errFlag.busHour,
            labelTxt : 'Business Hour',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busDesc = {
            inpName  : this._busDescId,
            inpDefVal: null,
            ipgHolder: Lang.translate('About your busines'),
            editor   : true,
            errorId  : this._busDescId,
            errorFlag: errFlag.busHour,
            labelTxt : 'Business Description',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busPhone = {
            inpName  : this._busPhoneId,
            inpDefVal: null,
            inpHolder: Lang.translate('123-123-1234'),
            errorId  : this._busPhoneId,
            errorFlag: errFlag.busPhone,
            labelTxt : 'Phone',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busStreet = {
            inpName  : this._busStreetId,
            inpDefVal: null,
            inpHolder: Lang.translate('123 Main Street'),
            errorId  : this._busStreetId,
            errorFlag: errFlag.busStreet,
            labelTxt : 'Address',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busCity = {
            inpName  : this._busCityId,
            inpDefVal: null,
            inpHolder: Lang.translate('Some City'),
            errorId  : this._busCityId,
            errorFlag: errFlag.busCity,
            labelTxt : 'City',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busState = {
            inpName  : this._busStateId,
            inpDefVal: null,
            inpHolder: 'CA',
            errorId  : this._busStateId,
            errorFlag: errFlag.busState,
            labelTxt : 'State',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        },
        busZip = {
            inpName  : this._busZipId,
            inpDefVal: null,
            inpHolder: '12345',
            errorId  : this._busZipId,
            errorFlag: errFlag.busZip,
            labelTxt : 'Zip',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-109 col-lg-10'
        },
        busWeb = {
            inpName  : this._busWebId,
            inpDefVal: null,
            inpHolder: 'https://something.com',
            errorId  : this._busWebId,
            errorFlag: errFlag.busWeb,
            labelTxt : 'Your Web URL',
            labelFmt : 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt : 'control-label col-sx-9 col-sm-9 col-md-9 col-lg-9'
        },
        email = {
            inpName  : this._busEmailId,
            inpDefVal: null,
            inpHolder: 'you@something.com',
            errorId  : this._busEmailId,
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
                        <InputInline entry={busCat} onBlur={this._onBlurInput}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busPhone} onBlur={this._onBlurInput}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busStreet} onBlur={this._onBlurInput}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busCity} onBlur={this._onBlurInput}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busState} onBlur={this._onBlurInput}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <InputInline entry={busZip} onBlur={this._onBlurInput}/>
                    </div>
                </div>
            </div>
        );
        return (
            <div className="product-content product-wrap clearfix">
                {adImg}
                <div className="row">
                    <div className="product-deatil">
                        <InputInline entry={busName} onBlur={this._onBlurInput}/>
                        <InputInline entry={email} onBlur={this._onBlurInput}/>
                        <InputInline entry={busWeb} onBlur={this._onBlurInput}/>
                    </div>
                </div>
                {twoCols}
                <div className="row">
                    <div className="product-deatil">
                        <InputInline entry={busHour} onBlur={this._onBlurInput}/>
                        <InputInline entry={busDesc} onBlur={this._onBlurInput}/>
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
