import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, handleLogout }) => {
  return (
    <header>
      <h1>헤더</h1>
      <nav>
        <ul>
          {user ? (
            <>
              <li><button onClick={handleLogout}>로그아웃</button></li>
              <li><Link to="/mypage">마이페이지</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login">로그인</Link></li>
              <li><Link to="/signup">회원가입</Link></li>
            </>
          )}
          <li><Link to="/find-job">일자리 찾기</Link></li>
          <li><Link to="/post-job">일자리 등록</Link></li>
          <li><Link to="/community">커뮤니티</Link></li>
          <li><Link to="/member-service">회원서비스</Link></li> 
          <li><Link to="/customer-service">고객센터</Link></li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;
