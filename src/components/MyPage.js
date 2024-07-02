import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPage = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    USER_ID: '',
    NAME: '',
    PASSWORD: '',
    BIRTH_DATE: '',
    PHONE_NUMBER: '',
    CARRIER: '',
    EMAIL: '',
    SAFETY_CERTIFICATE_NUMBER: '',
    REGISTRATION_SOURCE: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        BIRTH_DATE: user.BIRTH_DATE ? user.BIRTH_DATE.split('T')[0] : '' // 날짜 형식을 'YYYY-MM-DD'로 변환
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdate = () => {
    const requiredFields = ['NAME', 'BIRTH_DATE', 'PHONE_NUMBER', 'CARRIER', 'EMAIL'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`필수 필드가 비어 있습니다: ${field}`);
        return;
      }
    }

    axios.put(`http://localhost:5001/api/user/${formData.USER_ID}`, formData, { withCredentials: true })
      .then(response => {
        alert('사용자 정보가 성공적으로 업데이트되었습니다');
        setUser(formData);
      })
      .catch(error => {
        console.error('사용자 정보 수정 중 오류 발생:', error);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5001/api/user/${formData.USER_ID}`, { withCredentials: true })
      .then(response => {
        alert('사용자가 성공적으로 삭제되었습니다');
        setUser(null);
      })
      .catch(error => {
        console.error('사용자 삭제 중 오류 발생:', error);
      });
  };

  return (
    <div>
      <h2>마이페이지</h2>
      <div>
        <label>아이디: </label>
        <input type="text" name="USER_ID" value={formData.USER_ID} onChange={handleChange} disabled />
      </div>
      <div>
        <label>이름: </label>
        <input type="text" name="NAME" value={formData.NAME} onChange={handleChange} />
      </div>
      <div>
        <label>비밀번호: </label>
        <input type="password" name="PASSWORD" value={formData.PASSWORD} onChange={handleChange} />
      </div>
      <div>
        <label>생년월일: </label>
        <input type="date" name="BIRTH_DATE" value={formData.BIRTH_DATE} onChange={handleChange} />
      </div>
      <div>
        <label>전화번호: </label>
        <input type="text" name="PHONE_NUMBER" value={formData.PHONE_NUMBER} onChange={handleChange} />
      </div>
      <div>
        <label>통신사: </label>
        <input type="text" name="CARRIER" value={formData.CARRIER} onChange={handleChange} />
      </div>
      <div>
        <label>이메일: </label>
        <input type="text" name="EMAIL" value={formData.EMAIL} onChange={handleChange} />
      </div>
      <div>
        <label>건설기초안전자격증 번호: </label>
        <input type="text" name="SAFETY_CERTIFICATE_NUMBER" value={formData.SAFETY_CERTIFICATE_NUMBER} onChange={handleChange} />
      </div>
      <div>
        <label>가입경로: </label>
        <input type="text" name="REGISTRATION_SOURCE" value={formData.REGISTRATION_SOURCE} onChange={handleChange} />
      </div>
      <button onClick={handleUpdate}>정보 수정</button>
      <button onClick={handleDelete}>탈퇴</button>
    </div>
  );
};

export default MyPage;
