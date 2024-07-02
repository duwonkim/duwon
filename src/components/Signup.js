import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [carrier, setCarrier] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [safetyCertificateNumber, setSafetyCertificateNumber] = useState('');
  const [registrationSource, setRegistrationSource] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('전화번호를 인증해주세요.');
      return;
    }

    const phoneNumber = `${phone1}-${phone2}-${phone3}`;
    const email = `${emailUser}@${emailDomain}`;

    // 디버깅을 위해 상태 출력
    console.log({
      userId,
      name,
      password,
      birthDate,
      phoneNumber,
      carrier,
      email,
      safetyCertificateNumber,
      registrationSource
    });

    axios.post('http://localhost:5001/api/users', {
      userId,
      name,
      password,
      birthDate,
      phoneNumber,
      carrier,
      email,
      safetyCertificateNumber,
      registrationSource
    })
      .then(response => {
        console.log(response.data);
        alert('회원가입을 완료했습니다');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const sendVerificationCode = () => {
    // 인증번호 전송 로직 추가
    const phoneNumber = `${phone1}-${phone2}-${phone3}`;
    console.log(`Sending verification code to ${phoneNumber}`);
    // 실제 인증번호 전송 로직 추가 필요
    alert('인증번호가 전송되었습니다.');
    setIsCodeSent(true);
  };

  const verifyPhoneNumber = () => {
    const masterKey = '1234';
    if (verificationCode === masterKey) {
      setIsVerified(true);
      alert('전화번호 인증 성공');
    } else {
      alert('전화번호 인증 실패');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>ID:</label>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
        <div>
          <label>이름:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>PW:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>생년월일:</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div>
          <label>통신사:</label>
          <select value={carrier} onChange={(e) => setCarrier(e.target.value)}>
            <option value="">선택</option>
            <option value="kt">KT</option>
            <option value="skt">SKT</option>
            <option value="lg">LG</option>
          </select>
        </div>
        <div>
          <label>전화번호:</label>
          <input type="text" value={phone1} onChange={(e) => setPhone1(e.target.value)} size="4" /> -
          <input type="text" value={phone2} onChange={(e) => setPhone2(e.target.value)} size="4" /> -
          <input type="text" value={phone3} onChange={(e) => setPhone3(e.target.value)} size="4" />
          <button type="button" onClick={sendVerificationCode}>인증번호 전송</button>
        </div>
        
        <div>
          <label>전화번호 인증:</label>
          <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
          <button type="button" onClick={verifyPhoneNumber} disabled={!isCodeSent}>인증하기</button>
        </div>
        <div>
          <label>Email:</label>
          <input type="text" value={emailUser} onChange={(e) => setEmailUser(e.target.value)} /> @
          <input type="text" value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)} />
        </div>
        <div>
          <label>건설기초안전자격증 번호:</label>
          <input type="text" value={safetyCertificateNumber} onChange={(e) => setSafetyCertificateNumber(e.target.value)} />
        </div>
        <div>
          <label>가입경로:</label>
          <select value={registrationSource} onChange={(e) => setRegistrationSource(e.target.value)}>
            <option value="">선택</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
