import Reflux from 'reflux'
import AjaxActions from '../actions/AjaxActions.jsx'

const AjaxStore = Reflux.createStore({
    listenables: [AjaxActions],
    onContentLoaded: function(xhr){
        this.trigger();
    }
});


export default AjaxStore
