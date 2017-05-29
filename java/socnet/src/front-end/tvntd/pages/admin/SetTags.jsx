/**
 * Vy Nguyen (2016)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import ListTags           from './ListTags.jsx';

class SetTags extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div id="content">
                <section id="widget-grid" className="">
                </section>
                <ListTags tagKind={null}/>
            </div>
        );
    }
}

export default SetTags;
