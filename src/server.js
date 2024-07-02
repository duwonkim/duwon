const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');
const session = require('express-session');

const app = express();
const port = 5001;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // 클라이언트의 주소
  credentials: true // 쿠키를 허용합니다.
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // HTTPS를 사용하는 경우 true로 설정
    httpOnly: false, // 클라이언트 자바스크립트에서 쿠키에 접근할 수 있도록 설정
    maxAge: 1000 * 60 * 30 // 30분 동안 유효
  }
}));

// Oracle DB 연동 connection
async function initOracleClient() {
  try {
    await oracledb.createPool({
      user: 'kim', // or another valid user
      password: '1234', // 실제 비밀번호로 변경
      connectString: 'localhost:1521/XE' // or 'localhost:1521/xepdb1'
    });
    console.log('Oracle DB에 연결되었습니다');
  } catch (err) {
    console.error('Oracle DB에 연결하는 중 오류 발생', err.message);
  }
}

initOracleClient();

// 회원가입
app.post('/api/users', async (req, res) => {
  const { userId, name, password, birthDate, phoneNumber, carrier, email, safetyCertificateNumber, registrationSource } = req.body;
  
  console.log("받은 데이터:", req.body); 

  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `INSERT INTO User_Registration (
        user_id, name, password, birth_date, phone_number, carrier, email, safety_certificate_number, registration_source
      ) VALUES (
        :userId, :name, :password, TO_DATE(:birthDate, 'YYYY-MM-DD'), :phoneNumber, :carrier, :email, :safetyCertificateNumber, :registrationSource
      )`,
      {
        userId,
        name,
        password,
        birthDate,
        phoneNumber,
        carrier,
        email,
        safetyCertificateNumber,
        registrationSource
      },
      { autoCommit: true }
    );
    res.status(200).json({ message: '사용자가 성공적으로 추가되었습니다', result });
  } catch (err) {
    console.error("오류 세부 정보:", err.message);
    res.status(500).send('사용자를 Oracle DB에 삽입하는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});

// 로그인 API 엔드포인트
app.post('/api/login', async (req, res) => {
  const { userId, password } = req.body;
  console.log("로그인 요청 데이터:", req.body); 
  let connection;

  try{
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM User_Registration WHERE user_id = :userId AND password = :password`,
      { userId, password },
      { outFormat: oracledb.OUT_FORMAT_OBJECT } 
    );
    console.log("로그인 쿼리 결과:", result); // 쿼리 결과 로그 추가

    if (result.rows.length > 0) {
      const user = result.rows[0];
      req.session.user = user;
      console.log("세션에 저장된 사용자 정보:", req.session.user);
      res.status(200).json({ message: '로그인 성공', user });
    } else {
      res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다' });
    }
  } catch (err) {
    console.error("로그인 중 오류 발생:", err.message);
    res.status(500).send('로그인 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});

// 로그아웃 API 엔드포인트
app.post('/api/logout', (req, res) => {
  if (req.session) {
    // 세션을 파괴
    req.session.destroy(err => {
      if (err) {
        console.error('로그아웃 중 오류 발생:', err.message);
        return res.status(500).send('로그아웃 중 오류 발생');
      } else {
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제
        res.status(200).json({ message: '로그아웃 성공' });
      }
    });
  } else {
    res.status(200).json({ message: '로그아웃 성공' });
  }
});

// 사용자 정보를 불러오는 API 엔드포인트
app.get('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM User_Registration WHERE user_id = :userId`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
  } catch (err) {
    console.error("사용자 정보 불러오는 중 오류 발생:", err.message);
    res.status(500).send('사용자 정보 불러오는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 사용자 정보를 수정하는 API 엔드포인트
app.put('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const {
    NAME,
    PASSWORD,
    BIRTH_DATE,
    PHONE_NUMBER,
    CARRIER,
    EMAIL,
    SAFETY_CERTIFICATE_NUMBER,
    REGISTRATION_SOURCE
  } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection();

    const result = await connection.execute(
      `UPDATE User_Registration
       SET
         NAME = :name,
         PASSWORD = :password,
         BIRTH_DATE = TO_DATE(:birth_date, 'YYYY-MM-DD'),
         PHONE_NUMBER = :phone_number,
         CARRIER = :carrier,
         EMAIL = :email,
         SAFETY_CERTIFICATE_NUMBER = :safety_certificate_number,
         REGISTRATION_SOURCE = :registration_source
       WHERE USER_ID = :user_id`,
      {
        name: NAME,
        password: PASSWORD,
        birth_date: BIRTH_DATE,
        phone_number: PHONE_NUMBER,
        carrier: CARRIER,
        email: EMAIL,
        safety_certificate_number: SAFETY_CERTIFICATE_NUMBER,
        registration_source: REGISTRATION_SOURCE,
        user_id: userId
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      res.status(404).send('사용자를 찾을 수 없습니다.');
    } else {
      res.status(200).json({ message: '사용자 정보가 성공적으로 업데이트되었습니다' });
    }
  } catch (err) {
    console.error('사용자 정보 수정 중 오류 발생:', err.message);
    res.status(500).send('사용자 정보 수정 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});







// 사용자 삭제 API 엔드포인트
app.delete('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `DELETE FROM User_Registration WHERE user_id = :userId`,
      { userId },
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.status(200).json({ message: '사용자가 성공적으로 삭제되었습니다' });
    } else {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
  } catch (err) {
    console.error("사용자 삭제 중 오류 발생:", err.message);
    res.status(500).send('사용자 삭제 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});

// 일자리 찾기 등록 데이터 저장 API 엔드포인트
app.post('/api/job_registration', async (req, res) => {
  const {
    phone_number, title, job_category, rate, job_date,
    start_time, end_time, location, personnel, description
  } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `INSERT INTO job_registration (
        phone_number, title, job_category, rate, job_date,
        start_time, end_time, location, personnel, description, created_at
      ) VALUES (
        :phone_number, :title, :job_category, :rate, TO_DATE(:job_date, 'YYYY-MM-DD'),
        :start_time, :end_time, :location, :personnel, :description, SYSDATE
      )`,
      {
        phone_number, title, job_category, rate, job_date,
        start_time, end_time, location, personnel, description
      },
      { autoCommit: true }
    );

    res.status(200).json({ message: '일자리가 성공적으로 등록되었습니다', result });
  } catch (err) {
    console.error('일자리 등록 중 오류 발생:', err.message);
    res.status(500).send('일자리 등록 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 전체 일자리 데이터를 가져오는 API 엔드포인트 (페이징 및 검색 지원)
app.get('/api/jobs', async (req, res) => {
  const { searchCategory = '', page = 1, limit = 10 } = req.query;  // 기본값 설정

  let connection;
  try {
    connection = await oracledb.getConnection();
    
    // 전체 데이터 수 구하기
    const countResult = await connection.execute(
      `SELECT COUNT(*) AS total FROM job_registration WHERE job_category LIKE :searchCategory`,
      { searchCategory: `%${searchCategory}%` },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const totalJobs = countResult.rows[0].TOTAL;
    const totalPages = Math.ceil(totalJobs / limit);

    // 페이지네이션 적용된 데이터 가져오기
    const offset = (page - 1) * limit;
    const result = await connection.execute(
      `SELECT phone_number, title, job_category, rate, location, TO_CHAR(created_at, 'YYYY-MM-DD') as created_at
       FROM job_registration
       WHERE job_category LIKE :searchCategory
       ORDER BY created_at DESC
       OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
      { searchCategory: `%${searchCategory}%`, offset, limit },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('일자리 데이터:', result.rows); // 데이터 로그 추가
    res.status(200).json({ jobs: result.rows, totalPages });
  } catch (err) {
    console.error('일자리 데이터를 불러오는 중 오류 발생:', err.message);
    res.status(500).send('일자리 데이터를 불러오는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});



// 특정 전화번호에 대한 일자리 데이터를 가져오는 API 엔드포인트
app.get('/api/jobs/:phone_number', async (req, res) => {
  let connection;
  const phoneNumber = req.params.phone_number;
  console.log('전달된 전화번호:', phoneNumber); // 전달된 전화번호 로그 추가

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT phone_number, title, job_category, rate, job_date, start_time, end_time, location, personnel , description , created_at
       FROM job_registration 
       WHERE phone_number = :phone_number`,
      { phone_number: phoneNumber },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const jobs = result.rows;

    if (jobs.length === 0) {
      console.log('해당 전화번호에 대한 데이터가 없습니다.');
      res.status(404).send('해당 전화번호에 대한 데이터가 없습니다.');
    } else {
      console.log('일자리 데이터:', jobs); // 데이터 로그 추가
      res.status(200).json(jobs);
    }
  } catch (err) {
    console.error('일자리 데이터를 불러오는 중 오류 발생:', err.message);
    res.status(500).send('일자리 데이터를 불러오는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 새로운 글 작성 데이터를 저장하는 API 엔드포인트
app.post('/api/posts', async (req, res) => {
  const { title, content, author } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `INSERT INTO community (title, content, created_at, likes, dislikes, author) 
       VALUES (:title, :content, SYSDATE, 0, 0, :author)`,
      { title, content, author },
      { autoCommit: true }
    );

    res.status(201).json({ message: '글이 성공적으로 작성되었습니다', result });
  } catch (err) {
    console.error('글 작성 중 오류가 발생했습니다:', err.message);
    res.status(500).send('글 작성 중 오류가 발생했습니다');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});

// 커뮤니티  데이터를 가져오는 API 엔드포인트
app.get('/api/community', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // 기본값 설정

  let connection;

  try {
    connection = await oracledb.getConnection();
    
    // 전체 데이터 수 구하기
    const countResult = await connection.execute(
      `SELECT COUNT(*) AS total FROM community`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const totalPosts = countResult.rows[0].TOTAL;
    const totalPages = Math.ceil(totalPosts / limit);

    // 페이지네이션 적용된 데이터 가져오기
    const offset = (page - 1) * limit;
    const result = await connection.execute(
      `SELECT id, title, created_at, likes FROM community ORDER BY created_at DESC OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
      { offset, limit },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('커뮤니티 데이터:', result.rows); // 데이터 로그 추가
    res.status(200).json({ posts: result.rows, totalPages });
  } catch (err) {
    console.error('커뮤니티 데이터를 불러오는 중 오류 발생:', err.message);
    res.status(500).send('커뮤니티 데이터를 불러오는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 글의 상세 데이터를 가져오는 API 엔드포인트
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT id, title, content, created_at, likes, dislikes, author FROM community WHERE id = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('해당 글을 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('글 데이터를 불러오는 중 오류 발생:', err.message);
    res.status(500).send('글 데이터를 불러오는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});

// 글에 좋아요를 추가하는 API 엔드포인트
app.post('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `UPDATE community SET likes = likes + 1 WHERE id = :id`,
      { id },
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.status(200).send('좋아요가 추가되었습니다.');
    } else {
      res.status(404).send('해당 글을 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('좋아요 중 오류 발생:', err.message);
    res.status(500).send('좋아요 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});

// 글에 싫어요를 추가하는 API 엔드포인트
app.post('/api/posts/:id/dislike', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `UPDATE community SET dislikes = dislikes + 1 WHERE id = :id`,
      { id },
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.status(200).send('싫어요가 추가되었습니다.');
    } else {
      res.status(404).send('해당 글을 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('싫어요 중 오류 발생:', err.message);
    res.status(500).send('싫어요 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 이력서 등록
app.post('/api/resumes', async (req, res) => {
  const {
    user_id, name, birth_date, safety_certificate_number, address, phone_number, email, field, site_experience,
    blood_type, wears_glasses, emergency_contact, emergency_contact_relationship, bank_name, bank_account_number,
    safety_shoes_size, vest_size
  } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `INSERT INTO resume (
        user_id, name, birth_date, safety_certificate_number, address, phone_number, email, field, site_experience,
        blood_type, wears_glasses, emergency_contact, emergency_contact_relationship, bank_name, bank_account_number,
        safety_shoes_size, vest_size
      ) VALUES (
        :user_id, :name, TO_DATE(:birth_date, 'YYYY-MM-DD'), :safety_certificate_number, :address, :phone_number, :email, :field, :site_experience,
        :blood_type, :wears_glasses, :emergency_contact, :emergency_contact_relationship, :bank_name, :bank_account_number,
        :safety_shoes_size, :vest_size
      )`,
      {
        user_id, name, birth_date, safety_certificate_number, address, phone_number, email, field, site_experience, blood_type,
        wears_glasses, emergency_contact, emergency_contact_relationship, bank_name, bank_account_number, safety_shoes_size, vest_size
      },
      { autoCommit: true }
    );
    res.status(200).json({ message: '이력서가 성공적으로 등록되었습니다', result });
  } catch (err) {
    console.error("이력서 등록 중 오류 발생:", err.message);
    res.status(500).send('이력서를 등록하는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});

// 이력서 데이터를 특정 사용자 ID로 가져오는 API 엔드포인트
app.get('/api/resumes/:user_id', async (req, res) => {
  const { user_id } = req.params;
  console.log(`요청받은 user_id: ${user_id}`);
  let connection;

  try {
    connection = await oracledb.getConnection();
    console.log('데이터베이스 연결 성공');

    const result = await connection.execute(
      `SELECT * FROM resume WHERE user_id = :user_id`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('쿼리 실행 결과:', result);

    if (result.rows.length > 0) {
      console.log('이력서 데이터 발견:', result.rows);
      res.status(200).json(result.rows);
    } else {
      console.log('해당 사용자의 이력서를 찾을 수 없습니다.');
      res.status(404).send('해당 사용자의 이력서를 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('이력서 데이터를 불러오는 중 오류 발생:', err.message);
    res.status(500).send('이력서 데이터를 불러오는 중 오류 발생');
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('데이터베이스 연결 닫힘');
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 급여 정보 저장 API 엔드포인트
app.post('/api/salary-entries', async (req, res) => {
  const { user_id, entry_date, work_days, rate, memo } = req.body;
  
  console.log("받은 급여 데이터:", req.body);

  if (!user_id) {
    console.error("user_id가 누락되었습니다.");
    return res.status(400).send('user_id가 누락되었습니다.');
  }

  let connection;

  try {
    connection = await oracledb.getConnection();

    // 먼저 해당 날짜에 데이터가 있는지 확인
    const checkExisting = await connection.execute(
      `SELECT COUNT(*) AS count FROM salary_entries WHERE user_id = :user_id AND entry_date = TO_DATE(:entry_date, 'YYYY-MM-DD')`,
      { user_id, entry_date },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const count = checkExisting.rows[0].COUNT;

    if (count > 0) {
      // 데이터가 이미 존재하면 업데이트
      const result = await connection.execute(
        `UPDATE salary_entries SET work_days = :work_days, rate = :rate, memo = :memo WHERE user_id = :user_id AND entry_date = TO_DATE(:entry_date, 'YYYY-MM-DD')`,
        { user_id, entry_date, work_days, rate, memo },
        { autoCommit: true }
      );
      console.log('급여 데이터 업데이트 결과:', result);
      res.status(200).send('데이터가 성공적으로 업데이트되었습니다.');
    } else {
      // 데이터가 존재하지 않으면 새로 삽입
      const result = await connection.execute(
        `INSERT INTO salary_entries (
          entry_id, user_id, entry_date, work_days, rate, memo
        ) VALUES (
          salary_entries_seq.NEXTVAL, :user_id, TO_DATE(:entry_date, 'YYYY-MM-DD'), :work_days, :rate, :memo
        )`,
        { user_id, entry_date, work_days, rate, memo },
        { autoCommit: true }
      );
      console.log('급여 데이터 저장 결과:', result);
      res.status(200).send('데이터가 성공적으로 저장되었습니다.');
    }
  } catch (err) {
    console.error("데이터 저장 중 오류 발생:", err.message);
    res.status(500).send('데이터 저장 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('데이터베이스 연결 닫힘');
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 급여 정보 불러오는 API 엔드포인트
app.get('/api/salary-entries/:userId', async (req, res) => {
  const { userId } = req.params;
  
  console.log(`요청받은 사용자 ID: ${userId}`);

  let connection;

  try {
    connection = await oracledb.getConnection();
    console.log('데이터베이스 연결 성공');

    const result = await connection.execute(
      `SELECT * FROM salary_entries WHERE user_id = :user_id`,
      { user_id: userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('쿼리 결과:', result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('데이터를 불러오는 중 오류 발생:', err);
    res.status(500).json({ error: '데이터를 불러오는 중 오류 발생' });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('데이터베이스 연결 닫힘');
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err);
      }
    }
  }
});


// 새로운 QnA 데이터를 저장하는 API 엔드포인트
app.post('/api/qna', async (req, res) => {
  const { userId, title, question } = req.body;

  // 요청 본문 디버깅
  console.log("QnA 요청 데이터:", req.body);

  if (!userId || !title || !question) {
    console.error("필수 필드 누락");
    return res.status(400).send('모든 필드를 입력해주세요.');
  }

  let connection;

  try {
    // 데이터베이스 연결 시도
    connection = await oracledb.getConnection();
    console.log("데이터베이스 연결 성공");

    // QnA 데이터 삽입
    const result = await connection.execute(
      `INSERT INTO QNA (USER_ID, TITLE, QUESTION, CREATED_AT)
       VALUES (:userId, :title, :question, CURRENT_TIMESTAMP)`,
      { userId, title, question },
      { autoCommit: true }
    );

    // 삽입 결과 디버깅
    console.log("QnA 데이터 삽입 결과:", result);

    res.status(200).json({ message: '문의사항이 성공적으로 제출되었습니다.', result });
  } catch (err) {
    console.error('문의사항 제출 중 오류 발생:', err.message);
    res.status(500).send('문의사항 제출 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("데이터베이스 연결 닫힘");
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});


// 모든 QnA 데이터를 불러오는 API 엔드포인트
app.get('/api/qna', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection();
    console.log("데이터베이스 연결 성공");

    const result = await connection.execute(
      `SELECT USER_ID, TITLE, QUESTION, CREATED_AT, RESPONSE FROM QNA`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log("QnA 데이터 조회 결과:", result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('QnA 데이터를 불러오는 중 오류 발생:', err.message);
    res.status(500).send('QnA 데이터를 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("데이터베이스 연결 닫힘");
      } catch (err) {
        console.error('연결을 닫는 중 오류 발생:', err.message);
      }
    }
  }
});





app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다`);
});
