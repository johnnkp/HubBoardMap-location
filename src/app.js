import { BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./login";
import User from "./user";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<User />} />
          {/* <Route path="/admin/home" element={<Admin />} /> */}|
        </Routes>
    </BrowserRouter>
  );
}

export default App;
