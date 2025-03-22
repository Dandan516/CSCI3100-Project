// Desc: Main App component
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Portal from './components/Portal/Portal';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

function App() {

  return (
    <Router>
      <Theme accentColor="indigo" grayColor="slate" radius="full" scaling="100%" appearance="dark">
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Theme>
    </Router>
  );

}

export default App

