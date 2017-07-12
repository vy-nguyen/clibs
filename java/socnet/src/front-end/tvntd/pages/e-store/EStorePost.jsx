/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import StateButton         from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
import ArticleTagStore     from 'vntd-root/stores/ArticleTagStore.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import Mesg                from 'vntd-root/components/Mesg.jsx';

import { EProductStore }         from 'vntd-root/stores/ArticleStore.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class StorePost extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initData();
        return this;
    }

    initData() {
        let labelFmt = 'control-label col-sx-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt = 'control-label col-sx-9 col-sm-9 col-md-9 col-lg-9',
        prodInfo = [ {
            field    : 'prodCat',
            inpName  : 'prod-cat-',
            inpHolder: 'Product Category',
            labelTxt : 'Category',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'prodName',
            labelTxt : 'Product Name',
            inpName  : 'prod-name-',
            inpHolder: 'Product Name',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'prodPrice',
            labelTxt : 'Price',
            inpName  : 'prod-price-',
            inpHolder: 'Product Price',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'pubTag',
            labelTxt : 'Publish Category',
            select   : true,
            inpName  : 'publish-cat-',
            selectOpt: ArticleTagStore.getPublicTagsSelOpt("estore"),
            labelFmt : labelFmt,
            inputFmt : inputFmt
        } ],
        prodDesc = [ {
            field    : 'prodNotice',
            labelTxt : 'Promotion',
            inpName  : 'price-notice-',
            inpHolder: 'Include shipping'
        }, {
            field    : 'prodDesc',
            inpName  : 'prod-desc-',
            labelTxt : 'Brief description',
            editor   : true
        }, {
            field    : 'prodDetail',
            inpName  : 'prod-detail-',
            labelTxt : 'Detail description',
            editor   : true
        }, {
            field    : 'prodSpec',
            inpName  : 'prod-spec-',
            labelTxt : 'Product Specification',
            editor   : true
        }, ],
        imgInfo = [ {
            url      : "/user/upload-product-img",
            field    : 'prodLogo',
            inpName  : 'prod-logo-',
            dropzone : true,
            labelTxt : 'Your logo image'
        }, {
            url      : "/user/upload-product-detail",
            field    : 'prodImg',
            inpName  : 'prod-imgs-',
            dropzone : true,
            labelTxt : 'Your product images'
        } ];
        this.forms = {
            formId   : 'post-product',
            formFmt  : 'product-content product-wrap clearfix',
            submitFn : Actions.publishProduct,
            formEntries: [ {
                legend : 'Upload Images',
                sectFmt: 'product-deatil',
                entries: imgInfo
            }, {
                legend : 'Product Info',
                sectFmt: 'product-deatil',
                twoCols: true,
                entries: prodInfo
            }, {
                sectFmt: 'product-deatil',
                entries: prodDesc
            } ],
            buttons: [ {
                btnName  : 'prod-post-submit',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Create", "Submit", "Published");
                }
            } ]
        };
    }

    uploadImageOk(result) {
        let img = super.uploadImageOk(result);
        if (img != null) {
            if (result.postType === "logo") {
                img.logoObjId = result.imgObjId;
            } else {
                if (img.picObjIds == null) {
                    img.picObjIds = [];
                }
                img.picObjIds.push(result.imgObjId);
            }
        }
    }

    getData(entryInfo) {
        let data = super.getData(entryInfo), imgRec = data.imageRec;

        data.estore     = true;
        data.prodTags   = [];
        data.prodTitle  = data.prodName;
        data.prodImgs   = imgRec.picObjIds;
        data.logoImg    = imgRec.logoObjId;
        data.createDate = (new Date()).getDate();
        data.imageRec   = null;
        data.adImgs     = null;
        return data;
    }
}

class EStorePost extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let data, props = this.props, product = props.product,
            uuid = product != null ? product.articleUuid : "-store";

        data = new StorePost(props, uuid);
        return (
            <JarvisWidget id="ads-post" color="purple">
                <header>
                    <span className="widget-icon"><i className="fa fa-pencil"/></span>
                    <h2><Mesg text="Post Your Product"/></h2>
                </header>
                <div className="widget-body">
                    <ProcessForm form={data} store={EProductStore} value={product}/>
                </div>
            </JarvisWidget>
        );
    }
}

export default EStorePost;
