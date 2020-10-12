/** Class representing the inventory
 * of the player
 */
class Inventory {

    constructor(){
        // Contains the items name in the inventory
        this.items = [];
    }

    getItems() {
        return [...this.items];
    }
    
    //Adds a new item into the inventory
    addItem(item){
        if(!this.searchItem(item)){
            console.log('Adding item to the inventory...');
            this.items.push(item);
        }else{
            console.log('The item already exists in the inventory');
        }
    }

    removeItem(item){
        let index = array.indexOf(item);
        if(index != -1) this.items.splice(index, 1);
    }

    updateItems(newItems) {
        this.items = [...newItems];
    }
           
    //Searches for the item in the inventory
    searchItem(item){
        return this.items.includes(item);
    }

    //Show all the items
    showItems() {
        for(let i=0; i < this.items.length; i++){
            console.log(this.items[i])
        }
    }
}