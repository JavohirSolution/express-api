const request = require("supertest")
const sum = require('../dd');

test('adds 1 to 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
});