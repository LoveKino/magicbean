'use strict';

let jsonTree = require('../src/jsonTree'),
    assert = require('assert');

describe('jsonTree', () => {
    it('base', () => {
        let t = jsonTree({
            a: 10
        });
        let ret = t.get('a');
        assert.equal(ret, 10);
    });

    it('get path', () => {
        let t = jsonTree({
            a: {
                b: 20
            },
            c: 1
        });
        let ret = t.get('a.b');
        assert.equal(ret, 20);

        let ret2 = t.get('a');
        assert.deepEqual(ret2, {
            b: 20
        });

        assert.deepEqual(t.get(), {
            a: {
                b: 20
            },
            c: 1
        });
    });

    it('set path', () => {
        let t = jsonTree({
            a: 10
        });
        t.set('b', {
            c: 10,
            d: {
                e: 3
            }
        });
        assert.equal(t.get('b.c'), 10);
        assert.deepEqual(t.get('b.d'), {
            e: 3
        });
    });
});
