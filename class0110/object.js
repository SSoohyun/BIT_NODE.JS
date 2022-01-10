const car = { // 객체
    name: 'beetle', // key : value
    speed: 100,
    color: 'yellow',
    start: function () { // 메소드
        return this.speed + 10;
    }
}

console.dir(car);