class Queue {
    // Creates the queue
    constructor() {
        this.storage = {};
        this.count = 0;
        this.lowestCount = 0;
    }

    // Adds a value to the end of the chain
    enqueue(value) {
        // Check to see if value is defined
        if (value) {
            this.storage[this.count] = value;
            this.count++;
        }
    }

    // Removes a value from the beginning of the chain
    dequeue() {
        // Check to see if queue is empty
        if (this.count - this.lowestCount === 0) {
            return undefined;
        }

        var result = this.storage[this.lowestCount];
        delete this.storage[this.lowestCount];
        this.lowestCount++;
        return result;
    }

    // Returns the last element of the queue
    last() {
        return this.storage[this.count-1];
    }
    
    // Returns the first element of the queue
    first() {
        return this.storage[this.lowestCount];
    }

    // Returns if the queue is empty
    isEmpty() {
        return this.count - this.lowestCount == 0;
    }

    // Returns the length of the queue
    size() {
        return this.count - this.lowestCount;
    }

    showQueue() {
        var cont = 0;
        while (cont < this.count) {
            console.log("[x:" + this.storage[cont].x+", y:"+this.storage[cont].y + "]");
            cont++;
        }
    }
}