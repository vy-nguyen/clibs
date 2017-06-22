/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _     from 'lodash';
import React from 'react-mod';

import ErrorView    from 'vntd-shared/layout/ErrorView.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import InputStore   from 'vntd-shared/stores/NestableStore.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import Mesg         from 'vntd-root/components/Mesg.jsx'

import { SelectWrap, InputInline } from 'vntd-shared/forms/commons/GenericForm.jsx';

class RefLinks extends React.Component
{
    constructor(props) {
        super(props);

        this._updateState  = this._updateState.bind(this);
        this._renderArtRef = this._renderArtRef.bind(this);
        this.state = {
            rankUpdate: 0
        };
    }

    componentDidMount() {
        this.unsub = AuthorStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data, artRank, what) {
        if (artRank == null || what !== "update") {
            return;
        }
        if (this.props.article.articleUuid === artRank.articleUuid) {
            this.setState({
                rankUpdate: this.state.rankUpdate + 1
            });
        }
    }

    _onClick(artUuid, artRank) {
        if (this.props.notifyId != null) {
            InputStore.storeItemTrigger(this.props.notifyId, {
                artUuid: artUuid,
                artRank: artRank
            }, true);
        }
    }

    _renderArtRef(article, refUuid, inpSelect, left) {
        let title, artRank = null, out = null;

        if (refUuid != null) {
            artRank = AuthorStore.getArticleRankByUuid(refUuid);
        }
        if (artRank != null) {
            title = artRank.artTitle;
            if (left === true) {
                out = (
                    <button type="button" className="btn btn-default btn-lg pull-left"
                        onClick={this._onClick.bind(this, refUuid, artRank)}>
                        <i className="fa fa-lg fa-angle-double-left"/>  {title}
                    </button>
                );
            } else {
                out = (
                    <button type="button" className="btn btn-default btn-lg pull-right"
                        onClick={this._onClick.bind(this, refUuid, artRank)}>
                        {title}  <i className="fa fa-lg fa-angle-double-right"/>
                    </button>
                );
            }
            if (UserStore.isUserMe(article.authorUuid)) {
                out = (
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="row padding-10">
                            {out}
                        </div>
                        <div className="row padding-10">
                            <SelectWrap entry={inpSelect}/>
                        </div>
                    </div>
                );
            }
        } else if (UserStore.isUserMe(article.authorUuid)) {
            out = <InputInline entry={inpSelect}/>
        }
        return out;
    }

    render() {
        let article = this.props.article, rank = article.rank, prevArt, nextArt,
            prevRef = null, nextRef = null, tagMgr, prevSelect, nextSelect,
            prevSelVal, nextSelVal, prevSelId, nextSelId;

        if (rank == null) {
            return null;
        }
        prevArt = rank.prevArticle;
        nextArt = rank.nextArticle;

        if (!UserStore.isUserMe(article.authorUuid)) {
            if (prevArt == null && nextArt == null) {
                return null;
            }
        }
        tagMgr     = AuthorStore.getAuthorTagMgr(article.authorUuid);
        prevSelId  = RefLinks.getPrevRefArtId(article.articleUuid);
        nextSelId  = RefLinks.getNextRefArtId(article.articleUuid);
        prevSelVal = InputStore.getItemIndex(prevSelId);
        nextSelVal = InputStore.getItemIndex(nextSelId);

        if (prevSelVal == null) {
            prevSelVal = prevArt;
        }
        if (nextSelVal == null) {
            nextSelVal = nextArt;
        }
        prevSelect = {
            select   : true,
            inpName  : prevSelId,
            inpHolder: prevSelVal,
            selectOpt: tagMgr.getAllArtSelect(),
            onSelect : null,
            labelTxt : 'Prev Ref',
            labelFmt : 'control-label col-sx-2 col-sm-2 col-md-2 col-lg-2',
            inputFmt : 'control-label col-sx-10 col-sm-10 col-md-10 col-lg-10'
        };
        nextSelect = {
            select   : true,
            inpName  : nextSelId,
            inpHolder: nextSelVal,
            selectOpt: prevSelect.selectOpt,
            onSelect : null,
            labelTxt : 'Next Ref',
            labelFmt : prevSelect.labelFmt,
            inputFmt : prevSelect.inputFmt
        };
        prevRef = this._renderArtRef(article, prevArt, prevSelect, true);
        nextRef = this._renderArtRef(article, nextArt, nextSelect, false);
        return (
            <div className="row">
                <div className="col-sx-6 col-sm-6 col-md-6 col-lg-6">
                    {prevRef}
                </div>
                <div className="col-sx-6 col-sm-6 col-md-6 col-lg-6">
                    {nextRef}
                </div>
            </div>
        )
    }

    static getPrevRefArtId(artUuid) {
        return 'prev-ref-' + artUuid;
    }

    static getNextRefArtId(artUuid) {
        return 'next-ref-' + artUuid;
    }
}

export default RefLinks;
