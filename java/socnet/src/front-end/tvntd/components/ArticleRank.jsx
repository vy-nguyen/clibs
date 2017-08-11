/**
 * Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React  from 'react-mod';

import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import InputStore       from 'vntd-shared/stores/NestableStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import ArticleBase      from 'vntd-shared/layout/ArticleBase.jsx';

import Actions      from 'vntd-root/actions/Actions.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';
import LikeStat     from 'vntd-root/components/LikeStat.jsx';
import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';
import Lang         from 'vntd-root/stores/LanguageStore.jsx';

class ArticleRank extends ArticleBase
{
    constructor(props) {
        let artBtn;

        super(props);
        this.artBtnId = "art-rank-btn-" + props.articleUuid;
        this._toggleFullArticle = this._toggleFullArticle.bind(this);
        this._createReadButton  = this._createReadButton.bind(this);

        artBtn = StateButtonStore.createButton(this.artBtnId, this._createReadButton);
        this.state = {
            fullArt : artBtn.getStateCode(),
            article : ArticleStore.getArticleByUuid(props.articleUuid)
        };
    }

    componentWillMount() {
        let active = this.props.active;

        if (active != null && InputStore.getItemIndex(active) != null) {
            this._toggleFullArticle();
            InputStore.freeItemIndex(active);
        }
    }

    _updateArts(store, data, status, update, authorUuid) {
        let article = ArticleStore.getArticleByUuid(this.props.articleUuid);

        if (article != this.state.article) {
            this.setState({
                article: article
            });
        }
    }

    _createReadButton() {
        return {
            success: {
                text     : Lang.translate("Read more..."),
                disabled : false,
                nextState: "fullArt",
                className: "btn btn-success"
            },
            failure: {
                text     : Lang.translate("Read more..."),
                disabled : false,
                nextState: "success",
                className: "btn btn-info"
            },
            fullArt: {
                text     : Lang.translate("Done reading..."),
                disabled : false,
                nextState: "success",
                className: "btn btn-info"
            }
        };
    }

    _toggleFullArticle() {
        let artBtn = StateButtonStore.goNextState(this.artBtnId),
            newState = artBtn.getStateCode();

        if (newState !== this.state.fullArt) {
            this.setState({
                fullArt: newState,
                article: ArticleStore.getArticleByUuid(this.props.articleUuid)
            });
        }
    }

    render() {
        let likeStat, artPane = null, readBtn = null, rank = this.props.rank;

        if (this.props.noBtn == null) {
            readBtn = (
                <StateButton btnId={this.artBtnId} className="btn btn-success"
                    onClick={this._toggleFullArticle}/>
            );
        }
        if (this.state.article != null && this.state.fullArt === "fullArt") {
            artPane = (
                <div className="row">
                    <PostPane data={this.state.article} artRank={rank}/>
                </div>
            );
        }
        likeStat = {
            dateString: "1/1/1970",
            commentCount: 0,
            likesCount  : 0,
            sharesCount : 0
        }
        return (
            <div>
                <div className="well padding-10">
                    <div className="row padding-10">
                        <div className="col-xs-4 col-sm-4 col-md-4">
                            <h3>{rank.artTitle}</h3>
                            <br/>
                            <LikeStat data={likeStat}/>
                        </div>
                        <div className="col-xs-7 col-sm-7 col-md-7">
                            <p>{rank.contentBrief}</p>
                            {readBtn}
                        </div>
                    </div>
                </div>
                {artPane}
            </div>
        )
    }

    static renderArtRank(rank, refName, active) {
        return <ArticleRank rank={rank} articleUuid={rank.articleUuid} active={active}/>
    }

    static renderNoButton(rank, relName, expanded) {
        return <ArticleRank rank={rank} articleUuid={rank.articleUuid} noBtn={true}/>
    }
}

export default ArticleRank;
