import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import { Home, Subjects, SubjectDetail, WrongAnswers, MockExam } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:subject" element={<SubjectDetail />} />
          <Route path="/wrong-answers" element={<WrongAnswers />} />
          <Route path="/mock-exam" element={<MockExam />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
