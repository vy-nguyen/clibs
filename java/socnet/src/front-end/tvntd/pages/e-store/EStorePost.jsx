/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {choose}                  from 'vntd-shared/utils/Enum.jsx';

import ErrorView        from 'vntd-shared/layout/ErrorView.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import InputStore       from 'vntd-shared/stores/NestableStore.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore       from 'vntd-shared/stores/ErrorStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import {EProductStore}  from 'vntd-root/stores/ArticleStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang             from 'vntd-root/stores/LanguageStore.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx';

import {
    SelectWrap, DropZoneWrap, InputInline, InputBox
} from 'vntd-shared/forms/commons/GenericForm.jsx';

class EStorePost extends React.Component
{
    constructor(props) {
        super(props);
        this.dropzone     = null;
        this._dzSend      = this._dzSend.bind(this);
        this._dzError     = this._dzError.bind(this);
        this._dzSuccess   = this._dzSuccess.bind(this);
        this._onBlurInput = this._onBlurInput.bind(this);
        this._updateState = this._updateState.bind(this);
        this._editProduct = this._editProduct.bind(this);
        this._getPostData = this._getPostData.bind(this);
        this._getInitState  = this._getInitState.bind(this);
        this._onSaveProduct = this._onSaveProduct.bind(this);
        this._onPostProduct = this._onPostProduct.bind(this);
        this._imageUploadOk = this._imageUploadOk.bind(this);

        this._myUuid       = UserStore.getSelfUuid();
        this._errorId      = "estore-post-" + this._myUuid;
        this._prodCatId    = "prod-cat-id-";
        this._prodNameId   = "prod-name-id-";
        this._prodPriceId  = "prod-price-id-";
        this._prodNoticeId = "prod-notice-id-";
        this._logoImgId    = "prod-logo-id-";
        this._prodPicsId   = "prod-pics-id-";
        this._publicCatId  = "pub-cat-id-";
        this._prodDescId   = "prod-desc-";
        this._prodSpecId   = "prod-spec-";
        this._ImageRecId   = "prod-imgs-";
        this._prodDetailId = "detail-desc-";
        this._saveBtnId    = "save-product-btn-";
        this._publishBtnId = "publish-product-btn-";

        this._saveBtn = StateButtonStore.createButton(this._saveBtnId, function() {
            return StateButton.saveButtonFsm(Lang.translate("Save"),
                                             Lang.translate("Save Editing"),
                                             Lang.translate("Saved Product"));
        }); 
        this._publishBtn = StateButtonStore.createButton(this._publishBtnId, function() {
            return StateButton.saveButtonFsm(Lang.translate("Create"),
                                             Lang.translate("Create Product"),
                                             Lang.translate("Published Product"));
        });
        this.state = this._getInitState();
    }

    _getItemId(base) {
        return base + (this.props.product != null ? this.props.product.articleUuid : "");
    }

    _getInitState() {
        return {
            errFlags: {}
        };
    }

    componentWillMount() {
        let product = this.props.product;
        if (product == null) {
            return;
        }
        InputStore.storeItemIndex(this._getItemId(this._prodCatId),
                                  product.prodCat, false);
        InputStore.storeItemIndex(this._getItemId(this._prodNameId),
                                  product.prodName, false);
        InputStore.storeItemIndex(this._getItemId(this._prodPriceId),
                                  product.prodPrice, false);
        InputStore.storeItemIndex(this._getItemId(this._prodNoticeId),
                                  product.prodNotice, false);
        InputStore.storeItemIndex(this._getItemId(this._publicCatId),
                                  product.publicTag, false);
        InputStore.storeItemIndex(this._getItemId(this._prodDescId),
                                  product.prodDesc, false);
        InputStore.storeItemIndex(this._getItemId(this._prodDetailId),
                                  product.prodDetail, false);
        InputStore.storeItemIndex(this._getItemId(this._prodSpecId),
                                  product.prodSpec, false);
    }

