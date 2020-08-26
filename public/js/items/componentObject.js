/* Father class of fridge and lantern classes
*/
class ItemObject {
    
    constructor() {
        this.items = {};
    }
    
    //Install a new item into the dictionary
    install(key) {
        this.items[key] = 1;
    }
    
    //Through an AND operation to all the items in the dictionary, checks if all the items are installed
    checkAllItems() {
        var auxBool = true;
        for(var key in this.items) {
            var value = this.items[key];
            auxBool = auxBool && value;
        }
        return auxBool;
    }
}