var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Calc = function() {
    var self = this;

    this.on('stop', function() {
        console.log('Calc에 stop event 전달됨');
    });
};

util.inherits(Calc, EventEmitter); // 계산기 객체가 EventEmitter 상속받음(extends) -> emit과 on 메소드 사용 가능
Calc.prototype.add = function(a, b) {
    return a + b;
}
module.exports = Calc;
module.exports.title = 'calculator';