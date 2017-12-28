/**
 * Created by Giacomo Ratta on 11/07/2017.
 * Refactored on 30/12/2017
 *
 * Map() > https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 *
 */
'use strict'


/**
 * Small set of utility functions.
 */
class uu{
    static isNil(v){
        return (v==null || v==undefined);
    }

    static isString(v){
        return (typeof v == 'string' || v instanceof String);
    }

    static isInteger(v){
        return (typeof v == 'number' && Number.isInteger(v)) || (v instanceof Number && Number.isInteger(v.valueOf()));
    }

    static isArray(v){
        return Array.isArray(v);
    }

    static isObject(v){
        return ( null != v &&
                 (typeof v === 'object' || typeof v === 'function') &&
                 /^\[object /.test(Object.prototype.toString.call(v))
               );
    }

    static isFunction(v){
        return ( null != v && ( v instanceof Function ||
                 typeof v === "function" ||
                 Object.prototype.toString.call(x) == '[object Function]'
               ));
    }
}



class kiMap{

    constructor(){

        /**
         * Relationship 'key-value'. Array with couples [key,value].
         * This is the main structure and keep the order between elements.
         * @type {array{ array{ string,mixed } }}
         */
        this._kv;

        /**
         * Relationship 'key-index'. Simple json-object {k1:v1, k2:v2, ...}
         * Needed to find an element based on its key.
         * @type {object}
         */
        this._ki;

        /**
         * Maximum index reached by this._kv
         * Needed for auto-key mechanism in order to avoid collisions.
         * @type {integer}
         */
        this._max_index;


        /**
         * Internal logger.
         * @type {object} default:console (native object)
         */
        this.logger = console;


        // Set the internal structures
        this.clear();
    }



    /**
     * Set the logger object. By default is the native console object.
     * To disable logging just pass a null object.
     * @param {object} obj - a console-like object
     */
    setLogger(obj){
        if(_.isNil(obj)) obj = { log:function(){}, info:function(){}, warn:function(){}, error:function(){} };
        this.logger = obj;
    }



    /**
     * Show the internal data-structures and makes some simple checks.
     */
    debug(options){
        if(!options) options={};
        this.logger.log("\nkiMap.debug... "+(options.label?"["+options.label+"]":''));
        let _tab = "   ";
        let _keys = Object.keys(this._ki);
        if(_keys.length!=this._kv.length){
            this.logger.warn(_tab+"lengths mismatch >> The internal structures does not match! [ki.length="+_keys.length+"; kv.length="+this._kv.length+"]");
        }
        if(this._kv.length>0){
            for(let i=0; i<this._kv.length; i++){
                let console_fn = this.logger.log;
                let pre_msg="";
                if(i!=this._ki[this._kv[i][0]]){
                    pre_msg="indexes mismatch >> "
                    console_fn = this.logger.warn;
                }
                console_fn(_tab+pre_msg+"index:"+i+"/"+this._ki[this._kv[i][0]]+" (kv/ki)   key:'"+this._kv[i][0]+"'   data:",this._kv[i][1]);
            }
        }
        else{
            this.logger.warn(_tab+"kiMap empty!\n");
        }

        if(options.complete===true){
            this.logger.log("\nkey-index\n",this._ki);
            this.logger.log("\nkey-values\n",this._kv);
        }
    }


    /**
     * The Map() interface
     *
     * The following section has the methods with the same names of the relative
     * ones inside the native Map interface.
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


    /**
     * Current size of the collection.
     * @returns {integer}
     */
    get size(){
        return this._kv.length;
    }



    /**
     * Empty all internal structures and reset the counters.
     * After this, the kiMap is totally cleaned.
     */
    clear(){
        this._kv = []; //key-values
        this._ki = {}; //key-index
        this._max_index=-1; //for auto-key
    }



    /**
     * Removes the specified element from the collection.
     * All parameters are optionals.
     * @param {number|string} ki - key or index
     * @returns {integer} index of the deleted item or a number<0
     */
    delete(ki){
        if(uu.isString(ki))  ki=this.indexOf(ki);
        if(uu.isInteger(ki) && ki>=0){
            if(this.move(ki,-1) < 0) return -1; //move at last position
            return this._deleteByIndex(this.size-1);
        }
        return -1;
    }