    componentDidMount() {
        this.unsub = EProductStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _dzError() {
    }

    _dzSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', this._myUuid);
        form.append('articleUuid', this.state.articleUuid);
    }

    _dzSuccess(dz, hdr, progress) {
        this._imageUploadOk(null, hdr);
    }

    _imageUploadOk(entry, result) {
        let picObjId, logoObjId, imgRec, imgRecId;

        picObjId  = this.state.picObjId;
        logoObjId = this.state.logoObjId;
        imgRecId  = this._getItemId(this._ImageRecId);
        imgRec    = InputStore.getItemIndex(imgRecId);

        if (imgRec == null) {
            imgRec = {
                articleUuid: result.articleUuid,
                authorUuid : result.authorUuid,
                picObjIds  : []
            };
        }
        if (result.postType === "logo") {
            imgRec.logoObjId = result.imgObjId;
        } else {
            imgRec.picObjIds.push(result.imgObjId);
        }
        InputStore.storeItemIndex(imgRecId, imgRec, false);
    }

    _onBlurInput(e) {
        ErrorStore.clearError(this._errorId);
        StateButtonStore.setButtonStateObj(this._publishBtn, "needSave");
    }

    _onSaveProduct() {
        StateButtonStore.setButtonStateObj(this._publishBtn, "saving");
    }

    _onPostProduct() {
        let product, helpText, errText = null, errFlags = {},
            defProd = this.props.product;

        product  = this._getPostData();
        helpText = Lang.translate("Enter values in categories highlighted in red");

        if (product.articleUuid == null) {
            errText  = Lang.translate("You forgot to upload pictures for your product");
        }
        [
            "prodCat", "prodDesc", "prodDetail", "prodName",
            "prodNotice", "prodPrice", "prodSpec", "pubTag", "prodDetail"
        ].forEach(function(entry) {
            if (defProd != null && defProd[entry] != null && _.isEmpty(product[entry])) {
                product[entry] = defProd[entry];
            }
            if (_.isEmpty(product[entry])) {
                errFlags[entry] = true;
                if (errText == null) {
                    errText  = Lang
                        .translate("Please enter values in highlighted fields");
                }
            }
        });
        if (errText != null) {
            this.setState({
                errFlags: errFlags
            });
            ErrorStore.reportErrMesg(this._errorId, errText, helpText);
            return;
        }
        StateButtonStore.setButtonStateObj(this._publishBtn, "saving");
        Actions.publishProduct(product);
    }

    _getPostData() {
        let imgRec = InputStore.getItemIndex(this._getItemId(this._ImageRecId)),
            product = this.props.product;

        if (product == null && imgRec == null) {
            return {};
        }
        if (imgRec == null) {
            imgRec = {
                articleUuid: product.articleUuid,
                prodImgs   : [],
                logoImg    : 0
            }
        }
        return {
            estore     : true,
            authorUuid : this._myUuid,
            articleUuid: imgRec.articleUuid,
            prodCat    : InputStore.getIndexString(this._getItemId(this._prodCatId)),
            prodName   : InputStore.getIndexString(this._getItemId(this._prodNameId)),
            prodTitle  : InputStore.getIndexString(this._getItemId(this._prodNameId)),
            prodPrice  : InputStore.getIndexString(this._getItemId(this._prodPriceId)),
            prodNotice : InputStore.getIndexString(this._getItemId(this._prodNoticeId)),
            pubTag     : InputStore.getIndexString(this._getItemId(this._publicCatId)),
            prodDesc   : InputStore.getIndexString(this._getItemId(this._prodDescId)),
            prodDetail : InputStore.getIndexString(this._getItemId(this._prodDetailId)),
            prodSpec   : InputStore.getIndexString(this._getItemId(this._prodSpecId)),
            prodImgs   : imgRec.picObjIds,
            prodTags   : [],
            logoImg    : imgRec.logoObjId,
            createDate : (new Date()).getDate()
        };
    }

