'use strict';

let id = v => v;

let typeMap = (v, handle) => {
    handle = handle || id;
    if (likeArray(v)) {
        let rets = [];
        for (let i = 0; i < v.length; i++) {
            rets.push(handle(v[i], i, v));
        }
        return rets;
    } else if (isObject(v)) {
        let retm = {};
        for (let name in v) {
            retm[name] = handle(v[name], name, v);
        }
        return retm;
    }
};

let isAtom = v => !v || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

let likeArray = v => !!v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0;

let isObject = v => !!v && typeof v === 'object';

module.exports = {
    isObject,
    isAtom,
    likeArray,
    typeMap
};
