/**
 * Written by Vy Nguyen (2017)
 * Test with React 14
 */
import React              from 'react';
import { expect }         from 'chai';
import { describe, it }   from 'mocha';
import { mount, shallow } from 'enzyme';

import setup              from '../common/setup.js';
import PostQuestionare    from '../../tvntd/pages/user/PostQuestionare.jsx';

describe('<PostQuestionare/>', function () {

    it('Something abc...', function () {
        let obj = <PostQuestionare/>;
        let wrapper = shallow(obj);
        console.log(wrapper.debug());

        //wrapper = mount(obj);
        console.log(wrapper.render());
    });

    it('Other tests...', function () {
        const wrapper = shallow(<PostQuestionare/>);
        console.log(wrapper);
    });
});
