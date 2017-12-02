/**
 * Written by Vy Nguyen (2017)
 * Test with React 14
 */
import React              from 'react/addons';
import { expect }         from 'chai';
import { mount, shallow } from 'enzyme';
import { describe, it, before }   from 'mocha';

import setup              from '../common/setup.js';
import PostQuestionare    from '../../tvntd/pages/user/PostQuestionare.jsx';

describe('<PostQuestionare/>', function () {

    before('Render and locate input element', function() {
        let testUtils = React.addons.TestUtils;

        global.testMode = true;
        let comp = testUtils.renderIntoDocument(
            <PostQuestionare/>
        );
        /*
        let inputComp = testUtils.findRenderedDOMComponentWithTag(
            comp, 'input'
        );
        this.inputElm = inputComp.getDOMNode();
         */
    });

    it('Something abc...', function () {
        let obj = <PostQuestionare/>;
        let wrapper = shallow(obj);
        console.log(wrapper.debug());

        wrapper = mount(obj);
        // console.log(this.inputElm);
        console.log(wrapper.render());
    });

    it('Other tests...', function () {
        const wrapper = shallow(<PostQuestionare/>);
        console.log(wrapper);
    });
});
