/**
 * Example 2
 * Iterators usage
 */

'use strict'
console.log("Example 2 > Iterators usage\n");

let kiMap = require('../index.js');

let x = new kiMap();

x.set('label1',{oo:'obj1',cc:1});
x.set({oo:'obj2',cc:2});
x.set('label3',{oo:'obj3',cc:3});
x.set(0,{oo:'obj0',cc:0});
x.set('label5',{oo:'obj5',cc:5});
x.set('label7',{oo:'obj7',cc:7});
x.set(6,{oo:'obj6',cc:6});

x.debug({ complete:true });
console.log("\n");

console.log("kiMap.entries()");
let it1 = x.entries();
let d1 = it1.next();
while(!d1.done){
    console.log(d1.value);
    d1 = it1.next();
}
console.log("\n");

console.log("kiMap.values()");
let it2 = x.values();
let d2 = it2.next();
while(!d2.done){
    console.log(d2.value);
    d2 = it2.next();
}
console.log("\n");
