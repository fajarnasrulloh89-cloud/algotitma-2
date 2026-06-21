"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linearSearchByName = linearSearchByName;
exports.sequentialSearchByNim = sequentialSearchByNim;
exports.binarySearchByNim = binarySearchByNim;
// Time complexity: O(n)
function linearSearchByName(students, keyword) {
    const lowerKeyword = keyword.toLowerCase();
    const result = [];
    for (let index = 0; index < students.length; index += 1) {
        if (students[index].name.toLowerCase().includes(lowerKeyword)) {
            result.push(students[index]);
        }
    }
    return result;
}
// Time complexity: O(n). Sequential search memeriksa data satu per satu dari awal sampai akhir.
function sequentialSearchByNim(students, nim) {
    for (const student of students) {
        if (student.nim === nim) {
            return student;
        }
    }
    return null;
}
// Time complexity: O(log n), syarat data harus sudah terurut berdasarkan NIM.
function binarySearchByNim(sortedStudents, nim) {
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
        }
        else {
            rightIndex = middleIndex - 1;
        }
    }
    return null;
}
