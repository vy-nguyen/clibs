/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {GenericForm, SelectWrap} from 'vntd-shared/forms/commons/GenericForm.jsx';
import {choose}                  from 'vntd-shared/utils/Enum.jsx';

import ErrorView        from 'vntd-shared/layout/ErrorView.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import NestableStore    from 'vntd-shared/stores/NestableStore.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore       from 'vntd-shared/stores/ErrorStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import {EProductStore}  from 'vntd-root/stores/ArticleStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';

class EStorePost extends React.Component
{
    constructor(props) {
        super(props);

        this.dropzone  = null;
        this._dzSend   = this._dzSend.bind(this);
        this._dzError  = this._dzError.bind(this);
        this._dzSuccess = this._dzSuccess.bind(this);
        this._onBlurInput = this._onBlurInput.bind(this);
        this._updateState = this._updateState.bind(this);
        this._editProduct = this._editProduct.bind(this);
        this._getPostData = this._getPostData.bind(this);
        this._selPublicCat  = this._selPublicCat.bind(this);
        this._getInitState  = this._getInitState.bind(this);
        this._onSaveProduct = this._onSaveProduct.bind(this);
        this._onPostProduct = this._onPostProduct.bind(this);
        this._imageUploadOk = this._imageUploadOk.bind(this);

        this._myUuid  = UserStore.getSelfUuid();
        this._errorId = "estore-post-" + this._myUuid;
        this._prodDescId   = "prod-desc";
        this._prodSpecId   = "prod-spec";
        this._ImageRecId   = "prod-imgs";
        this._prodDetailId = "detail-desc";
        this._saveBtnId    = "save-product-btn";
        this._publishBtnId = "publish-product-btn";

        this.publicCat = {
            labelTxt : "Publish Category",
            inpName  : "pulbTag",
            select   : true,
            selectOpt: ArticleTagStore.getPublicTagsSelOpt("estore")
        };
        this._saveBtn = StateButtonStore.createButton(this._saveBtnId, function() {
            return StateButton.saveButtonFsm("Save", "Save Editing", "Saved Product");
        }); 
        this._publishBtn = StateButtonStore.createButton(this._publishBtnId, function() {
            return StateButton.saveButtonFsm("Create", "Create Product", "Published Product");
        });
        this.state = this._getInitState();
    }
    
    _getInitState() {
        return {
            errFlags: {}
        };
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
        let picObjId, logoObjId, imgRec;

        picObjId  = this.state.picObjId;
        logoObjId = this.state.logoObjId;
        imgRec    = NestableStore.getItemIndex(this._ImageRecId);

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
        NestableStore.storeItemIndex(this._ImageRecId, imgRec, false);
    }

    _onBlurInput(e) {
        ErrorStore.clearError(this._errorId);
        StateButtonStore.setButtonStateObj(this._publishBtn, "needSave");
    }

    _selPublicCat(entry, val) {
        console.log(">>> select public tag " + val.value);
    }

    _onSaveProduct() {
        StateButtonStore.setButtonStateObj(this._publishBtn, "saving");
        console.log("Save product...");
        console.log(this._getPostData());
    }

