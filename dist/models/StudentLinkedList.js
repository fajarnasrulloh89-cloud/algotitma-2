"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentLinkedList = exports.StudentNode = void 0;
// TypeScript/JavaScript tidak punya pointer manual seperti C/C++.
// Konsep pointer diterapkan lewat reference object: properti next menunjuk ke node berikutnya.
class StudentNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}
exports.StudentNode = StudentNode;
class StudentLinkedList {
    constructor() {
        this.head = null;
    }
    append(student) {
        const newNode = new StudentNode(student);
        if (this.head === null) {
            this.head = newNode;
            return;
        }
        let currentNode = this.head;
        while (currentNode.next !== null) {
            currentNode = currentNode.next;
        }
        currentNode.next = newNode;
    }
    toArray() {
        const result = [];
        let currentNode = this.head;
        while (currentNode !== null) {
            result.push(currentNode.data);
            currentNode = currentNode.next;
        }
        return result;
    }
}
exports.StudentLinkedList = StudentLinkedList;
