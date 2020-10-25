class Queue {
    // Creates the queue
    constructor() {
        this.storage = [];
        this.count = 0;
        this.lowestCount = 0;
    }

    // Adds a value to the end of the chain
    enqueue(value) {
        this.storage.push(value);
    }

    // Removes a value from the beginning of the chain
    dequeue() {
        return this.storage.shift();
    }

    // Returns the last element of the queue
    last() {
        return this.storage[this.storage.length - 1];
    }
    
    // Returns the first element of the queue
    peek() {
        return this.storage[0];
    }

    // Returns the length of the queue
    get length() {
        return this.storage.length;
    }
}