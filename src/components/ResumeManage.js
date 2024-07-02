import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResumeManage = () => {
  const { userId } = useParams();
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/resumes/${userId}`, { withCredentials: true });
        console.log('받은 이력서 데이터:', response.data); // 받은 데이터 확인
        setResumes(response.data);
      } catch (error) {
        console.error('이력서 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    if (userId) {
      fetchResumes();
    }
  }, [userId]);

  console.log('렌더링된 이력서 데이터:', resumes); // 렌더링될 데이터 확인

  return (
    <div>
      <h1>이력서 관리 페이지</h1>
      {resumes.length > 0 ? (
        resumes.map((resume) => (
          <div key={resume.USER_ID} style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
            <p>아이디: {resume.USER_ID}</p>
            <p>이름: {resume.NAME}</p>
            <p>생년월일: {new Date(resume.BIRTH_DATE).toLocaleDateString()}</p>
            <p>건설기초안전자격증 번호: {resume.SAFETY_CERTIFICATE_NUMBER}</p>
            <p>주소: {resume.ADDRESS}</p>
            <p>전화번호: {resume.PHONE_NUMBER}</p>
            <p>이메일: {resume.EMAIL}</p>
            <p>분야: {resume.FIELD}</p>
            <p>현장경력: {resume.SITE_EXPERIENCE}년</p>
            <p>혈액형: {resume.BLOOD_TYPE}</p>
            <p>안경착용유무: {resume.WEARS_GLASSES}</p>
            <p>비상연락처: {resume.EMERGENCY_CONTACT}</p>
            <p>비상연락처 관계: {resume.EMERGENCY_CONTACT_RELATIONSHIP}</p>
            <p>계좌은행: {resume.BANK_NAME}</p>
            <p>계좌번호: {resume.BANK_ACCOUNT_NUMBER}</p>
            <p>안전화 사이즈: {resume.SAFETY_SHOES_SIZE}</p>
            <p>조끼 사이즈: {resume.VEST_SIZE}</p>
            <button onClick={() => alert(`수정 페이지로 이동: ${resume.USER_ID}`)}>수정하기</button>
          </div>
        ))
      ) : (
        <p>이력서를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default ResumeManage;
