/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import PropTypes           from 'prop-types';

import StateButton         from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
import ArticleTagStore     from 'vntd-root/stores/ArticleTagStore.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import { AdsStore }        from 'vntd-root/stores/ArticleStore.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class BusAds extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initData();
        return this;
    }

    initData() {
        let adsOpt = ArticleTagStore.getPublicTagsSelOpt("ads"),
            adsOptDef = !_.isEmpty(adsOpt) ? adsOpt[0].label : null,
            wLabelFmt = 'control-label col-xs-2 col-sm-2 col-md-2 col-lg-2',
            wInputFmt = 'control-label col-xs-10 col-sm-10 col-md-10 col-lg-10',
            cLabelFmt = 'control-label col-xs-3 col-sm-3 col-md-3 col-lg-3',
            cInputFmt = 'control-label col-xs-9 col-sm-9 col-md-9 col-lg-9',
        aboutBus = [ {
            url      : '/public/upload-ad-img',
            field    : 'image',
            inpName  : 'bus-ad-img',
            dropzone : true,
            labelTxt : 'Drop your image',
            labelFmt : wLabelFmt,
            inputFmt : wInputFmt
        }, {
            field    : 'busName',
            inpName  : 'bus-ad-name',
            inpHolder: 'Your business name',
            labelTxt : 'Business Name',
            labelFmt : wLabelFmt,
            inputFmt : wInputFmt
        }, {
            field    : 'busInfo',
            inpName  : 'bus-ad-info',
            inpHolder: 'Info about your business',
            labelTxt : 'Business Info',
            labelFmt : wLabelFmt,
            inputFmt : wInputFmt
        }, {
            id       : 'bus-ad-hour',
            field    : 'busHour',
            inpName  : 'bus-ad-hour',
            ipgHolder: 'M-F: 9am-5pm',
            editor   : true,
            labelTxt : 'Business Hour',
            labelFmt : wLabelFmt,
            inputFmt : wInputFmt
        }, {
            id       : 'bus-ad-desc',
            field    : 'busDesc',
            inpName  : 'bus-ad-desc',
            ipgHolder: 'About your busines',
            editor   : true,
            labelTxt : 'Business Description',
            labelFmt : wLabelFmt,
            inputFmt : wInputFmt
        } ],
        busContact = [ {
            select   : true,
            field    : 'busCat',
            inpName  : 'bus-ad-cat',
            inpHolder: adsOptDef,
            selectOpt: adsOpt,
            labelTxt : 'Category',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        }, {
            field    : 'busPhone',
            inpName  : 'bus-ad-phone',
            inpHolder: '123-123-1234',
            labelTxt : 'Phone',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        }, {
            field    : 'busWeb',
            inpName  : 'bus-ad-web',
            inpHolder: 'https://something.com',
            labelTxt : 'Your web',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        }, {
            field    : 'busEmail',
            inpName  : 'bus-ad-email',
            inpHolder: 'you@something.com',
            labelTxt : 'Your email',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        }, {
            field    : 'busStreet',
            inpName  : 'bus-ad-street',
            inpHolder: '123 Your Street Address',
            labelTxt : 'Address',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        }, {
            field    : 'busCity',
            inpName  : 'bus-ad-city',
            inpHolder: 'Your City',
            labelTxt : 'City',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        }, {
            field    : 'busState',
            inpName  : 'bus-ad-state',
            inpHolder: 'CA',
            labelTxt : 'State',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        }, {
            field    : 'busZip',
            inpName  : 'bus-ad-zip',
            inpHolder: '12345',
            labelTxt : 'Zip',
            labelFmt : cLabelFmt,
            inputFmt : cInputFmt
        } ];
        this.forms = {
            formId   : 'bus-ads',
            formFmt  : 'product-content product-wrap clearfix',
            submitFn : Actions.publicPostAds,
            formEntries: [ {
                legend : 'About Business',
                inline : true,
                sectFmt: 'product-deatil',
                entries: aboutBus
            }, {
                legend : 'Business Contact',
                sectFmt: 'product-deatil',
                inline : true,
                twoCols: true,
                entries: busContact
            } ],
            buttons: [ {
                btnName  : 'bus-ad-submit',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Create", "Submit", "Published");
                }
            } ]
        };
    }
}

export class GenericAds extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            ads: "none"
        }
        this._renderForm   = this._renderForm.bind(this);
        this._renderWindow = this._renderWindow.bind(this);
    }

    _renderForm() {
    }

    _renderWindow() {
        let id = this.props.id || "ads-post",
            title = this.props.title || <Mesg text="Post Your Ads"/>;
        return (
            <JarvisWidget id={id} color="purple">
                <header>
                    <span className="widget-icon"><i className="fa fa-pencil"/></span>
                    <h2>{title}</h2>
                </header>
                <div className="widget-body">
                    {this._renderForm()}
                </div>
            </JarvisWidget>
        );
    }

    render() {
        return this._renderWindow();
    }
}

export class PostAds extends GenericAds
{
    constructor(props) {
        super(props);
        this.data = new BusAds(props, "");
    }

    // @Override
    //
    _renderForm() {
        return (
            <ProcessForm form={this.data} store={AdsStore} value={this.props.ads}/>
        );
    }
}

export default PostAds;
