# kiMap

[![NPM](https://nodei.co/npm/ki-map.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ki-map/)

Pure javascript object that simulates the native 'Map' object with indexing features and others useful methods.


## Documentation

### Install
```
npm install --save kiMap
```

### Methods and properties
* [setLogger(obj)](#setloggerobj)
* [debug(options)](#debugoptions)
* [size](#size)
* [clear()](#clear)
* [delete(ki)](#deleteki)
* [entries()](#entries)
* [forEach(callback, thisArg)](#foreachcallback-thisarg)
* [get(ki)](#getki)
* [has(ki)](#haski)
* [keys()](#keys)
* [set(ki, value, options)](#setki-value-options)
* [values()](#values)
* [indexOf(key)](#indexofkey)
* [keyOf(index)](#keyofindex)
* [keyUpdate(old_key, new_key, force)](#keyupdateold_key-new_key-force)
* [setMany(kv_array)](#setmanykv_array)
* [merge(map)](#mergemap)
* [swap(ki_A,ki_B)](#swapki_aki_b)
* [move(ki, pos)](#moveki-pos)

#### Create the kiMap object
```javascript
let kiMap = require('ki-map');
let map = new kiMap();
```

#### setLogger(obj)
Set the logger object. By default is the native console object.
* {object|null} **obj** - (optional, default:console) a console-like object
```javascript
map.setLogger(mylogger);
map.setLogger(null); //To disable internal logging just pass a null object.
```

#### debug(options)
Show the internal data-structures and makes some simple checks.
* {object} **options** - (optional, default:null) set the debug output
```javascript
map.debug({
    label:'',           // for a labeled debug output
    complete:false      // print all the internal structures
});
```

#### size
Current size of the collection.
* returns {integer} - values:[0,+inf)
```javascript
let length = map.size;
```

#### clear()
Empty all internal structures and reset the counters. After this, the kiMap is totally cleaned.
```javascript
map.clear();
```

#### delete(ki)
Removes the specified element from the collection.
* param {number|string} ki - key or index
* returns {integer} index of the deleted item or a number<0
```javascript
map.delete(3);
map.delete('label6');
if(map.delete(4)<0) console.warn('No object found!');
```

#### entries()
All the elements stored within the collection.
* returns {iterator}
```javascript
let it1 = map.entries();
let d1 = it1.next();
while(!d1.done){
    console.log('index:',d1.value.i);
    console.log('key:',d1.value.k);
    console.log('data:',d1.value.d);
    d1 = it1.next();
}
```

#### forEach(callback, thisArg)
Executes a provided function once per each key/value pair in the Map object, in insertion order.
* param  {function} callback - Function to execute for each element; prototype: callback(index,key,value,kiMap)
* param  {object}  thisArg - Value to use as this when executing callback.
```javascript
// Simple forEach
x.forEach(function(i,k,d,map){
    console.log('index:',i);
    console.log('key:',k);
    console.log('data:',d);
});

// Usage of thisArg
class exampleClass{
    fn(){
        map.forEach(function(i,k,d,this_map){
            this.show(i,k,d,this_map);
        },this);
    }
    show(i,k,d,this_map){
        console.log('index:',i);
        console.log('key:',k);
        console.log('data:',d);
    }
}
let myObj = new exampleClass();
myObj.fn();
```

#### get(ki)
Get an element from the collection.
* param {integer|string} ki - key or index
* returns {mixed|null} null if data not found
```javascript
map.get(1);
map.get('label');
```

#### has(ki)
Returns a boolean indicating whether an element with the specified key exists or not.
* param {integer|string} ki - key or index
* returns {boolean}
```javascript
map.has(1);
map.has('label');
```

#### keys()
All the keys within the collection.
* returns {array}
```javascript
map.keys(); //returns ['label1','label2','label3']
```

#### set(ki, value, options)
Adds or updates an element with a specified index and/or key and value.
* param {integer|string} ki - key or index
* param {any} value
* param {object} options - 'key' used when ki is an index, ...
* returns {number} index of the new element
```javascript
// Insertion with label
x.set('label1',{oo:'obj1',cc:1}); // 1

// Simple insertion (the label will be 'autokey_1')
x.set({oo:'obj2',cc:2});  // 2

// Insertion in the specified position 3
x.set(3,{oo:'obj3',cc:3});  // 3

// Insertion in the specified position 3 with label 'mykey44'
x.set(4,{oo:'obj44',cc:44},{
    key:'mykey44'
})); // 4
```

#### values()
Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
* returns {iterator}
```javascript
let it1 = map.entries();
let d1 = it1.next();
while(!d1.done){
    console.log('data:',d1.value);
    d1 = it1.next();
}
```

#### indexOf(key)
Returns the index of the element stored with the specified key.
* param {string} key
* returns {number} - a value lower than zero indicates that the element was not found
```javascript
map.indexOf('label3');
```

#### keyOf(index)
Returns the key of the element stored within the specified index.
* param index
* returns {string|null} - null indicates that the element was not found
```javascript
map.keyOf(3);
```

#### keyUpdate(old_key, new_key, force)
Update the key of an item. If an item with new_key already exists, this method does nothing. To force the update and the overwrite, set force=true.
* param  {string} old_key
* param  {string} new_key
* param  {boolean} force (optional, default:false)
* return {integer} position of the updated element
```javascript
map.keyUpdate('label1', 'newlabel1'); // 1
map.keyUpdate('label3', 'label1'); // -1 - no update
map.keyUpdate('label3', 'label1', true); // 3 - the element 1 will have 'autokey_4'
```

#### setMany(kv_array)
Insert a bunch of values from an array.
In case of key collisions, the key of the new element will be changed with an 'autokey_xx'.
* param {Array} kv_array - simple array or array with couples [key,value]
* returns {boolean} true if the insertion is done
```javascript
map.setMany([
    ['tag20',{oo:'obj20',cc:20}],
    ['tag21',{oo:'obj21',cc:21}]
]);
map.setMany([
    {oo:'obj30',cc:30},
    {oo:'obj31',cc:31}
]);
```

#### merge(map)
Extends the current map with the values inside the 'map' argument.
In case of key collisions, the key of the new element will be changed with an 'autokey_xx'.
* param {kiMap} map
* returns {boolean} true if the insertion is done
```javascript
map1.merge(map2);
```

#### swap(ki_A,ki_B)
Swap two items.
* param  {string|integer} ki_A - key or index
* param  {string|integer} ki_B - key or index
* return {boolean}
```javascript
map.swap('label1','label2');
map.swap('label1',1);
map.swap(0,'label2');
map.swap(0,1);
```

#### move(ki, pos)
Move the item with ki to the specified position
* param {string|number} ki - key or index
* param {integer} pos - final position
* returns {integer}
```javascript
map.move('label1',4);
map.move(0,4);
```


## Examples
The directory '/examples' has some useful examples ready to be executed as node scripts.
```
node ./examples/e1.js
```
* **[e1.js](./examples/e1.js)** - Example 1 > Fill, move and swap
* **[e2.js](./examples/e2.js)** - Example 2 > Iterators usage
* **[e3.js](./examples/e3.js)** - Example 3 > kiMap.forEach() usage
* **[e4.js](./examples/e4.js)** - Example 4 > Mixed basic functions: size, get, keyOf, indexOf, has, keys, clear
* **[e5.js](./examples/e5.js)** - Example 5 > kiMap.keyUpdate() usage
* **[e6.js](./examples/e6.js)** - Example 6 > kiMap.setMany() and kiMap.merge() usage


## Bugs or requests
I am still working on this project. So, please, report me any kind of bug or requests about new features.
You can do it on [GitHub Issues](https://github.com/giacomoratta/round-logger/issues) or via email.
I will try to solve each issues in a reasonable time.
