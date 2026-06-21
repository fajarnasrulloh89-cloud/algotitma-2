"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bubbleSort = bubbleSort;
exports.selectionSort = selectionSort;
exports.insertionSort = insertionSort;
exports.mergeSort = mergeSort;
exports.shellSort = shellSort;
function compareStudents(firstStudent, secondStudent, key) {
    const firstValue = firstStudent[key];
    const secondValue = secondStudent[key];
    if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return firstValue - secondValue;
    }
    return String(firstValue).localeCompare(String(secondValue));
}
// Time complexity: O(n^2)
function bubbleSort(students, key) {
    const sortedStudents = [...students];
    for (let passIndex = 0; passIndex < sortedStudents.length - 1; passIndex += 1) {
        for (let currentIndex = 0; currentIndex < sortedStudents.length - passIndex - 1; currentIndex += 1) {
            if (compareStudents(sortedStudents[currentIndex], sortedStudents[currentIndex + 1], key) > 0) {
                [sortedStudents[currentIndex], sortedStudents[currentIndex + 1]] = [sortedStudents[currentIndex + 1], sortedStudents[currentIndex]];
            }
        }
    }
    return sortedStudents;
}
// Time complexity: O(n^2)
function selectionSort(students, key) {
    const sortedStudents = [...students];
    for (let startIndex = 0; startIndex < sortedStudents.length - 1; startIndex += 1) {
        let minimumIndex = startIndex;
        for (let currentIndex = startIndex + 1; currentIndex < sortedStudents.length; currentIndex += 1) {
            if (compareStudents(sortedStudents[currentIndex], sortedStudents[minimumIndex], key) < 0) {
                minimumIndex = currentIndex;
            }
        }
        if (minimumIndex !== startIndex) {
            [sortedStudents[startIndex], sortedStudents[minimumIndex]] = [sortedStudents[minimumIndex], sortedStudents[startIndex]];
        }
    }
    return sortedStudents;
}
// Time complexity: O(n^2) worst case, cukup baik untuk data kecil.
function insertionSort(students, key) {
    const sortedStudents = [...students];
    for (let currentIndex = 1; currentIndex < sortedStudents.length; currentIndex += 1) {
        const currentStudent = sortedStudents[currentIndex];
        let previousIndex = currentIndex - 1;
        while (previousIndex >= 0 && compareStudents(sortedStudents[previousIndex], currentStudent, key) > 0) {
            sortedStudents[previousIndex + 1] = sortedStudents[previousIndex];
            previousIndex -= 1;
        }
        sortedStudents[previousIndex + 1] = currentStudent;
    }
    return sortedStudents;
}
// Time complexity: O(n log n)
function mergeSort(students, key) {
    if (students.length <= 1) {
        return students;
    }
    const middleIndex = Math.floor(students.length / 2);
    const leftStudents = mergeSort(students.slice(0, middleIndex), key);
    const rightStudents = mergeSort(students.slice(middleIndex), key);
    return merge(leftStudents, rightStudents, key);
}
function merge(leftStudents, rightStudents, key) {
    const mergedStudents = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < leftStudents.length && rightIndex < rightStudents.length) {
        if (compareStudents(leftStudents[leftIndex], rightStudents[rightIndex], key) <= 0) {
            mergedStudents.push(leftStudents[leftIndex]);
            leftIndex += 1;
        }
        else {
            mergedStudents.push(rightStudents[rightIndex]);
            rightIndex += 1;
        }
    }
    return mergedStudents.concat(leftStudents.slice(leftIndex), rightStudents.slice(rightIndex));
}
// Time complexity: sekitar O(n log n) sampai O(n^2), tergantung gap sequence.
function shellSort(students, key) {
    const sortedStudents = [...students];
    let gap = Math.floor(sortedStudents.length / 2);
    while (gap > 0) {
        for (let index = gap; index < sortedStudents.length; index += 1) {
            const tempStudent = sortedStudents[index];
            let comparedIndex = index;
            while (comparedIndex >= gap && compareStudents(sortedStudents[comparedIndex - gap], tempStudent, key) > 0) {
                sortedStudents[comparedIndex] = sortedStudents[comparedIndex - gap];
                comparedIndex -= gap;
            }
            sortedStudents[comparedIndex] = tempStudent;
        }
        gap = Math.floor(gap / 2);
    }
    return sortedStudents;
}
