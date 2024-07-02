// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <p>&copy; 현장어때</p>
      <div className="footer-contact">
        <p>고객센터: 00-0000-0000 (평일 09:00~19:00, 주말·공휴일 휴무)</p>
        <p>이메일: 0000@naver.com</p>
        <p>팩스: 00-0000-00000(대표), 00-0000-0000(세금계산서)</p>
      </div>
      <div className="footer-company">
        <p>현장어때, 우 : 00000, 000 0000 00 00, 대표 : 000</p>
        <p>사업자등록: 000-00-000000</p>
        <p>직업정보제공사업: 00 00 0 0000-0호</p>
        <p>통신판매업: 제 0000-00000호</p>
      </div>
    </footer>
  );
};

export default Footer;
