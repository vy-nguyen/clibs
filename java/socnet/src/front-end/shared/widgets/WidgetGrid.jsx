/**
 * Ported to Class by Vy Nguyen (2017)
 */
import React    from 'react-mod';
import ReactDOM from 'react-dom';

import jarvisWidgetsDefaults from './WidgetDefaults.jsx';

class WidgetGrid extends React.Component
{
    constructor(props) {
        super(props);
        this.element = null;
    }

    componentDidMount() {
        if (this.element == null) {
            this.element = $(ReactDOM.findDOMNode(this));
        }
        this.element.jarvisWidgets(jarvisWidgetsDefaults);
    }

    render() {
        return (
            <section id="widget-grid">
                {this.props.children}
            </section>
        )
    }
}

export default WidgetGrid;
