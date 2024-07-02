// CreatePost.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/posts', {
        title,
        content,
        author: user.NAME,
      }, { withCredentials: true });

      if (response.status === 201) {
        alert('글이 성공적으로 작성되었습니다.');
        navigate('/community');
      }
    } catch (error) {
      console.error('글 작성 중 오류가 발생했습니다:', error);
      alert('글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>메인내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">작성</button>
      </form>
    </div>
  );
};

export default CreatePost;
