

function Leaf(key, data) {
    this.key = key;
    this.data = data;
}


function Node(parent, size) {
    this.leafs = [];
    this.nodes = [];
    this.parent = parent;
    this.size = size;
}

Node.prototype.getLeaf = function(key) {

    var ctLeaf, ltNode, rtNode, result;
    for(var i = 0; i < this.size; i += 1) {

        ctLeaf = this.leafs[i];
        ltNode = this.nodes[i];
        rtNode = this.nodes[i + 1];

        // if a leaf exists in the current slot
        if(ctLeaf) {

            // if a direct key match return the
            // leaf
            if(ctLeaf.key == key) {
                return ctLeaf;
            }

            // if the key is lesser and a left
            // sub node exists
            else if(ctLeaf.key > key && ltNode) {
                result = ltNode.getLeaf(key);
                if(result) { return result; }
            }

            // if the key is greater and a right
            // sub node exists
            else if(ctLeaf.key < key && rtNode) {
                result = rtNode.getLeaf(key);
                if(result) { return result; }
            }
        }

        // return an empty result
        return;
    }
}

Node.prototype.insertLeaf = function(leaf, upTree) {

    // loop through all slots within the node
    var ctLeaf, ntLeaf, ltNode, rtNode;
    for(var i = 0; i < this.size + 1; i += 1) {

        ctLeaf = this.leafs[i];
        ntLeaf = this.leafs[i + 1];
        ltNode = this.nodes[i];
        rtNode = this.nodes[i + 1];

        // if there is a key
        if(ctLeaf) {

            // if the keys match
            if(ctLeaf.key == leaf.key) {
                // replace the data
                ctLeaf.data = leaf.data;
                break;
            }

            // if the key is greater and a node
            // exists to the right but there
            // is no leaf to following the current
            else if(ctLeaf.key < leaf.key && !ntLeaf && rtNode && !upTree) {
                // insert into the right node
                rtNode.insertLeaf(leaf);
                break;
            }

            // if the key is lesser
            else if(ctLeaf.key > leaf.key) {

                // if a left node exists to the 
                // right
                if(ltNode && !upTree) {
                    // insert into the left node
                    ltNode.insertLeaf(leaf);
                    break;
                }

                // if there isn't a left node
                else {
                    // insert before the current
                    // leaf
                    this.leafs.splice(i, 0, leaf);
                    break;
                }
            }
        }
        
        // if the slot is empty
        else {

            // insert the leaf
            this.leafs[i] = leaf;
            break;
        }
    }

    // if the leaf overflows
    if(this.leafs.length > this.size) {
        this._split();
    }

};

Node.prototype.removeLeaf = function(key) {
    
    var ctLeaf, ltNode, rtNode, result;
    for(var i = 0; i < this.size; i += 1) {

        ctLeaf = this.leafs[i];
        ltNode = this.nodes[i];
        rtNode = this.nodes[i + 1];

        // if a leaf exists in the current slot
        if(ctLeaf) {

            // if a direct key match return the
            // leaf
            if(ctLeaf.key == key) {

                

                return ctLeaf;
            }

            // if the key is lesser and a left
            // sub node exists
            else if(ctLeaf.key > key && ltNode) {
                result = ltNode.getLeaf(key);
                if(result) { return result; }
            }

            // if the key is greater and a right
            // sub node exists
            else if(ctLeaf.key < key && rtNode) {
                result = rtNode.getLeaf(key);
                if(result) { return result; }
            }
        }

        // return an empty result
        return;
    }

};

Node.prototype._split = function() {

    // seperate the middle and right leafs
    var groupSize = Math.floor(this.size / 2);
    var middleLeaf = this.leafs.splice(groupSize, 1)[0];
    var rightLeafs = this.leafs.splice(groupSize);

    // collect the right nodes
    var rightNodes = this.nodes.splice(groupSize + 1);

    // if this is the root node
    var qTree;
    if(this.parent.root) {
        qTree = this.parent;
        this.parent = new Node(qTree, this.size);
        this.parent.nodes.push(this);
        qTree.root = this.parent;
    }

    // insert the middle leaf into the parent node
    this.parent.insertLeaf(middleLeaf, true);


    // create the right node
    var rightNode = new Node(this.parent, this.size);
    this.parent.nodes.push(rightNode);
    while(rightLeafs[0]) { rightNode.insertLeaf(rightLeafs.shift(), true); }
    var subNode;
    while(rightNodes[0]) { 
        var subNode = rightNodes.shift();
        subNode.parent = rightNode;
        rightNode.nodes.push(subNode);
    }
};


function BTree(nodeSize) {

    nodeSize = nodeSize || 2;

    if(typeof nodeSize != 'number' || nodeSize < 1) { throw new Error('nodeSize must be a number greater than zero'); }
    if(typeof maxDepth != 'number' || maxDepth < 1) { throw new Error('maxDepth must be greater than zero'); }

    this.root = new Node(this, size);
}

BTree.Node = Node;
BTree.Leaf = Leaf;

BTree.prototype.insert = function(key, data) {
    var leaf = new Leaf(key, data);
    this.root.insertLeaf(leaf);
};

BTree.prototype.get = function(key) {
    var leaf = this.root.getLeaf(key);
    return leaf.data;
};

BTree.prototype.remove = function(key) {
    var leaf = this.root.removeLeaf(key);
    return leaf;
};

BTree.prototype.truncate = function() {

    // replace the entire root node; deleting all
    // data within the previous root node and its
    // tree or sub nodes.
    this.root = new Node(this, this.root.size);

};

module.exports = BTree;
