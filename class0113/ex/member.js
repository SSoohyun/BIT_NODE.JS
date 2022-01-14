var member = {
    listMember: function (database, MemberModel, callback) {
        console.log('/process/listMember 호출됨');
        
        // 모든 회원 조회
        MemberModel.findAll(function (err, results) {
            if (err) {
                callback(err, null);
                return;
            }

            if (results.length > 0) { // 결과 객체가 있으면 리스트 전송
                console.log('등록된 회원 목록 결과 : ' + results);
                callback(null, results);
            } else { // 결과 객체가 없으면 실패 응답 전송
                console.log('등록된 회원 없음');
                callback(null, null);
            }
        }); // findAll
    },

    // 데이터베이스 모델 객체를 위한 변수 선언
    addMember : function(database, user, userId, userPwd, userName, age, callback) {
        console.log('addMember 호출됨: ' + userId + ', ' + userPwd + ', ' + userName + ', ' + age);

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
    },

    // 사용자 인증 함수
    authMember: function (database, MemberModel, userId, userPwd, callback) {
        console.log('authMember 호출됨 : ' + userId + ', ' + userPwd);

        // 1. 아이디를 사용해 검색
        MemberModel.findById(userId, function (err, results) {
            if (err) {
                callback(err, null);
                ruturn;
            }
            console.log('아이디[%s]로 사용자 검색 결과', userId);

            if (results.length > 0) {
                console.log('아이디와 일치하는 사용자 찾음', userId);
                // 2. 비밀번호 확인
                if (results[0]._doc.userPwd === userPwd) { // 컬렉션 안에 있는 document(row)
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
    } // authMember ends.
}

module.exports = member;