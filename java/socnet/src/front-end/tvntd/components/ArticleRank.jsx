/**
 * Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React  from 'react-mod';

import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';

import Actions      from 'vntd-root/actions/Actions.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';
import LikeStat     from 'vntd-root/components/LikeStat.jsx';
import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';

class ArticleRank extends React.Component
{
    constructor(props) {
        super(props);
        this.artBtnId = "art-rank-btn-" + props.articleUuid;
        this._getArticleResult = this._getArticleResult.bind(this);
        this._toggleFullArticle = this._toggleFullArticle.bind(this);
        this._createReadButton = this._createReadButton.bind(this);

        let artBtn = StateButtonStore.createButton(this.artBtnId, this._createReadButton);
        this.state = {
            fullArt: artBtn.getStateCode(),
            article: ArticleStore.getArticleByUuid(props.articleUuid)
        };
    }

    componentDidMount() {
        this.unsub = ArticleStore.listen(this._getArticleResult);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _getArticleResult() {
    }

    _createReadButton() {
        return {
            success: {
                text: "Read more...",
                disabled : false,
                nextState: "fullArt",
                className: "btn btn-success"
            },
            failure: {
                text: "Read more...",
                disabled : false,
                nextState: "success",
                className: "btn btn-info"
            },
            fullArt: {
                text: "Done reading...",
                disabled : false,
                nextState: "success",
                className: "btn btn-info"
            }
        };
    }

    _toggleFullArticle() {
        let artBtn = StateButtonStore.goNextState(this.artBtnId);
        let newState = artBtn.getStateCode();
        if (newState !== this.state.fullArt) {
            this.setState({
                fullArt: newState,
                article: ArticleStore.getArticleByUuid(this.props.articleUuid)
            });
        }
    }

    render() {
        let artPane = null;
        let readBtn = null;
        let rank = this.props.rank;

        if (this.props.noBtn == null) {
            readBtn = (
                <StateButton btnId={this.artBtnId} className="btn btn-success" onClick={this._toggleFullArticle}/>
            );
        }
        if (this.state.article != null && this.state.fullArt === "fullArt") {
            artPane = (
                <div className="row">
                    <PostPane data={this.state.article} artRank={rank}/>
                </div>
            );
        }
        let likeStat = {
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

    static renderArtRank(rank, refName, expanded) {
        return <ArticleRank rank={rank} articleUuid={rank.articleUuid}/>
    }

    static renderNoButton(rank, relName, expanded) {
        return <ArticleRank rank={rank} articleUuid={rank.articleUuid} noBtn={true}/>
    }
}

export default ArticleRank;
