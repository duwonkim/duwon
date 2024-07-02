import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QnA = ({ user }) => {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = () => {
    if (!title || !question) {
      alert('제목과 문의사항을 모두 입력해주세요.');
      return;
    }

    axios.post('http://localhost:5001/api/qna', {
      userId: user.USER_ID,
      title: title,
      question: question
    }, { withCredentials: true })
      .then(response => {
        console.log('QnA 제출 응답:', response);
        alert('문의사항이 성공적으로 제출되었습니다.');
        setTitle('');
        setQuestion('');
      })
      .catch(error => {
        console.error('문의사항 제출 중 오류 발생:', error);
        alert('문의사항 제출 중 오류가 발생했습니다.');
      });
  };

  return (
    <div>
      <h1>QnA 페이지</h1>
      <div>
        <h2>문의하기</h2>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
        />
        <textarea
          value={question}
          onChange={handleQuestionChange}
          placeholder="문의사항을 입력하세요"
        />
        <button onClick={handleSubmit}>제출</button>
      </div>
    </div>
  );
};

export default QnA;