    _clearPostData() {
        let dz = InputStore.clearItemIndex(this._getItemId(this._logoImgId));

        if (dz != null) {
            dz.removeAllFiles();
        }
        dz = InputStore.clearItemIndex(this._getItemId(this._prodPicsId));
        if (dz != null) {
            dz.removeAllFiles();
        }
        InputStore.clearItemIndex(this._getItemId(this._prodCatId));
        InputStore.clearItemIndex(this._getItemId(this._prodNameId));
        InputStore.clearItemIndex(this._getItemId(this._prodPriceId));
        InputStore.clearItemIndex(this._getItemId(this._prodNoticeId));
        InputStore.clearItemIndex(this._getItemId(this._publicCatId));
        InputStore.clearItemIndex(this._getItemId(this._prodDescId));
        InputStore.clearItemIndex(this._getItemId(this._prodDetailId));
        InputStore.clearItemIndex(this._getItemId(this._prodSpecId));
        InputStore.clearItemIndex(this._getItemId(this._ImageRecId));
    }

    _updateState(store, data, status) {
        if (data == null || data.length > 1) {
            return;
        }
        let product = data[0];
        if (status !== "postOk" || product.authorUuid !== this._myUuid) {
            return;
        }
        StateButtonStore.setButtonStateObj(this._publishBtn, "saved");
        this._clearPostData();
        this.setState(this._getInitState());
    }

