/**
 * Example 4
 * Mixed basic functions: size, get, keyOf, indexOf, has, keys, clear
 */
'use strict'
console.log("Example 4 > Mixed basic functions: size, get, keyOf, indexOf, has, keys, clear \n");

let kiMap = require('../index.js');

let x = new kiMap();

x.set('label1',{oo:'obj1',cc:1});
x.set({oo:'obj2',cc:2});
x.set('label3',{oo:'obj3',cc:3});
x.set(0,{oo:'obj0',cc:0});
x.set('label5',{oo:'obj5',cc:5});
x.set('label7',{oo:'obj7',cc:7});
x.set(6,{oo:'obj6',cc:6});
x.debug();

console.log("Size > ",x.size);
console.log("\n");

console.log("Get 'label1' > ",x.get('label1'));
console.log("Get position 3 > ",x.get(3));
console.log("\n");

console.log("Get key of position 4 > ",x.keyOf(4));
console.log("Get position of key 'label7' > ",x.indexOf('label7'));
console.log("\n");

console.log("Has position 4 ? > ",x.has(4));
console.log("Has key 'label7' ? > ",x.has('label7'));
console.log("Has position 9 ? > ",x.has(9));
console.log("Has key 'label000' ? > ",x.has('label000'));
console.log("\n");

console.log("Map keys > ",x.keys());
console.log("\n");

console.log("Clearing map..."); x.clear();
console.log("Size > ",x.size);
x.debug({complete:true});
