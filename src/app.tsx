import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Subjects, SubjectDetail, WrongAnswers, MockExam } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:subject" element={<SubjectDetail />} />
        <Route path="/wrong-answers" element={<WrongAnswers />} />
        <Route path="/mock-exam" element={<MockExam />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
