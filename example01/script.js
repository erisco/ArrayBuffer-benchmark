"use strict";

// The benchmark uses crude CPU time measurement but the difference between
// these two methods is obvious and substantial.

/*
 * Calculate the sum of a sequence of 3D vectors.
 */

var numVectors = 1000000;
var x = 0.4;
var y = 3.1;
var z = -8.4;

/*
 * Method #1
 * Using common JavaScript practice.
 */

function Vector3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

function method1(vectors) {
  var out = new Vector3(0, 0, 0);
  for (var i in vectors) {
    var vector = vectors[i];
    out.x += vector.x;
    out.y += vector.y;
    out.z += vector.z;
  }
  return out;
}

function runMethod1() {
  var beforeAllocate = new Date();
  var vectors = [];
  for (var i = 0; i < numVectors; ++i) {
    vectors[i] = new Vector3(x, y, z);
  }
  var beforeCompute = new Date();
  console.log(method1(vectors));
  var afterCompute = new Date();
  console.log(beforeCompute - beforeAllocate);
  console.log(afterCompute - beforeCompute);
}


/*
 * Method #2
 * Using ArrayBuffer with AOS format
 */

function method2(floats, out) {
  for (var i = 0; i < numVectors; ++i) {
    var i3 = i * 3;
    out[0] += floats[i3];
    out[1] += floats[i3 + 1];
    out[2] += floats[i3 + 2];
  }
}

function runMethod2() {
  var beforeAllocate = new Date();
  var buffer = new ArrayBuffer((numVectors + 1) * 3 * 8);
  var floats = new Float64Array(buffer);
  var out = new Float64Array(buffer, numVectors * 3 * 8, 3);
  for (var i = 0; i < numVectors; ++i) {
    var i3 = i * 3;
    floats[i3] = x;
    floats[i3 + 1] = y;
    floats[i3 + 2] = z;
  }
  var beforeCompute = new Date();
  method2(floats, out);
  console.log([out[0], out[1], out[2]]);
  var afterCompute = new Date();
  console.log(beforeCompute - beforeAllocate);
  console.log(afterCompute - beforeCompute);
}
