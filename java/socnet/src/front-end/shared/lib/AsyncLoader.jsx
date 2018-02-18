/**
 * Code modified from 'https://maps.googleapis.com/maps/api/js'
 */
'use strict';

import React from 'react-mod';

import GoogleApi   from 'vntd-shared/lib/GoogleApi';
import ScriptCache from 'vntd-shared/lib/ScriptCache';

export function asyncImport(importComponent) {
    class AsyncComponent extends React.Component
    {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        componentDidMount() {
            const { default: component } = importComponent();

            this.setState({
                component: component
            });
        }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }
    }
    return AsyncComponent;
}

export function asyncLoader(key, script) {
    return function(Component) {
        class WrapComponent extends React.Component
        {
            constructor(props, context) {
                super(props, context);

                this.scriptCache = ScriptCache({
                    [key]: script
                });
                this.scriptCache[key].onLoad(this._onLoad.bind(this));
                this.state = {
                    loaded: false
                };
                this.state[key] = null;
            }

            _onLoad(err, tag) {
                let state = {
                    loaded: true
                };
                state[key] = window[key];
                this.setState(state);
            }

            render() {
                let props;

                if (this.state.loaded === false) {
                    return null;
                }
                props = Object.assign({}, this.props, this.state);
                return (
                    <Component {...props}/>
                );
            }
        }
        return WrapComponent;
    };
}

export const GoogleApiLoad = function(options) {
    options           = options || {};
    options.language  = options.language || 'en';
    options.libraries = options.libraries || ['places'];
    options.version   = options.version || '3.28';

    return asyncLoader("google", GoogleApi(options));
}

export default asyncLoader;
