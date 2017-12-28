/**
 * Example 1
 * Fill, move and swap
 */
'use strict'
console.log("Example 1 > Fill, move and swap\n");

let kiMap = require('../index.js');

let x = new kiMap();

x.set('label1',{oo:'obj1',cc:1}); x.debug();
x.set({oo:'obj2',cc:2}); x.debug();
x.set('label3',{oo:'obj3',cc:3}); x.debug();
x.set(0,{oo:'obj0',cc:0}); x.debug();
x.set('label5',{oo:'obj5',cc:5}); x.debug();
x.set('label7',{oo:'obj7',cc:7}); x.debug();
x.set(6,{oo:'obj6',cc:6}); x.debug();
x.swap(3,5); x.debug({ label:'swap1' });
x.swap('label1','label7'); x.debug({ label:'swap2' });
x.move('label1',0); x.debug({ label:'move1' });

console.log("\nInsert element in position 5 with key 'mykey55' > ",x.set(5,{oo:'obj55',cc:55},{key:'mykey55'}));
x.debug(); console.log("\n");


console.log("\nDelete 'label1' > ",x.delete('label1'));
x.debug();
console.log("\nDelete position 4 > ",x.delete(4));
x.debug();
console.log("\n");


console.log("\nGet 'label1'",x.get('label1'));
console.log("\nGet position 3",x.get(3));

x.debug({ complete:true });
