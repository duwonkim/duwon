import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = ({ user }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('글 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:5001/api/posts/${id}/like`, {}, { withCredentials: true });
      setPost(prevPost => ({ ...prevPost, LIKES: prevPost.LIKES + 1 }));
    } catch (error) {
      console.error('좋아요 중 오류 발생:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:5001/api/posts/${id}/dislike`, {}, { withCredentials: true });
      setPost(prevPost => ({ ...prevPost, DISLIKES: prevPost.DISLIKES + 1 }));
    } catch (error) {
      console.error('싫어요 중 오류 발생:', error);
    }
  };

  if (!post) {
    return <p>글 데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div>
      <h1>{post.TITLE}</h1>
      <p>작성자: {post.AUTHOR}</p>
      <p>작성일: {new Date(post.CREATED_AT).toLocaleDateString()}</p>
      <p>{post.CONTENT}</p>
      <p>좋아요: {post.LIKES}</p>
      <p>싫어요: {post.DISLIKES}</p>
      <button onClick={handleLike}>좋아요</button>
      <button onClick={handleDislike}>싫어요</button>
    </div>
  );
};

export default PostDetail;
