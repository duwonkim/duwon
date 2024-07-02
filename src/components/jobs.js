import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

const Jobs = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async (page = 1) => {
    try {
      const response = await axios.get('http://localhost:5001/api/jobs', {
        params: { searchCategory, page },
        withCredentials: true,
      });
      console.log('일자리 데이터:', response.data);
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('일자리 데이터를 불러오는 중 오류 발생:', error);
      setJobs([]);
    }
  }, [searchCategory]);

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다');
      navigate('/login');
    } else {
      fetchJobs(currentPage);
    }
  }, [user, navigate, fetchJobs, currentPage]);

  const handleJobClick = (phoneNumber) => {
    console.log('클릭된 전화번호:', phoneNumber);
    navigate(`/jobs/${phoneNumber}`);
  };

  const handleSortByRate = () => {
    const sortedJobs = [...jobs].sort((a, b) => b.RATE - a.RATE);
    setJobs(sortedJobs);
  };

  const handleSortByDate = () => {
    const sortedJobs = [...jobs].sort((a, b) => new Date(b.CREATED_AT) - new Date(a.CREATED_AT));
    setJobs(sortedJobs);
  };

  const handleSearchByCategory = () => {
    fetchJobs();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchJobs(value);
  };

  return (
    <div>
      {user && (
        <div>
          <h2>{user.NAME}님</h2>
          <p>전화번호: {user.PHONE_NUMBER}</p>
          <p>나이: {new Date().getFullYear() - new Date(user.BIRTH_DATE).getFullYear()}세</p>
        </div>
      )}
      <h1>일자리 찾기</h1>
      <div>
        <button onClick={handleSortByRate}>높은 단가순</button>
        <button onClick={handleSortByDate}>최신 등록순</button>
        <button>가까운 거리순</button>
        <div>
          <input
            type="text"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            placeholder="직종별 검색"
          />
          <button onClick={handleSearchByCategory}>검색</button>
        </div>
      </div>
      <div>
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.PHONE_NUMBER} onClick={() => handleJobClick(job.PHONE_NUMBER)}>
              <h2>{job.TITLE}</h2>
              <p>직종: {job.JOB_CATEGORY}</p>
              <p>단가: {job.RATE}</p>
              <p>위치: {job.LOCATION}</p>
              <p>작성일: {new Date(job.CREATED_AT).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>일자리를 불러오는 중입니다...</p>
        )}
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </div>
  );
};

export default Jobs;
