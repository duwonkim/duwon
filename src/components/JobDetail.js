import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetail = () => {
  const { phone_number } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('요청된 전화번호:', phone_number); // 요청된 전화번호 로그 추가
    axios.get(`http://localhost:5001/api/jobs/${phone_number}`, { withCredentials: true })
      .then(response => {
        console.log('일자리 세부 데이터:', response.data);
        setJob(response.data[0]); // assuming the API returns an array
      })
      .catch(error => {
        console.error('일자리 세부 데이터를 불러오는 중 오류 발생:', error);
      });
  }, [phone_number]);

  const handleApply = () => {
    alert('지원이 완료되었습니다.');
    // 추가적으로 지원 기능을 구현할 수 있습니다.
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div>
      {job ? (
        <div>
          <h1>{job.TITLE}</h1>
          <p>전화번호: {job.PHONE_NUMBER}</p>
          <p>직종: {job.JOB_CATEGORY}</p>
          <p>단가: {job.RATE}</p>
          <p>위치: {job.LOCATION}</p>
          <p>날짜: {new Date(job.JOB_DATE).toLocaleDateString()}</p>
          <p>근무 시작 시간: {job.START_TIME}</p>
          <p>근무 종료 시간: {job.END_TIME}</p>
          <p>인원수: {job.PERSONNEL}</p>
          <p>메인내용: {job.DESCRIPTION}</p>
          <p>작성일: {new Date(job.CREATED_AT).toLocaleDateString()}</p> {/* 작성일 추가 */}
          <button onClick={handleBack}>뒤로가기</button>
          <button onClick={handleApply}>지원하기</button>
          
        </div>
      ) : (
        <p>일자리 세부 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default JobDetail;
