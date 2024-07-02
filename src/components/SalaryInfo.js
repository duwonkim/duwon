import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SalaryInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState({});
  const [rate, setRate] = useState('');
  const [workDays, setWorkDays] = useState('');
  const [memo, setMemo] = useState('');
  const [taxRate, setTaxRate] = useState(0); // 세금 퍼센트
  const [displayMode, setDisplayMode] = useState('workDays'); // 공수, 급여, 메모 중 어떤 것을 표시할지 결정
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      alert('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    fetchEntries();
  }, [userId, navigate]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/salary-entries/${userId}`, { withCredentials: true });
      const fetchedEntries = response.data.reduce((acc, entry) => {
        acc[new Date(entry.ENTRY_DATE).toDateString()] = {
          rate: entry.RATE,
          workDays: entry.WORK_DAYS,
          memo: entry.MEMO
        };
        return acc;
      }, {});
      setEntries(fetchedEntries);
      console.log('Fetched entries:', fetchedEntries); // 디버그 로그 추가
    } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생:', error);
      setMessage('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (entries[newDate.toDateString()]) {
      setRate(entries[newDate.toDateString()].rate);
      setWorkDays(entries[newDate.toDateString()].workDays);
      setMemo(entries[newDate.toDateString()].memo);
    } else {
      setRate('');
      setWorkDays('');
      setMemo('');
    }
  };

  const handleSave = async () => {
    const newEntry = {
      user_id: userId,
      entry_date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0], // 수정된 부분
      work_days: workDays,
      rate,
      memo
    };

    try {
      await axios.post('http://localhost:5001/api/salary-entries', newEntry, { withCredentials: true });
      setEntries({
        ...entries,
        [date.toDateString()]: newEntry
      });
      setMessage('데이터가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      setMessage('데이터 저장 중 오류가 발생했습니다.');
    }
  };

  const calculateMonthlyData = () => {
    let totalWorkDays = 0;
    let totalSalary = 0;
    for (const key in entries) {
      totalWorkDays += parseFloat(entries[key].workDays) || 0;
      totalSalary += (parseFloat(entries[key].rate) * parseFloat(entries[key].workDays)) || 0;
    }
    const netSalary = totalSalary * ((100 - taxRate) / 100);
    return {
      totalWorkDays,
      totalSalary,
      netSalary
    };
  };

  const monthlyData = calculateMonthlyData();

  const formatNumber = (number) => {
    return Number(number).toLocaleString();
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const entry = entries[date.toDateString()];
      if (entry) {
        const salary = (parseFloat(entry.rate) * parseFloat(entry.workDays)) || 0;
        return (
          <div>
            {displayMode === 'workDays' && <p>공수: {entry.workDays}</p>}
            {displayMode === 'salary' && <p>급여: {formatNumber(salary)}원</p>}
            {displayMode === 'memo' && <p>메모: {entry.memo}</p>}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <h1>급여 정보 페이지</h1>
      
      <div>
        <button onClick={() => setDisplayMode('workDays')}>공수</button>
        <button onClick={() => setDisplayMode('salary')}>급여</button>
        <button onClick={() => setDisplayMode('memo')}>메모</button>
      </div>

      <div>
        <h2>달력</h2>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent}
        />
      </div>

      <div>
        <h2>데이터 입력</h2>
        <label>
          단가:
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
        <br />
        <label>
          공수:
          <input
            type="number"
            value={workDays}
            onChange={(e) => setWorkDays(e.target.value)}
          />
        </label>
        <br />
        <label>
          메모:
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleSave}>저장</button>
      </div>

      {message && <p>{message}</p>}

      <div>
        <h2>이번달 계산 결과</h2>
        <label>
          세율(%):
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
        </label>
        <p>이번달 공수: {monthlyData.totalWorkDays}</p>
        <p>이번달 급여: {formatNumber(monthlyData.totalSalary)}원</p>
        <p>이번달 정산: {formatNumber(monthlyData.netSalary)}원</p>
      </div>
    </div>
  );
};

export default SalaryInfo;
