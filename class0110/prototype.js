// 프로토타입: 객체 지향 프로그래밍을 할 수 있게 도와줌
// 객체의 원형인 프로토타입을 이용해서 새로운 객체를 만들어내고
// 이렇게 생성된 객체는 다른 객체의 원형이 되어 새로운 객체를 생성할 수 있음
function person() {};
console.log(person.prototype);

person.prototype.name = 'conan';
console.log(person.prototype);