    /**
     * All the elements stored within the collection.
     * Can be used with next().
     * @returns {iterator}
     */
    entries(){
        this._kv[Symbol.iterator] = function() {
            let _index = -1;
            return {
                next:()=>{
                    _index++;
                    if(_index<this.length){
                        return {
                            value:{
                                d:this[_index][1],
                                k:this[_index][0],
                                i:_index
                            },
                            done:(!(_index<this.length))
                        };
                    }
                    return { done: true };
                }
            };
        }
        return this._kv[Symbol.iterator]();
    }



    /**
     * executes a provided function once per each key/value pair in the Map object, in insertion order.
     * @param  {function} callback - Function to execute for each element; prototype: callback(index,key,value,kiMap)
     * @param  {object}  thisArg - Value to use as this when executing callback.
     */
    forEach(callback, thisArg){
        if(!uu.isFunction(callback)){
            this.logger.warn('kiMap.forEach > callback argument must be a function');
            return;
        }
        if(!uu.isObject(thisArg)){
            for(let i=0; i<this._kv.length; i++){
                callback(i,this._kv[i][0],this._kv[i][1],this);
            }
            return true;
        }
        for(let i=0; i<this._kv.length; i++){
            callback.apply(thisArg, [i,this._kv[i][0],this._kv[i][1],this]);
        }
        return true;
    }



    /**
     * Get an element from the collection.
     * @param {integer|string} ki - key or index
     * @returns {*}
     */
    get(ki){
        let item = this._get(ki);
        if(item) return item[1];
        return null;
    }



    /**
     * Returns a boolean indicating whether an element with the specified key exists or not.
     * @param {integer|string} ki - key or index
     * @returns {boolean}
     */
    has(ki){
        if(uu.isString(ki))  return (this.indexOf(ki)>=0);
        if(uu.isInteger(ki)) return (this.keyOf(ki)!=null);
        return null;
    }



    /**
     * All the keys within the collection.
     * @returns {array}
     */
    keys(){
        return Object.keys(this._ki);
    }



    /**
     * Adds or updates an element with a specified index and/or key and value.
     * All parameters are optionals.
     * @param {integer|string} ki - key or index
     * @param {any} value
     * @param {object} options - 'key' used when ki is an index, ...
     * @returns {number} index of the new element
     */
    set(ki, value, options){
        if(arguments.length<1 || uu.isNil(ki)) return false;
        if(!options) options={};
        let index=-1;

        // set by auto-key
        if(uu.isNil(value)){
            value = ki;
            return this._insertByKey(this._get_autokey(),value);
        }

        // set by key
        if(uu.isString(ki) && !uu.isNil(value)){
            return this._insertByKey(ki,value);
        }

        // set by index
        if(uu.isInteger(ki) && !uu.isNil(value)){
            if(!uu.isString(options.key)) options.key=this._get_autokey();
            index = this._insertByKey(options.key,value);
            index = this.move(index,ki);
        }

        return index;
    }



    /**
     * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
     * @return {iterator}
     */
    values(){
        this._kv[Symbol.iterator] = function() {
            let _index = -1;
            return {
                next:()=>{
                    _index++;
                    if(_index<this.length){
                        return {
                            value:this[_index][1],
                            done:(!(_index<this.length))
                        };
                    }
                    return { done: true };
                }
            };
        }
        return this._kv[Symbol.iterator]();
    }



    /**
     * EXTRA features
     *
     * The following section has the new methods for an kiMap()
     * and other useful features.
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


    /**
     * Returns the index of the element stored with the specified key.
     * @param {string} key
     * @returns {number} - a value lower than zero indicates that the element was not found
     */
    indexOf(key){
        let i = this._ki[key];
        return (uu.isNil(i) ? -1 : i);
    }



    /**
     * Returns the key of the element stored within the specified index.
     * @param index
     * @returns {string|null}
     */
    keyOf(index){
        let kv = this._kv[index];
        return (uu.isNil(kv) ? null : kv[0]);
    }



    /**
     * Update the key of an item.
     * If an item with new_key already exists, this method does nothing.
     * To force the update and the overwrite, set force=true.
     * @param  {string} old_key
     * @param  {string} new_key
     * @param  {boolean} force
     * @return {integer}
     */
    keyUpdate(old_key, new_key, force){
        if(!uu.isString(old_key) || !uu.isString(new_key)) return -1;
        if(uu.isNil(this._ki[old_key])) return -1;
        if(!uu.isNil(this._ki[new_key]) && force!==true){
            this.logger.warn("kiMap > keyUpdate: '"+new_key+"' already exists! (Set force argument as true)");
            return -1;
        }
        if(!uu.isNil(this._ki[new_key])){
            let autokey = this._get_autokey();
            this._changeKey(new_key,this._get_autokey())
            //...instead of this.delete(new_key); - no data loss!
        }
        this._changeKey(old_key,new_key);
        delete this._ki[old_key];
        return this._ki[new_key];
    }



