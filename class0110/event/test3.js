var Calc = require('./calc3');
var calc = new Calc(); // 객체 생성
calc.emit('stop');
console.log(Calc.title + '에 stop 이벤트 전달함');