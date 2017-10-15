/**
 * Vy Nguyen (2017)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import ModalConfirm    from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ProductInfo     from 'vntd-root/pages/e-store/ProductInfo.jsx';
import {VConst}        from 'vntd-root/config/constants.js';

export class ModalPost extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let brief = AuthorStore.lookupArticleRankByUuid(this.props.articleUuid);

        if (brief == null) {
            return null;
        }
        if (brief.artTag === VConst.blog) {
            return <h1>Blog for {brief.getArticleUuid()}</h1>;
        }
        if (brief.artTag === VConst.ad) {
            return <h1>Ads for {brief.getArticleUuid()}</h1>;
        }
        return (
            <ProductInfo product={brief} modal={false}/>
        );
    }

    static renderPost(ref, articleUuid) {
        return (
            <ModalConfirm ref={ref} modalTitle="Post">
                <ModalPost articleUuid={articleUuid}/>
            </ModalConfirm>
        );
    }
}

export default ModalPost;
