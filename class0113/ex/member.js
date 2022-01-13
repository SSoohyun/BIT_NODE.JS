function listMember(MemberModel) {
    let MemberModel = MemberModel;
    // 1. 모든 사용자 검색
    MemberModel.findAll(function(err, results) {
        if(err) {
            console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();
            return;
        }

        if(results) { // 결과 객체가 있으면 리스트 전송
            console.dir(results);
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>사용자 리스트</h2>');
            res.write('<div><ul>');
            for(let i = 0; i < results.length; i++) {
                let curUserId = results[i]._doc.userId;
                let curUserPwd = results[i]._doc.userPwd;
                let curUserName = results[i]._doc.userName;
                let curAge = results[i]._doc.age;
                let curRegDate = results[i]._doc.regDate;
                let curUpdateDate = results[i]._doc.updateDate;
                res.write('<li>#' + i + ' : ' 
                + 'id=' + curUserId + ', ' + 'pwd=' + curUserPwd + ', '
                + 'name=' + curUserName + ', ' + 'age=' + curAge + ', '
                + 'regDate=' + curRegDate + ', ' + 'updateDate=' + curUpdateDate + '</li>');
            }
            res.write('</ul></div>');
            res.end();
        } else { // 결과 객체가 없으면 실패 응답 전송
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>조회에 실패했습니다.</h2>');
            res.end();
        }
    }); // findAll
}

// 사용자 인증 함수
function authMember(database, userId, userPwd, callback) {
    connectDB();

    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd);
    
    // 1. 아이디를 사용해 검색
    MemberModel.findById(userId, function(err, results) {
        if(err) {
            callback(err, null);
            ruturn;
        }
        console.log('아이디[%s]로 사용자 검색 결과', userId);

        if(results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음', userId);
            // 2. 비밀번호 확인
            if(results[0]._doc.userPwd === userPwd) { // 컬렉션 안에 있는 document(row)
                console.log('비밀번호 일치함');
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
        } else {
            console.log('아이디와 일치하는 사용자 찾지 못함');
            callback(null, null);
        }
    });
}; // authMember ends.

function addMember(database, userId, userPwd, userName, age, callback) {
    connectDB();

    console.log('addMember 호출됨: ' + userId + ', ' + userPwd + ', ' + userName);
    
    // MemberModel 인스턴스 생성
    let user = new MemberModel({"userId":userId, "userPwd":userPwd, "userName":userName, "age":age});
    
    // save()로 저장: 저장 성공 시 addedUser 객체가 파라미터로 전달됨
    user.save(function(err, addedUser) {
        console.log("addedUser%j", addedUser);
        if(err) {
            callback(err, null);
            return;
        }
        console.log("사용자 데이터 추가함");
        callback(null, addedUser);
    });
};

module.exports.listMember = listMember;
module.exports.authMember = authMember;
module.exports.addMember = addMember;