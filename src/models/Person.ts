// Class abstrak sebagai contoh inheritance dan polymorphism.
export abstract class Person {
  // Encapsulation: properti dibuat private/protected agar tidak diubah sembarangan dari luar class.
  private readonly id: string;
  protected name: string;
  protected email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(newName: string): void {
    this.name = newName;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(newEmail: string): void {
    this.email = newEmail;
  }

  // Method ini akan di-override oleh class turunan.
  abstract getInfo(): string;
}
