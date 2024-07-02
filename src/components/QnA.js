import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QnA = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qnaData, setQnaData] = useState([]);
  const [expandedQnaId, setExpandedQnaId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQnaData();
  }, []);

  const fetchQnaData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/qna', { withCredentials: true });
      setQnaData(response.data);
    } catch (error) {
      console.error('QnA 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Search query:', searchQuery);
  };

  const handleAskQuestion = () => {
    navigate('/post-qna');
  };

  const handleToggleResponse = (id) => {
    setExpandedQnaId(expandedQnaId === id ? null : id);
  };

  return (
    <div>
      <h1>QnA 페이지</h1>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
        />
        <button onClick={handleSearchSubmit}>검색</button>
        <button onClick={handleAskQuestion}>문의하기</button>
      </div>
      <div>
        {qnaData.length > 0 ? (
          qnaData.map((qna) => (
            <div key={qna.ID}>
              <h3>{qna.TITLE}</h3>
              <p>{qna.QUESTION}</p>
              <p>작성자: {qna.USER_ID}</p>
              <p>작성일: {new Date(qna.CREATED_AT).toLocaleDateString()}</p>
              {expandedQnaId === qna.ID && (
                <div>
                  <h4>관리자 답변</h4>
                  <p>{qna.RESPONSE || '아직 답변이 없습니다.'}</p>
                </div>
              )}
              <button onClick={() => handleToggleResponse(qna.ID)}>
                {expandedQnaId === qna.ID ? '숨기기' : '관리자 답변'}
              </button>
            </div>
          ))
        ) : (
          <p>QnA 데이터를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default QnA;
