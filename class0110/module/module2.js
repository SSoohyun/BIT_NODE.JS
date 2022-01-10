// 한 번에 내보냄
const calc = {}; // 객체
calc.add = function(a, b) {
    return a + b;
}
calc.multiply = function(a, b) {
    return a * b;
}
module.exports = calc;