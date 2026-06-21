import { StudentRecord } from '../models/Student';

// Time complexity: O(n)
export function linearSearchByName(students: StudentRecord[], keyword: string): StudentRecord[] {
  const lowerKeyword = keyword.toLowerCase();
  const result: StudentRecord[] = [];

  for (let index = 0; index < students.length; index += 1) {
    if (students[index].name.toLowerCase().includes(lowerKeyword)) {
      result.push(students[index]);
    }
  }

  return result;
}

// Time complexity: O(n). Sequential search memeriksa data satu per satu dari awal sampai akhir.
export function sequentialSearchByNim(students: StudentRecord[], nim: string): StudentRecord | null {
  for (const student of students) {
    if (student.nim === nim) {
      return student;
    }
  }
  return null;
}

// Time complexity: O(log n), syarat data harus sudah terurut berdasarkan NIM.
export function binarySearchByNim(sortedStudents: StudentRecord[], nim: string): StudentRecord | null {
  let leftIndex = 0;
  let rightIndex = sortedStudents.length - 1;

  while (leftIndex <= rightIndex) {
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    const middleNim = sortedStudents[middleIndex].nim;

    if (middleNim === nim) {
      return sortedStudents[middleIndex];
    }

    if (middleNim < nim) {
      leftIndex = middleIndex + 1;
    } else {
      rightIndex = middleIndex - 1;
    }
  }

  return null;
}
