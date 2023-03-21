"use strict";

var expect = chai.expect;
function sum(x, y) {
    return x + y;
}

describe('The sum() function', function () {
    it('Returns 4 for 2+2', function () {
        expect(sum(2, 2)).to.equal(4);
    });
    it('Returns 0 for -2+2', function () {
        expect(sum(-2, 2)).to.equal(0);
    });
});

function cyfry(napis) {
    let sum = [0, 0];
    for (const i of napis) {
        if (!isNaN(i)) {
            let digit = parseInt(i);
            sum[(digit + 1) % 2] += digit;
        }
    }
    return sum;
}

describe('The cyfry() function', function () {
    it('Returns [4, 2] for 123', function () {
        expect(cyfry("123")).deep.to.equal([4, 2]);
    });
    it('Returns [0, 0] for abc', function () {
        expect(cyfry("abc")).deep.to.equal([0, 0]);
    });
    it('Returns [1, 12] for 146a2B', function () {
        expect(cyfry("146a2B")).deep.to.equal([1, 12]);
    });
    it('Returns [1, 12] for c146a2B', function () {
        expect(cyfry("c146a2B")).deep.to.equal([1, 12]);
    });
    it('Returns [0, 0] for empty string', function () {
        expect(cyfry("")).deep.to.equal([0, 0]);
    });
});

function litery(napis) {
    let letters = [0, 0];
    for (const i of napis) {
        if (i == i.toUpperCase() && i == i.toLowerCase()) {
            continue;
        } else if (i == i.toLowerCase()) {
            letters[0] += 1;
        } else if (i == i.toUpperCase()) {
            letters[1] += 1;
        }
    }
    return letters;
}

describe('The litery() function', function () {
    it('Returns [0, 0] for 123', function () {
        expect(litery("123")).deep.to.equal([0, 0]);
    });
    it('Returns [2, 1] for aBc', function () {
        expect(litery("aBc")).deep.to.equal([2, 1]);
    });
    it('Returns [1, 1] for 146a2B', function () {
        expect(litery("146a2B")).deep.to.equal([1, 1]);
    });
    it('Returns [1, 2] for C146a2B', function () {
        expect(litery("C146a2B")).deep.to.equal([1, 2]);
    });
    it('Returns [0, 0] for empty string', function () {
        expect(litery("")).deep.to.equal([0, 0]);
    });
});

function suma(napis, dotychczasowaSuma) {
    let parsedText = parseInt(napis);
    dotychczasowaSuma += !isNaN(parsedText) ?  parsedText : 0;
    return dotychczasowaSuma;
}

describe('The cyfry() function', function () {
    it('Returns 123 for 123', function () {
        expect(suma("123", 0)).to.equal(123);
    });
    it('Returns 0 for aBc', function () {
        expect(suma("aBc", 0)).to.equal(0);
    });
    it('Returns 146 for 146a2B', function () {
        expect(suma("146a2B", 0)).to.equal(146);
    });
    it('Returns 0 for C146a2B', function () {
        expect(suma("C146a2B", 0)).to.equal(0);
    });
    it('Returns 0 for empty string', function () {
        expect(suma("", 0)).to.equal(0);
    });
});

let sumOfInputs = 0;
let input = window.prompt("Wpisz ciąg znaków");
while (input != null) {
    console.log(cyfry(input));
    console.log(litery(input));
    sumOfInputs = suma(input, sumOfInputs);
    console.log(sumOfInputs);
    input = window.prompt("Wpisz ciąg znaków");
}