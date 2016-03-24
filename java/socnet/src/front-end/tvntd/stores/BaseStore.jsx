/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import { EventEmitter } from 'events';

export default class BaseStore extends EventEmitter
{
    constructor() {
        super();
    }

    subscribe(actionSubscribe) {
    }

    get dispatchToken() {
        return this.m_dispatchToken;
    }

    emitChange() {
        this.emit('CHANGE');
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb);
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb);
    }
}