    /**
     * Insert a bunch of values from an array.
     * In case of key collisions, the key of the new element will be changed with an 'autokey_xx'.
     * @param {Array} kv_array - simple array or array with couples [key,value]
     * @returns {boolean} true if the insertion is done
     */
    setMany(kv_array){
        if(!uu.isArray(kv_array)) return false;
        if(uu.isArray(kv_array[0])){
            for(let i=0; i<kv_array.length; i++){
                this.set(kv_array[i][0],kv_array[i][1]);
            }
            return true;
        }
        for(let i=0; i<kv_array.length; i++){
            this.set(kv_array[i]);
        }
        return true;
    }



    /**
     * Extends the current map with the values inside the 'map' argument.
     * In case of key collisions, the key of the new element will be changed with an 'autokey_xx'.
     * @param {kiMap} map
     * @returns {boolean} true if the insertion is done
     */
    merge(map){
        if(!(map instanceof kiMap)) return false;
        return this.setMany(map._kv);
    }



    /**
     * Swap two items.
     * @param  {string|integer} ki_A - key or index
     * @param  {string|integer} ki_B - key or index
     * @return {boolean}
     */
    swap(ki_A,ki_B){
        let itemA = this._get(ki_A);
        if(!itemA) return false;
        let itemB = this._get(ki_B);
        if(!itemB) return false;

        let indexA = this._ki[itemA[0]];
        let indexB = this._ki[itemB[0]];

        this._kv[indexA] = itemB;
        this._kv[indexB] = itemA;

        this._ki[itemA[0]] = indexB;
        this._ki[itemB[0]] = indexA;
        return true;
    }



    /**
     * Move the item with ki to the specified position
     * @param {string|number} ki - key or index
     * @param {integer} pos - final position
     * @returns {integer}
     */
    move(ki, pos){
        let index = ki;
        if(uu.isString(ki)) index=this.indexOf(ki);
        if(!uu.isInteger(index) || index<0 || index>=this._kv.length) return -1;
        if(!uu.isInteger(pos) || pos<0 || pos>=this._kv.length) pos=this._kv.length-1; //insert to bottom
        if(index==pos) return pos;

        // move items
        let itemB = this._kv[index];
        this._kv.splice(index, 1);
        this._kv.splice(pos, 0, itemB);

        // update indexes
        let inc = (index>pos?1:-1);
        for(let i=Math.min(index,pos); i<=Math.max(index,pos); i++){
            let item = this._kv[i];
            this._ki[item[0]]+=inc;
        }
        this._ki[this._kv[pos][0]]=pos;
        return pos;
    }



    /**
     * PRIVATE METHODS
     * ...uses the public methods also.
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


    _get_autokey(){
        return 'autokey_'+(this._max_index+1);
    }


    _get(ki){
        if(uu.isString(ki))  return this._getByKey(ki);
        if(uu.isInteger(ki)) return this._getByIndex(ki);
        return null;
    }


    _getByKey(key){
        let i = this._ki[key];
        if(uu.isNil(i)) return null;
        return this._kv[i];
    }


    _getByIndex(index){
        if(uu.isNil(this._kv[index])) return null;
        return this._kv[index];
    }


    _insertByKey(key,value){
        //this.logger.log('_insertByKey');
        if(this._ki[key]){
            this._deleteByIndex(this._ki[key]);
        }
        this._kv.push([key,value]);
        let i = this._kv.length-1;
        this._ki[key]=i;
        this._max_index++;
        return i;
    }


    _deleteByIndex(index){
        if(index<0 || index>=this._kv.length) return -1;
        let kv = this._kv[index];
        this._kv.splice(index,1);
        delete this._ki[kv[0]];
        return index;
    }


    _changeKey(old_key,new_key){
        this._ki[new_key] = this._ki[old_key];
        this._kv[this._ki[new_key]][0]=new_key;
    }
}
module.exports = kiMap;
