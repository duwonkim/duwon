import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

const Community = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다');
      navigate('/login');
    } else {
      fetchPosts(currentPage);
    }
  }, [user, navigate, currentPage]);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await axios.get('http://localhost:5001/api/community', {
        params: { page },
        withCredentials: true
      });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('커뮤니티 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      {user && (
        <div>
          <h2>{user.NAME}님, 커뮤니티에 오신 것을 환영합니다!</h2>
        </div>
      )}
      <h1>커뮤니티 페이지</h1>
      <button onClick={handleCreatePost}>글 작성</button>
      {/* 커뮤니티 게시글 목록 */}
      <div>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.ID} onClick={() => handlePostClick(post.ID)}>
              <h3>{post.TITLE}</h3>
              <p>좋아요: {post.LIKES}</p>
              <p>작성일: {new Date(post.CREATED_AT).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>커뮤니티 데이터를 불러오는 중입니다...</p>
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

export default Community;
