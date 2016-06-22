/**
 * construct a tree like json mode
 *
 * node {
 *      type: atom || object || array,
 *      childs: [Object || Array],
 *      value: [atom]
 * }
 */
'use strict';

let {
    typeMap, isObject, likeArray, isAtom
} = require('./util');

/**
 * node {
 *      type: atom || object || array,
 *      childs: [object || array],
 *      value: [atom]
 * }
 */

let Node = function (type, value) {
    this.type = type;
    if (this.type === 'atom') {
        this.value = value;
    } else if(this.type === 'array') {
        this.childs = [];
    } else if(this.type === 'object') {
        this.childs = {};
    }
};

// TODO check type
Node.prototype = {
    constructor: Node,

    setChild: function (key, child) {
        child.parent = this;
        this.childs[key] = child;
    },

    getChild: function (key) {
        return this.childs[key];
    }
};

/**
 * get a tree from json
 */
let buildTree = (json) => {
    if (isAtom(json)) {
        return new Node('atom', json);
    } else if (isObject(json)) {
        let type = likeArray(json) ? 'array' : 'object';
        let node = new Node(type);
        typeMap(json, (item, name) => {
            node.setChild(name, buildTree(item));
        });
        return node;
    }
};

let buildJson = (tree) => {
    if (tree.type === 'atom') {
        return tree.value;
    } else {
        return typeMap(tree.childs, buildJson);
    }
};

let pathToKeys = (path) => {
    if(!path) return [];
    return path.split('.');
};

let ExtNode = function (json) {
    this._node = buildTree(json);
};

ExtNode.prototype = {
    constructor: ExtNode,

    get: function (path, def) {
        let node = findNode(this._node, path);
        if (!node) return def;
        return buildJson(node);
    },

    set: function (path, value) {
        let keys = pathToKeys(path);
        if (!keys.length) return null;
        let lastKey = keys.pop();
        let parent = findNodeByKeys(this._node, keys);
        parent.setChild(lastKey, buildTree(value));
        return this;
    }
};

let findNode = (node, path) => {
    let keys = pathToKeys(path);
    while (keys.length) {
        let key = keys.shift();
        node = node.getChild(key);
        if (!node) return null; // fail to find node
    }
    return node;
};

let findNodeByKeys = (node, keys) => {
    while (keys.length) {
        let key = keys.shift();
        node = node.getChild(key);
        if (!node) return null; // fail to find node
    }
    return node;
};

module.exports = (json) => new ExtNode(json);
