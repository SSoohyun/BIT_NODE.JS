// require() 메소드는 exports 객체를 반환함
let member1 = require('./member1');
let member2 = require('./member2');
let member3 = require('./member3');
let member4 = require('./member4');
let printMember = require('./member5').printMember;
let member6 = require('./member6');
let Member7 = require('./member7');

// member1
function showMember1() {
    return member1.getMember().userName + ', ' + member1.group.userName;
}
console.log('사용자 정보: %s', showMember1());

// member2
function showMember2() {
    return member2.getMember().userName + ', ' + member1.group.userName;
}
console.log('사용자 정보: %s', showMember2());

// member3
function showMember3() {
    return member3.getMember().userName + ', ' + member1.group.userName;
}
console.log('사용자 정보: %s', showMember3());

// member4
function showMember4() {
    return member4().userName + ', ' + 'no group';
}
console.log('사용자 정보: %s', showMember4());

// member5
printMember();

// member6
member6.printMember();

// member7
let member7 = new Member7('conan', '코난');
member7.printMember();
