import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CustomerService = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // 사용자가 로그인하지 않은 경우 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <h1>고객센터</h1>
      <nav>
        <ul>
          <li><Link to="/company-overview">회사개요</Link></li>
          <li><Link to="/notices">공지사항</Link></li>
          <li><Link to="/terms-of-use">이용약관</Link></li>
          <li><Link to="/privacy-policy">개인정보처리방침</Link></li>
          <li><Link to={`/qna/${user.USER_ID}`}>QnA</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default CustomerService;
