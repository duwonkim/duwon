import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeRegister = ({ user }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    birth_date: '',
    safety_certificate_number: '',
    address: '',
    phone_number: '',
    email: '',
    field: '',
    site_experience: '',
    blood_type: '',
    wears_glasses: 'NO',
    emergency_contact: '',
    emergency_contact_relationship: '',
    bank_name: '',
    bank_account_number: '',
    safety_shoes_size: '',
    vest_size: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        user_id: user.USER_ID,
        name: user.NAME,
        birth_date: formatDate(user.BIRTH_DATE),
        safety_certificate_number: user.SAFETY_CERTIFICATE_NUMBER || '',
        address: '',
        phone_number: user.PHONE_NUMBER,
        email: user.EMAIL,
        field: '',
        site_experience: '',
        blood_type: '',
        wears_glasses: 'NO',
        emergency_contact: '',
        emergency_contact_relationship: '',
        bank_name: '',
        bank_account_number: '',
        safety_shoes_size: '',
        vest_size: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/resumes', formData, { withCredentials: true });
      console.log('이력서 등록 응답:', response);
      alert('이력서가 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('이력서 등록 중 오류 발생:', error);
      alert('이력서 등록 중 오류 발생');
    }
  };

  return (
    <div>
      <h1>이력서 등록 페이지</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디:</label>
          <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} disabled />
        </div>
        <div>
          <label>이름:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} disabled />
        </div>
        <div>
          <label>생년월일:</label>
          <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} disabled />
        </div>
        <div>
          <label>건설기초안전자격증 번호:</label>
          <input type="text" name="safety_certificate_number" value={formData.safety_certificate_number} onChange={handleChange} disabled />
        </div>
        <div>
          <label>주소:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>전화번호:</label>
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} disabled />
        </div>
        <div>
          <label>이메일:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />
        </div>
        <div>
          <label>분야:</label>
          <input type="text" name="field" value={formData.field} onChange={handleChange} required />
        </div>
        <div>
          <label>현장경력:</label>
          <input type="number" name="site_experience" value={formData.site_experience} onChange={handleChange} required />년
        </div>
        <div>
          <label>혈액형:</label>
          <select name="blood_type" value={formData.blood_type} onChange={handleChange}>
            <option value="">선택</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>
        <div>
          <label>안경착용유무:</label>
          <select name="wears_glasses" value={formData.wears_glasses} onChange={handleChange} required>
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </div>
        <div>
          <label>비상연락처:</label>
          <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} required />
        </div>
        <div>
          <label>비상연락처 관계:</label>
          <input type="text" name="emergency_contact_relationship" value={formData.emergency_contact_relationship} onChange={handleChange} required />
        </div>
        <div>
          <label>계좌은행:</label>
          <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} required />
        </div>
        <div>
          <label>계좌번호:</label>
          <input type="text" name="bank_account_number" value={formData.bank_account_number} onChange={handleChange} required />
        </div>
        <div>
          <label>안전화 사이즈:</label>
          <select name="safety_shoes_size" value={formData.safety_shoes_size} onChange={handleChange} required>
            <option value="">선택</option>
            {[...Array(13)].map((_, i) => {
              const size = 230 + i * 5;
              return <option key={size} value={size}>{size}</option>;
            })}
          </select>
        </div>
        <div>
          <label>조끼 사이즈:</label>
          <select name="vest_size" value={formData.vest_size} onChange={handleChange} required>
            <option value="">선택</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default ResumeRegister;
