import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, ScrollToTop } from "./components";
import { Home, Theory, Quiz, MockExam, SubjectQuiz, QuizDetail, SubjectTheory, TheoryDetail, WrongAnswers } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/theory" element={<Theory />} />
          <Route path="/theory/:subject" element={<SubjectTheory />} />
          <Route path="/theory/:subject/:postId" element={<TheoryDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:subject" element={<SubjectQuiz />} />
          <Route path="/quiz/:subject/:chapter" element={<QuizDetail />} />
          <Route path="/wrong-answers" element={<WrongAnswers />} />
          <Route path="/mock-exam" element={<MockExam />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
