import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostJob = ({ user }) => {
  const [formData, setFormData] = useState({
    phone_number: '',
    title: '',
    job_category: '',
    rate: '',
    job_date: '',
    start_time: '',
    end_time: '',
    location: '',
    personnel: '',
    description: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다');
      navigate('/login');
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        phone_number: user.PHONE_NUMBER,
      }));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/job_registration', formData, { withCredentials: true })
      .then(response => {
        console.log('데이터 저장 성공:', response);
        alert('일자리 등록 성공');
        navigate('/');
      })
      .catch(error => {
        console.error('데이터 저장 중 오류 발생:', error);
        alert('일자리 등록 중 오류 발생');
      });
  };

  return (
    <div>
      <h1>일자리 등록</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>전화번호:</label>
          <input type="text" name="phone_number" value={formData.phone_number} readOnly />
        </div>
        <div>
          <label>제목:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>직종선택:</label>
          <input type="text" name="job_category" value={formData.job_category} onChange={handleChange} required />
        </div>
        <div>
          <label>단가:</label>
          <input type="number" name="rate" value={formData.rate} onChange={handleChange} required />
        </div>
        <div>
          <label>날짜:</label>
          <input type="date" name="job_date" value={formData.job_date} onChange={handleChange} required />
        </div>
        <div>
          <label>근무시작시간:</label>
          <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
        </div>
        <div>
          <label>근무종료시간:</label>
          <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
        </div>
        <div>
          <label>근무위치:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>인원수:</label>
          <input type="number" name="personnel" value={formData.personnel} onChange={handleChange} required />
        </div>
        <div>
          <label>메인내용:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default PostJob;
