/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import Reflux            from 'reflux';

import Actions           from 'vntd-root/actions/Actions.jsx';
import BaseStore         from 'vntd-root/stores/BaseStore.jsx';

class EtherStoreClz extends Reflux.Store
{
    constructor() {
        super();
        this.state = new BaseStore();
        this.listenToMany(Actions);
        console.log("Ether store listen actions");
    }

    onEtherStartupCompleted(data) {
        console.log("Ether startup is called");
        console.log(data);
    }

    onEtherStartupFailed(error) {
        console.log("Ether startup failed...");
        console.log(error);
    }

    dumpData(hdr) {
        console.log(hdr);
    }
}

var EtherStore = Reflux.initStore(EtherStoreClz);

export default EtherStore;
