"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
// Class abstrak sebagai contoh inheritance dan polymorphism.
class Person {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    setName(newName) {
        this.name = newName;
    }
    getEmail() {
        return this.email;
    }
    setEmail(newEmail) {
        this.email = newEmail;
    }
}
exports.Person = Person;
