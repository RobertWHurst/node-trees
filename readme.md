node-trees
==========

[![NPM version](https://badge.fury.io/js/node-trees.png)](http://badge.fury.io/js/node-trees)

[![Endorse](http://api.coderwall.com/robertwhurst/endorsecount.png)](http://coderwall.com/robertwhurst)
[![Flattr This](http://api.flattr.com/button/flattr-badge-large.png)](http://flattr.com/thing/1270541/RobertWHurstLucidJS-on-GitHub)

node-trees is a library containing tree data structures. It currently only contains quad-tree, but more will be on the way.

Install
-------

Install from NPM in your terminal

    npm install node-trees

Require it

	var QuadTree = require('node-trees').QuadTree;
	var myQuadTree = QuadTree();

Quad tree
---------

Quad trees are great data structures for 2d positional data. When the quad tree is created, it contains a single node. As data is inserted and the contents of the node grow until a threshhold is reached. Once the threshhold is reached, the node splits into four smaller nodes, one for each quadrant of the original node. This process also occurs in the smaller nodes. As more and more data is added, the tree grows deaper and deaper until a node can no longer splitting. Nodes that are ether to small, or to deap are prevented from splitting.

### How to use a quad tree

Quad trees are great for indexing and storing large amounts of 2d spacal elements. To demonstrate how to use then lets start with an example. Lets say we have a map with a handful of locations marked on it. Each location has an `x`, `y`, `width`, and `height`.

Without a quad tree we might store our data in an array.

    var locations = [
        { label: 'Home' id: 0, x: 3455, y: 12711, width: 243, height: 299 },
        { label: 'Work' id: 1, x: -654, y: 2044, width: 600, height: 546 },
        { label: 'The Park' id: 2, x: 31, y: 34127, width: 1091,  height: 3117 }
        ...
    ];
    
Now lets suppose we want to render some of the locations to the screen. In order to retrieve all locations with in the viewable area, we need to loop through each item and make sure its within the viewable area.

	var location, viewableLocations = [];
	for(var i = 0; i < locations.length; i += 1) {
		location = locations[i];
		if(
			location.x >= view.x &&
			location.y >= view.y &&
			location.x + location.width <= view.x + view.width &&
			location.y + location.height <= view.y + view.height
		) {
			viewableLocations.push(location);
		}
	}

This is fine when there are only a few locations, but as the number of locations on the map increase the above code becomes less and less efficent. Eventually this loop will become a marjor preformance problem.

The solution is a quad tree instead of an array. Each location gets inserted into the tree
using its location as a key.

	var locations = new QuadTree();
	locations.insert({ x: 3455, y: 12711, width: 243, height: 299 }, { label: 'Home' id: 0 });
	locations.insert({ x: -654, y: 2044, width: 600, height: 546 }, { label: 'Work' id: 1 });		locations.insert({ x: 31, y: 34127, width: 1091, height: 3117 }, { label: 'The Park' id: 2 });
	...

We can get all the locations within the view by asking the locations quad tree for all locations within the view rectangle.

	var visibleLocations = locations.get({ x: view.x, y: view.y, width: view.width, height: view.height });
	
Unlike with the array, the quad tree does not slow to a crawl when large amounts of data are inserted. Instead the quad tree only loops over the locations within the view area. I does not require a checking every location.


Docs
------

### QuadTree

	new QuadTree(
		[number size = 8192]
		[, number maxLeafs = 32]
		[, number maxDepth = 8]
		[, number x = size / 2]
		[, number y = size / 2]
	) => QuadTree quadTree
	
Creates a new QuadTree instance.

| Argument Name | Description |
|-|-|
| size | The inital height and width of the QuadTree instance. Should be larger than the height/width of the area most items in the tree occupy. May help reduce tree growth. |
| maxLeaf | The maximum number of leafs allowed within a node. Once exeeded the containing node splits into four, and the leafs are distributed into each. |
| maxDepth | The maximum depth of the tree. Once a node reaches the `maxDepth` it can no longer split. Instead it will continue to grow as more leafs are inserted into it. |
| x | The `x` offset of the tree. If most of your items occupy a specific area setting the `x` may help reduce tree growth. |
| y | The `y` offset of the tree. If most of your items occupy a specific area setting the `y` may help reduce tree growth. |

#### insert

	insert(Rect rect, [, * data = undefined])
	
Adds a rectangle, and optionally associated data, to a QuadTree instance. Takes a Rect instance (or and object with `x`, `y`, `width`, `height` properties) as a key, and any data to link the retangle position to.

| Argument Name | Description |
|-|-|
| rect | A retangle; Rect instance or an object containing an `x`, `y`, `width`, `height`. This will be the location of the rectangle within the tree. |
| data | Data to associate with the rectangle. Can litterally be anything you want. |

### get

	get(Rect rect, [* data]) => Array results
	
Retrieves all rectanges and their associated data within a given rectanage. If a second argument is given, only rectanges this data that matches the second argument will be returned, allowing one to check the location of a rectangle.

| Argument Name | Description |
|-|-|
| rect | A Rect instance or an object containing an `x`, `y`, `width`, `height`. This will be the location in the tree that will be searched for rectangles. |
| data | only results with this data will be returned as results. This allows you to check the location of a rectange associated with a specific piece of data. |

### remove

	remove(Rect rect, [* data]) => Array results

Exactly like `get` but the data returned as results is removed from the tree.

| Argument Name | Description |
|-|-|
| rect | A Rect instance or an object containing an `x`, `y`, `width`, `height`. This will be the location in the tree that will be searched for rectangles. |
| data | only results with this data will be returned as results. This allows you to check the location of a rectange associated with a specific piece of data. |

### truncate

	truncate()
	
Truncate deletes all data in the tree.

Credits
-------

I made this library to improve the preformance of a game engine I'm working on for Unicode Games. I'd like to share it with fellow devs. Feel free to fork this project and make your own changes.
