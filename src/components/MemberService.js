import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MemberService = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다');
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      {user && (
        <div>
          <h2>{user.NAME}님, 회원서비스에 오신 것을 환영합니다!</h2>
        </div>
      )}
      <h1>회원서비스 페이지</h1>
      <div>
        <button onClick={() => navigate('/resume-register')}>이력서 등록</button>
        <button onClick={() => navigate(`/resume-manage/${user.USER_ID}`)}>이력서 관리</button>
        <button onClick={() => navigate(`/salary-info/${user.USER_ID}`)}>급여 정보</button>
        <button onClick={() => navigate('/employment-contract')}>근로 계약서</button>
      </div>
    </div>
  );
};

export default MemberService;
