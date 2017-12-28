/**
 * Example 3
 * kiMap.forEach() usage
 */

'use strict'
console.log("Example 3 > kiMap.forEach() usage\n");

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

console.log("kiMap.forEach(callback)");
x.forEach(function(i,k,d,map){
    console.log(i,k,d);
    //console.log(i,k,d,map);
});
console.log("\n");

console.log("kiMap.forEach(callback,this)");
class exampleClass{
    fn(){
        x.forEach(function(i,k,d,map){
            this.show(i,k,d,map);
        },this);
    }
    show(i,k,d,map){
        console.log(i,k,d);
        //console.log(i,k,d,map);
    }
}
let myObj = new exampleClass();
myObj.fn();
console.log("\n");
