var BTree = require('../').BTree;
var should = require('should');

var log = function(subject) {
    console.log(require('util').inspect(subject, {
        depth: null,
        colors: true
    }));
};

describe('Leaf', function() {

    var leaf;
    beforeEach(function() {
        leaf = new BTree.Leaf('key', 'leaf');
    });

    describe('key', function() {
        it('should be equal to the key given to the leaf constructor', function() {
            leaf.key.should.be.equal('key');
        });
    });

    describe('data', function() {
        it('should be equal to the data given to the leaf constructor', function() {
            leaf.data.should.be.equal('leaf');
        });
    });
});


describe('Node', function() {

    var node;
    beforeEach(function() {
      var fakeBTree = {};
      node = new BTree.Node(fakeBTree, 2);
      fakeBTree.root = node;
    });

    describe('getLeaf', function() {

      it('should return a leaf with a matching key', function() {
        node.insertLeaf(new BTree.Leaf(3, 'three'));
        node.insertLeaf(new BTree.Leaf(1, 'one'));
        node.insertLeaf(new BTree.Leaf(2, 'two'));
        node = node.parent;

        var leaf = node.getLeaf(3);
        leaf.key.should.equal(3);
        leaf.data.should.equal('three');

        leaf = node.getLeaf(2);
        leaf.key.should.equal(2);
        leaf.data.should.equal('two');

        leaf = node.getLeaf(1);
        leaf.key.should.equal(1);
        leaf.data.should.equal('one');
      });

      it('should return undefined if there is no leaf with the given key', function() {
        node.insertLeaf(new BTree.Leaf(3, 'three'));
        node.insertLeaf(new BTree.Leaf(1, 'one'));
        node.insertLeaf(new BTree.Leaf(2, 'two'));
        node = node.parent;

        var leaf = node.getLeaf(5);
        should.not.exist(leaf);
      });

    });

    describe('insertLeaf', function() {

      it('should accept inserted data', function() {
        node.insertLeaf(new BTree.Leaf(1, 'one'));
        node.leafs[0].key.should.equal(1);
        node.leafs[0].data.should.equal('one');
      });

      it('should split after the maximum leaf count is reached', function() {
        node.insertLeaf(new BTree.Leaf(3, 'three'));
        node.insertLeaf(new BTree.Leaf(1, 'one'));
        node.insertLeaf(new BTree.Leaf(2, 'two'));
        node = node.parent;

        node.leafs[0].key.should.equal(2);
        node.leafs[0].data.should.equal('two');

        node.nodes[0].leafs[0].key.should.equal(1);
        node.nodes[0].leafs[0].data.should.equal('one');

        node.nodes[1].leafs[0].key.should.equal(3);
        node.nodes[1].leafs[0].data.should.equal('three');

      });

      it('should insert into sub nodes when possible', function() {
        node.insertLeaf(new BTree.Leaf(1, 'one'));
        node.insertLeaf(new BTree.Leaf(6, 'six'));
        node.insertLeaf(new BTree.Leaf(3, 'three'));
        node = node.parent;
        node.insertLeaf(new BTree.Leaf(4, 'four'));
        node.insertLeaf(new BTree.Leaf(8, 'eight'));
        node.insertLeaf(new BTree.Leaf(5, 'five'));
        node.insertLeaf(new BTree.Leaf(7, 'seven'));
        node.insertLeaf(new BTree.Leaf(9, 'nine'));
        node = node.parent;
        node.insertLeaf(new BTree.Leaf(2, 'two'));
        
        console.log('');
        log(node.parent.root);
        console.log('');

        node.nodes[0].nodes[0].leafs[0].key.should.equal(1);
        node.nodes[0].nodes[0].leafs[0].data.should.equal('one');

        node.nodes[0].nodes[0].leafs[1].key.should.equal(2);
        node.nodes[0].nodes[0].leafs[1].data.should.equal('two');

        node.nodes[0].leafs[0].key.should.equal(3);
        node.nodes[0].leafs[0].data.should.equal('three');

        node.nodes[0].nodes[1].leafs[0].key.should.equal(4);
        node.nodes[0].nodes[1].leafs[0].data.should.equal('four');

        node.nodes[0].nodes[1].leafs[1].key.should.equal(5);
        node.nodes[0].nodes[1].leafs[1].data.should.equal('five');

        node.leafs[0].key.should.equal(6);
        node.leafs[0].data.should.equal('six');

        node.nodes[1].nodes[0].leafs[0].key.should.equal(7);
        node.nodes[1].nodes[0].leafs[0].data.should.equal('seven');

        node.nodes[1].leafs[0].key.should.equal(8);
        node.nodes[1].leafs[0].data.should.equal('eight');

        node.nodes[1].nodes[1].leafs[0].key.should.equal(9);
        node.nodes[1].nodes[1].leafs[0].data.should.equal('nine');
      });
  
      it('should allow overwriting existing data', function() {
        node.insertLeaf(new BTree.Leaf(1, 'one'));
        node.insertLeaf(new BTree.Leaf(2, 'two'));
        node.insertLeaf(new BTree.Leaf(3, 'three'));
        node = node.parent;
        node.insertLeaf(new BTree.Leaf(2, '_two'));

        node.leafs[0].key.should.equal(2);
        node.leafs[0].data.should.equal('_two');
      });

    });
});

describe('BTree', function() {
});
