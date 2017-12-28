/**
 * Example 6
 * kiMap.setMany() and kiMap.merge() usage
 */
'use strict'
console.log("Example 6 > kiMap.setMany() and kiMap.merge() usage \n");

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

let kv_array1 = [
    ['tag20',{oo:'obj20',cc:20}],
    ['tag21',{oo:'obj21',cc:21}],
    ['tag22',{oo:'obj22',cc:22}],
    ['tag23',{oo:'obj23',cc:23}]
];
let kv_array2 = [
    {oo:'obj30',cc:30},
    {oo:'obj31',cc:31},
    {oo:'obj32',cc:32},
    {oo:'obj33',cc:33}
];

x.setMany(kv_array1);
x.debug({label:"setMany with couples array"});

x.setMany(kv_array2);
x.debug({label:"setMany with simple array"});

let y = new kiMap();
y.set('label50',{oo:'obj50',cc:50});
y.set('label51',{oo:'obj51',cc:51});
y.set('label52',{oo:'obj52',cc:52});
y.debug({label:"New kiMap 'map2' "});

y.merge(x);
y.debug({label:"merge map1 on map2"});
