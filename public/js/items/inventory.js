/** Class representing the inventory
 * of the player
 */
class Inventory {

    constructor(){
        this.items = [];
        this.itemCounter = 0;
    }
    
    addItem(item){
        if(!this.searchItem(item)){
            console.log('Adding item to the inventory...');
            this.items[this.itemCounter] = item;
            this.itemCounter++;
        }else{
            console.log('The item already exists in the inventory');
        }
    }
           
    searchItem(item){
        var enc = false;
        for(int i=0;i<this.itemCounter;i++){
            if(this.items[i] == item)
                enc = true;
        }
    }
    
}