    _onPostProduct() {
        let product, helpText, errText, errFlags;

        product  = this._getPostData();
        helpText = "Enter values in categories highlighed in red";
        errText  = null;
        errFlags = {};

        console.log(product);
        if (product.articleUuid == null) {
            errText  = "You forgot to upload pictures for your product";
        }
        [
            "prodCat", "prodDesc", "prodDetail", "prodName",
            "prodNotice", "prodPrice", "prodSpec", "prodTitle",
            "pubTag", "prodDetail"

        ].forEach(function(entry) {
            if (_.isEmpty(product[entry])) {
                console.log("Missing field " + entry);
                errFlags[entry] = true;
                if (errText == null) {
                    errText  = "Please enter values highlighted fields";
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
        let imgRec = NestableStore.getItemIndex(this._ImageRecId);
        if (imgRec == null) {
            return {};
        }
        return {
            estore    : true,
            authorUuid : this._myUuid,
            articleUuid: imgRec.articleUuid,
            pubTag     : this.publicCat.taValue,
            prodCat    : this.refs.prodCat.value,
            prodName   : this.refs.prodName.value,
            prodTitle  : this.refs.prodName.value,
            prodPrice  : this.refs.prodPrice.value,
            prodNotice : this.refs.prodNotice.value,
            prodDesc   : NestableStore.getIndexString(this._prodDescId),
            prodDetail : NestableStore.getIndexString(this._prodDetailId),
            prodSpec   : NestableStore.getIndexString(this._prodSpecId),
            prodImgs   : imgRec.picObjIds,
            prodTags   : [],
            logoImg    : imgRec.logoObjId,
            createDate : (new Date()).getDate()
        };
    }

    _clearPostData() {
        let refs = this.refs;
        refs.prodCat.value    = '';
        refs.prodName.value   = '';
        refs.prodPrice.value  = '';
        refs.prodNotice.value = '';
        NestableStore.clearItemIndex(this._prodDescId);
        NestableStore.clearItemIndex(this._prodDetailId);
        NestableStore.clearItemIndex(this._prodSpecId);
        NestableStore.clearItemIndex(this._ImageRecId);

        if (this.dropzone != null) {
            this.dropzone.removeAllFiles();
        }
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
        const prodCat = {
            labelTxt : "Categorty",
            inpName  : "prodCat",
            inpHolder: choose(this.refs.prodCat, "value", "Category"),
            errorId  : "prodCat",
            errorFlag: this.state.errFlags.prodCat
        };
        const prodName = {
            labelTxt : "Name",
            inpName  : "prodName",
            inpHolder: choose(this.refs.prodName, "value", "Product Name"),
            errorId  : "prodName",
            errorFlag: this.state.errFlags.prodName
        }
        const prodPrice = {
            labelTxt : "Price",
            inpName  : "prodPrice",
            inpHolder: choose(this.refs.prodPrice, "value", "Product Price"),
            errorId  : "prodPrice",
            errorFlag: this.state.errFlags.prodPrice
        };
        const priceNotice = {
            labelTxt : "Promotion",
            inpName  : "prodNotice",
            inpHolder: choose(this.refs.prodNotice, "value", "Include shipping"),
            errorId  : "prodNotice",
            errorFlag: this.state.errFlags.prodNotice
        };
        const prodDesc = {
            id       : this._prodDescId,
            labelTxt : "Brief description",
            inpName  : "prodDesc",
            editor   : true,
            inpHolder: choose(NestableStore.getIndexString(this._prodDescId), "Brief description of product"),
            errorFlag: this.state.errFlags.prodDesc
            // uploadUrl: '/user/upload-product-img',
            // uploadOk : this._imageUploadOk
        };
        const prodDescDetail = {
            id       : this._prodDetailId,
            labelTxt : "Detail description",
            inpName  : "prodDetail",
            editor   : true,
            inpHolder: choose(NestableStore.getIndexString(this._prodDetailId), "Brief description of product"),
            errorId  : "prodDetail",
            errorFlag: this.state.errFlags.prodDetail,
            uploadUrl: '/user/upload-product-detail',
            uploadOk : this._imageUploadOk
        };
        const prodSpec = {
            id       : this._prodSpecId,
            labelTxt : "Product Specification",
            inpName  : "prodSpec",
            inpHolder: choose(NestableStore.getIndexString(this._prodSpecId), "Brief description of product"),
            editor   : true,
            errorId  : "prodSpec",
            errorFlag: this.state.errFlags.prodSpec
        };
        const eventHandlers = {
            sending: this._dzSend,
            success: this._dzSuccess,
            error  : this._dzError,
            init   : function(dz) {
                this.dropzone = dz;
            }
        };
        const briefDz = {
            url        : "/user/upload-product-img",
            defaultMesg: "Drop image here",
            errorId    : "logoImg",
            errorFlag  : this.state.errFlags.logoImg
        };
        const detailDz = {
            url        : "/user/upload-product-detail",
            errorId    : "prodImgs",
            errorFlag  : this.state.errFlags.prodImgs
        };

        return (
            <div className="product-content product-wrap clearfix">
                <div className="row">
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className="container">
                            <h3>Upload icon image</h3>
                            {GenericForm.renderDropzone(briefDz, eventHandlers)}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <div className="container">
                            <h3>Upload detail images</h3>
                            {GenericForm.renderDropzone(detailDz, eventHandlers)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="product-deatil">
                            <div className="name">
                                {GenericForm.renderInputBox(this.publicCat, this, null, this._selPublicCat)}
                                {GenericForm.renderInputInline(prodCat, this, this._onBlurInput)}
                                {GenericForm.renderInputInline(prodName, this, this._onBlurInput)}
                                {GenericForm.renderInputInline(prodPrice, this, this._onBlurInput)}
                                {GenericForm.renderInputInline(priceNotice, this, this._onBlurInput)}
                            </div>
                            <span className="tag1"></span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {GenericForm.renderInputInline(prodDesc, this, this._onBlurInput)}
                        {GenericForm.renderInputInline(prodDescDetail, this, this._onBlurInput)}
                        {GenericForm.renderInputInline(prodSpec, this, this._onBlurInput)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <ErrorView errorId={this._errorId}/>
                        <div className="btn-group pull-right" role="group">
                            <StateButton btnId={this._saveBtnId} className="btn btn-success"
                                onClick={this._onSaveProduct}/>
                            <StateButton btnId={this._publishBtnId} className="btn btn-success"
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
                            <span className="widget-icon"> <i className="fa fa-pencil"/></span>
                            <h2>EStore Item</h2>
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
