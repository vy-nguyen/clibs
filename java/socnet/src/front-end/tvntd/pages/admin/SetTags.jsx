/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';
import ErrorView      from 'vntd-shared/layout/ErrorView.jsx';
import Actions        from 'vntd-root/actions/Actions.jsx';
import AdminStore     from 'vntd-root/stores/AdminStore.jsx';

let SetTags = React.createClass({
    mixins: [Reflux.connect(AdminStore)],

    _submitSetTag: function(event) {
        event.preventDefault();
        let data = {
            tagList: [ {
                tagName: this.refs.tagName.value,
                artTagUuids: this.refs.artTag.value
            } ]
        };
        console.log(data);
        Actions.setTags(data);
    },

    render: function() {
        return (
            <div>
                <form className="smart-form client-form">
                    <header>Admin Set Tags</header>
                    <fieldset>
                        <section>
                            <ErrorView className="form-group alert-danger"/>
                        </section>
                    </fieldset>
                    <fieldset>
                        <section>
                            <label className="label">Tag Name</label>
                            <label className="input">
                                <input name="tagName" ref="tagName"/>
                            </label>
                        </section>
                        <section>
                            <label className="label">ArticleTag Uuid</label>
                            <label className="input">
                                <input name="artTag" ref="artTag"/>
                            </label>
                        </section>
                    </fieldset>
                    <footer>
                        <button className="btn btn-primary" onClick={this._submitSetTag}>Submit</button>
                    </footer>
                </form>
            </div>
        );
    }
});

export default SetTags;