    _editProduct() {
        let catVal, nameVal, priceVal, noticeVal, prodDescId, prodDetailId,
            prodSpecId, pubTag, dropImg = null, post = this.props.product;

        if (post != null) {
            pubTag    = post.publicTag;         
            catVal    = post.prodCat;
            nameVal   = post.prodName;
            priceVal  = post.prodPrice;
            noticeVal = post.prodNotice;
        } else {
            pubTag    = null;
            catVal    = null;
            nameVal   = null;
            priceVal  = null;
            noticeVal = null;
        }
        prodDescId   = this._getItemId(this._prodDescId);
        prodDetailId = this._getItemId(this._prodDetailId);
        prodSpecId   = this._getItemId(this._prodSpecId);

        const prodCat = {
            labelTxt : Lang.translate("Category"),
            inpName  : this._getItemId(this._prodCatId),
            inpDefVal: catVal,
            inpHolder: Lang.translate("Product Category"),
            errorId  : "prodCat",
            errorFlag: this.state.errFlags.prodCat
        },
        prodName = {
            labelTxt : Lang.translate("Name"),
            inpName  : this._getItemId(this._prodNameId),
            inpDefVal: nameVal,
            inpHolder: Lang.translate("Product Name"),
            errorId  : "prodName",
            errorFlag: this.state.errFlags.prodName
        },
        prodPrice = {
            labelTxt : Lang.translate("Price"),
            inpName  : this._getItemId(this._prodPriceId),
            inpDefVal: priceVal,
            inpHolder: Lang.translate("Product Price"),
            errorId  : "prodPrice",
            errorFlag: this.state.errFlags.prodPrice
        },
        priceNotice = {
            labelTxt : Lang.translate("Promotion"),
            inpName  : this._getItemId(this._prodNoticeId),
            inpDefVal: noticeVal,
            inpHolder: Lang.translate("Include shipping"),
            errorId  : "prodNotice",
            errorFlag: this.state.errFlags.prodNotice
        },
        publicCat = {
            labelTxt : Lang.translate("Publish Category"),
            inpHolder: pubTag,
            select   : true,
            inpName  : this._getItemId(this._publicCatId),
            selectOpt: ArticleTagStore.getPublicTagsSelOpt("estore")
        },
        prodDesc = {
            id       : prodDescId,
            labelTxt : Lang.translate("Brief description"),
            inpName  : "prodDesc",
            editor   : true,
            inpDefVal: choose(InputStore.getIndexString(prodDescId),
                              Lang.translate("Brief description of the product")),
            errorFlag: this.state.errFlags.prodDesc
            // uploadUrl: '/user/upload-product-img',
            // uploadOk : this._imageUploadOk
        },
        prodDescDetail = {
            id       : prodDetailId,
            labelTxt : Lang.translate("Detail description"),
            inpName  : "prodDetail",
            editor   : true,
            inpDefVal: choose(InputStore.getIndexString(prodDetailId),
                              Lang.translate("Detail description of the product")),
            errorId  : "prodDetail",
            errorFlag: this.state.errFlags.prodDetail,
            // uploadUrl: '/user/upload-product-detail',
            // uploadOk : this._imageUploadOk
        },
        prodSpec = {
            id       : prodSpecId,
            labelTxt : Lang.translate("Product Specification"),
            inpName  : "prodSpec",
            inpDefVal: choose(InputStore.getIndexString(prodSpecId),
                              Lang.translate("Specification of the product")),
            editor   : true,
            errorId  : "prodSpec",
            errorFlag: this.state.errFlags.prodSpec
        },
        logoDropzone = {
            sending: this._dzSend,
            success: this._dzSuccess,
            error  : this._dzError,
            init   : function(dz) {
                InputStore.storeItemIndex(this._getItemId(this._logoImgId), dz, true);
            }.bind(this)
        },
        eventHandlers = {
            sending: this._dzSend,
            success: this._dzSuccess,
            error  : this._dzError,
            init   : function(dz) {
                InputStore.storeItemIndex(this._getItemId(this._prodPicsId), dz, true);
            }.bind(this)
        },
        briefDz = {
            url        : "/user/upload-product-img",
            defaultMesg: "Drop image here",
            errorId    : "logoImg",
            errorFlag  : this.state.errFlags.logoImg
        },
        detailDz = {
            url        : "/user/upload-product-detail",
            errorId    : "prodImgs",
            errorFlag  : this.state.errFlags.prodImgs
        };
        if (this.props.product == null) {
            dropImg = (
                <div className="row">
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className="container">
                            <h3><Mesg text="Upload icon image"/></h3>
                            <DropZoneWrap entry={briefDz} eventHandlers={logoDropzone}/>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <div className="container">
                            <h3><Mesg text="Upload detail images"/></h3>
                            <DropZoneWrap entry={detailDz}
                                eventHandlers={eventHandlers}/>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="product-content product-wrap clearfix">
                {dropImg}
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="product-deatil">
                            <div className="name">
                                <InputBox entry={publicCat}/>
                                <InputInline entry={prodCat}
                                    bind={this} onBlur={this._onBlurInput}/>
                                <InputInline entry={prodName}
                                    bind={this} onBlur={this._onBlurInput}/>
                                <InputInline entry={prodPrice}
                                    bind={this} onBlur={this._onBlurInput}/>
                                <InputInline entry={priceNotice}
                                    bind={this} onBlur={this._onBlurInput}/>
                            </div>
                            <span className="tag1"></span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <InputInline entry={prodDesc}
                            bind={this} onBlur={this._onBlurInput}/>
                        <InputInline entry={prodDescDetail}
                            bind={this} onBlur={this._onBlurInput}/>
                        <InputInline entry={prodSpec}
                            bind={this} onBlur={this._onBlurInput}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <ErrorView errorId={this._errorId}/>
                        <div className="btn-group pull-right" role="group">
                            <StateButton btnId={this._saveBtnId}
                                className="btn btn-success"
                                onClick={this._onSaveProduct}/>
                            <StateButton btnId={this._publishBtnId}
                                className="btn btn-success"
                                onClick={this._onPostProduct}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <article className="col-sm-12 col-md-12 col-lg-12">
                    <JarvisWidget id="estore-post" color="purple">
                        <header>
                            <span className="widget-icon">
                                <i className="fa fa-pencil"/>
                            </span>
                            <h2><Mesg text="EStore Item"/></h2>
                        </header>
                        <div className="widget-body">
                            {this._editProduct()}
                        </div>
                    </JarvisWidget>
                </article>
            </div>
        )
    }
}

export default EStorePost;
