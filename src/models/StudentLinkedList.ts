import { StudentRecord } from './Student';

// TypeScript/JavaScript tidak punya pointer manual seperti C/C++.
// Konsep pointer diterapkan lewat reference object: properti next menunjuk ke node berikutnya.
export class StudentNode {
  data: StudentRecord;
  next: StudentNode | null;

  constructor(data: StudentRecord) {
    this.data = data;
    this.next = null;
  }
}

export class StudentLinkedList {
  private head: StudentNode | null = null;

  append(student: StudentRecord): void {
    const newNode = new StudentNode(student);

    if (this.head === null) {
      this.head = newNode;
      return;
    }

    let currentNode: StudentNode = this.head;
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    currentNode.next = newNode;
  }

  toArray(): StudentRecord[] {
    const result: StudentRecord[] = [];
    let currentNode = this.head;

    while (currentNode !== null) {
      result.push(currentNode.data);
      currentNode = currentNode.next;
    }

    return result;
  }
}
