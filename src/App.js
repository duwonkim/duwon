import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import MyPage from './components/MyPage';
import Jobs from './components/jobs';
import PostJob from './components/post-job';
import JobDetail from './components/JobDetail';
import Community from './components/community';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import MemberService from './components/MemberService';
import ResumeRegister from './components/ResumeRegister';
import ResumeManage from './components/ResumeManage';
import SalaryInfo from './components/SalaryInfo';
import EmploymentContract from './components/EmploymentContract';
import CustomerService from './components/CustomerService';
import CompanyOverview from './components/CompanyOverview';
import Notices from './components/Notices';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import QnA from './components/QnA';
import PostQna from './components/post-qna';
import axios from 'axios';

function App() {
  // 로그인시 로그인한 정보 저장
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    axios.post('http://localhost:5001/api/logout', {}, { withCredentials: true })
      .then(response => {
        console.log('로그아웃 응답:', response);
        setUser(null);
        alert('로그아웃 성공');
      })
      .catch(error => {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃 중 오류 발생');
      });
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={user ? <MyPage user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
          <Route path="/find-job" element={<Jobs user={user} />} />
          <Route path="/post-job" element={<PostJob user={user} />} />
          <Route path="/jobs/:phone_number" element={<JobDetail />} />
          <Route path="/community" element={<Community user={user} />} />
          <Route path="/create-post" element={<CreatePost user={user} />} />
          <Route path="/posts/:id" element={<PostDetail user={user} />} />
          <Route path="/member-service" element={<MemberService user={user} />} />
          <Route path="/resume-register" element={<ResumeRegister user={user} />} />
          <Route path="/resume-manage/:userId" element={<ResumeManage />} />
          <Route path="/salary-info/:userId"  element={<SalaryInfo />} />
          <Route path="/employment-contract" element={<EmploymentContract user={user} />} />
          <Route path="/customer-service" element={<CustomerService user={user} />} />
          <Route path="/company-overview" element={<CompanyOverview user={user} />} />
          <Route path="/notices" element={<Notices user={user} />} />
          <Route path="/terms-of-use" element={<TermsOfUse user={user} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy user={user} />} />
          <Route path="/qna/:userId" element={<QnA user={user} />} />
          <Route path="/post-qna" element={<PostQna user={user} />} />
          <Route path="/qna" element={<QnA user={user} />} />
  
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
