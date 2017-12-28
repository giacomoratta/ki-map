/**
 * Example 5
 * kiMap.keyUpdate() usage
 */
'use strict'
console.log("Example 5 > kiMap.keyUpdate() usage \n");

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
console.log("\n");

console.log("Get 'label1' > ",x.get('label1'),"\n");

console.log("Update 'label1' with 'newlabel1' > ",x.keyUpdate('label1','newlabel1'));
x.debug();

console.log("\nUpdate 'label3' with 'label7' (it exitst!) > ",x.keyUpdate('label3','label7'));
x.debug();

console.log("\nUpdate 'label3' with 'label7' (it exitst!) > ",x.keyUpdate('label3','label7',true));
x.debug();
//x.debug({complete:true});
