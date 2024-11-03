import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, NotFound } from "../../pages";
import Login from "../../pages/login";
import AnswersDetail from "../answersDetail";
import Clasifications from "../clasifications";
import Security from "../security";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Security direction="forward" />}>
          <Route path="/" element={<Home />} />
          <Route path="/clasification" element={<Clasifications myClasification />} />
          <Route path="/clasification/:user" element={<AnswersDetail />} />
          <Route path="/my-clasification" element={<AnswersDetail />} />
        </Route>

        <Route path="/login" element={<Security direction="backward" />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route key="not-found" path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default Routers;
