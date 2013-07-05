var Rect = require('../').Rect;
var should = require('should');


describe('Rect', function() {

  var rect;
  beforeEach(function() {
    rect = new Rect();
  });

  describe('x', function() {
    it('should be 0 by default', function() {
      rect.x.should.equal(0);
    });
    it('should be equal to the first argument of the constructor', function() {
      (new Rect(50)).x.should.equal(50);
    });
  });

  describe('y', function() {
    it('should be 0 by default', function() {
      rect.y.should.equal(0);
    });
    it('should be equal to the second argument of the constructor', function() {
      (new Rect(null, 50)).y.should.equal(50);
    });
  });

  describe('width', function() {
    it('should be 0 by default', function() {
      rect.width.should.equal(0);
    });
    it('should be equal to the third argument of the constructor', function() {
      (new Rect(null, null, 50)).width.should.equal(50);
    });
  });

  describe('height', function() {
    it('should be 0 by default', function() {
      rect.height.should.equal(0);
    });
    it('should be equal to the fourth argument of the constructor', function() {
      (new Rect(null, null, null, 50)).height.should.equal(50);
    });
  });

  describe('merge', function() {
    it('should return a new rectangle that contains both the instance rect and a given rect', function() {
      var rect1 = new Rect(-10, 20, 50, 20);
      var rect2 = new Rect(-20, 400, 35, 60);

      rect = rect1.merge(rect2);

      rect.x.should.equal(-20);
      rect.y.should.equal(20);
      rect.width.should.equal(60);
      rect.height.should.equal(440);
    });
  });

  describe('split', function() {
    it('should split the instance rect into four smaller rects', function() {
      rect = new Rect(0, 0, 100, 100);
      var rects = rect.split();
      rects[0].x.should.equal(0);
      rects[0].y.should.equal(0);
      rects[0].width.should.equal(50);
      rects[0].height.should.equal(50);

      rects[1].x.should.equal(50);
      rects[1].y.should.equal(0);
      rects[1].width.should.equal(50);
      rects[1].height.should.equal(50);

      rects[2].x.should.equal(0);
      rects[2].y.should.equal(50);
      rects[2].width.should.equal(50);
      rects[2].height.should.equal(50);

      rects[3].x.should.equal(50);
      rects[3].y.should.equal(50);
      rects[3].width.should.equal(50);
      rects[3].height.should.equal(50);
    });
  });

  describe('clip', function() {
    it('should return an array of rects that cover the area of the rect instances execpt for the area of a given rect', function() {
      rect = new Rect(0, 0, 100, 100);

      var tl = rect.clip(new Rect(0, 0, 50, 50));
      tl[0].x.should.equal(50);
      tl[0].y.should.equal(0);
      tl[0].width.should.equal(50);
      tl[0].height.should.equal(50);
      tl[1].x.should.equal(0);
      tl[1].y.should.equal(50);
      tl[1].width.should.equal(100);
      tl[1].height.should.equal(50);
      should.not.exist(tl[2]);
      should.not.exist(tl[3]);

      var tr = rect.clip(new Rect(50, 0, 50, 50));
      tr[0].x.should.equal(0);
      tr[0].y.should.equal(0);
      tr[0].width.should.equal(50);
      tr[0].height.should.equal(50);
      tr[1].x.should.equal(0);
      tr[1].y.should.equal(50);
      tr[1].width.should.equal(100);
      tr[1].height.should.equal(50);
      should.not.exist(tr[2]);
      should.not.exist(tr[3]);

      var bl = rect.clip(new Rect(0, 50, 50, 50));
      bl[0].x.should.equal(0);
      bl[0].y.should.equal(0);
      bl[0].width.should.equal(100);
      bl[0].height.should.equal(50);
      bl[1].x.should.equal(50);
      bl[1].y.should.equal(50);
      bl[1].width.should.equal(50);
      bl[1].height.should.equal(50);
      should.not.exist(bl[2]);
      should.not.exist(bl[3]);

      var br = rect.clip(new Rect(50, 50, 50, 50));
      br[0].x.should.equal(0);
      br[0].y.should.equal(0);
      br[0].width.should.equal(100);
      br[0].height.should.equal(50);
      br[1].x.should.equal(0);
      br[1].y.should.equal(50);
      br[1].width.should.equal(50);
      br[1].height.should.equal(50);
      should.not.exist(br[2]);
      should.not.exist(br[3]);

      var m = rect.clip(new Rect(25, 25, 50, 50));
      m[0].x.should.equal(0);
      m[0].y.should.equal(0);
      m[0].width.should.equal(100);
      m[0].height.should.equal(25);
      m[1].x.should.equal(0);
      m[1].y.should.equal(25);
      m[1].width.should.equal(25);
      m[1].height.should.equal(50);
      m[2].x.should.equal(75);
      m[2].y.should.equal(25);
      m[2].width.should.equal(25);
      m[2].height.should.equal(50);
      m[3].x.should.equal(0);
      m[3].y.should.equal(75);
      m[3].width.should.equal(100);
      m[3].height.should.equal(25);
    });
  });
  
  describe('trim', function() {
    it('should return a rect equal to the overlapping area of the instance rect and a given rect', function() {
      rect = new Rect(0, 0, 100, 100);

      var o = rect.trim(new Rect(25, 25, 100, 100));
      o.x.should.equal(25);
      o.y.should.equal(25);
      o.width.should.equal(75);
      o.height.should.equal(75);
    });
  });

  describe('contains', function() {
    it('should return true if a given rect is contained by the instance rect', function() {
      rect = new Rect(0, 0, 100, 100);
      rect.contains(new Rect(0, 0, 100, 100)).should.be.true;
    });
    it('should return false if a given rect is not contained by the instance rect', function() {
      rect = new Rect(100, 100, 100, 100);
      rect.contains(new Rect(0, 0, 100, 100)).should.be.false;
    });
  });

  describe('overlaps', function() {
    it('should return true if a given rect is overlapped by the instance rect', function() {
      rect = new Rect(50, 50, 100, 100);
      rect.overlaps(new Rect(0, 0, 100, 100)).should.be.true;
    });
    it('should return false if a given rect is not overlapped by the instance rect', function() {
      rect = new Rect(100, 100, 100, 100);
      rect.overlaps(new Rect(0, 0, 100, 100)).should.be.false;
    });
  });
});
