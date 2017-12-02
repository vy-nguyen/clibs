/**
 * Written by Vy Nguyen (2017)
 * Test code with React 14
 */
import Enzyme           from 'enzyme';
import EnzymeAdapter    from 'enzyme-adapter-react-14';

// Setup enzyme's react adapter
Enzyme.configure({
    adapter: new EnzymeAdapter()
});

