/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {GenericForm, SelectWrap} from 'vntd-shared/forms/commons/GenericForm.jsx';

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

        this._myUuid  = UserStore.getSelfUuid();
        this._errorId = "estore-post-" + this._myUuid;
        this._prodDescId   = "prod-desc";
        this._prodSpecId   = "prod-spec";
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
            articleUuid: null,
            picObjId   : null,
            logoObjId  : null
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
        let picObjId = this.state.picObjId;
        let logoObjId = this.state.logoObjId;

        if (hdr.postType === "logo") {
            logoObjId = hdr.imgObjId;
        } else {
            picObjId = hdr.imgObjId;
        }
        this.setState({
            articleUuid: hdr.articleUuid,
            authorUuid : hdr.authorUuid,
            picObjId   : picObjId,
            logoObjId  : logoObjId
        });
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
        StateButtonStore.setButtonStateObj(this._publishBtn, "saving");

        let product = this._getPostData();
        console.log("publised this product");
        console.log(product);

        Actions.publishProduct(product);
    }

    _getPostData() {
        return {
            estore    : true,
            authorUuid : this._myUuid,
            articleUuid: this.state.articleUuid,
            pubTag     : this.publicCat.taValue,
            prodCat    : this.refs.prodCat.value,
            prodName   : this.refs.prodName.value,
            prodTitle  : this.refs.prodName.value,
            prodPrice  : this.refs.prodPrice.value,
            prodNotice : this.refs.prodNotice.value,
            prodDesc   : NestableStore.getIndexString(this._prodDescId),
            prodDetail : NestableStore.getIndexString(this._prodDetailId),
            prodSpec   : NestableStore.getIndexString(this._prodSpecId),
            prodImgs   : [],
            prodTags   : [],
            logoImg    : "",
            createDate : 0
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
            // ErrorStore.reportInfo(this._errorId, "You have some Error");
    }

    _editProduct() {
        const prodCat = {
            labelTxt : "Categorty",
            inpName  : "prodCat",
            inpHolder: "Category",
            errorId  : "prodCat",
        };
        const prodName = {
            labelTxt : "Name",
            inpName  : "prodName",
            inpHolder: "Product Name",
            errorId  : "prodName",
        }
        const prodPrice = {
            labelTxt : "Price",
            inpName  : "prodPrice",
            inpHolder: "Product Price",
            errorId  : "prodPrice",
        };
        const priceNotice = {
            labelTxt : "Promotion",
            inpName  : "prodNotice",
            inpHolder: "Include shipping",
            errorId  : "prodNotice",
        };
        const prodDesc = {
            id       : this._prodDescId,
            labelTxt : "Brief description",
            inpName  : "prodDesc",
            editor   : true
        };
        const prodDescDetail = {
            id       : this._prodDetailId,
            labelTxt : "Detail description",
            inpName  : "prodDetail",
            editor   : true
        };
        const prodSpec = {
            id       : this._prodSpecId,
            labelTxt : "Product Specification",
            inpName  : "prodSpec",
            editor   : true
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
            defaultMesg: "Drop image here"
        };
        const detailDz = {
            url: "/user/upload-product-detail"
        };

        return (
            <div className="product-content product-wrap clearfix">
                <div className="row">
                    <div className="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                        <div className="row">
                            <div className="container">
                                <h3>Upload icon image</h3>
                                {GenericForm.renderDropzone(briefDz, eventHandlers)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="container">
                                <h3>Upload detail images</h3>
                                {GenericForm.renderDropzone(detailDz, eventHandlers)}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-7 col-md-7 col-lg-7">
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
                        <div className="description">
                            {GenericForm.renderInputInline(prodDesc, this, this._onBlurInput)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {GenericForm.renderInputInline(prodDescDetail, this, this._onBlurInput)}
                        {GenericForm.renderInputInline(prodSpec, this, this._onBlurInput)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <ErrorView errorId={this._errorId}/>
                        <div className="btn-group pull-right" role="group">
                            <StateButton btnId={this._saveBtnId} className="btn btn-success" onClick={this._onSaveProduct}/>
                            <StateButton btnId={this._publishBtnId} className="btn btn-success" onClick={this._onPostProduct}/>
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
