import logo from './logo.svg';
import './App.css';
import Homepage from './Components/Homepage';
import Logs from './Components/Mongo';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './Components/Navbar';
import Redis from './Components/Redis';
import Tidb from './Components/Tidb';
import GraficaTop from './Components/GraficaTop';
import Playerstidb from './Components/Playerstidb';


function App() {
  return (
    <Router>
    <div className="app-container">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/Mongo" element={<Logs/>} />
        <Route path="/Redis" element={<Redis/>} />
        <Route path="/Tidb" element={<Tidb/>} />
        <Route path="/top10" element={<GraficaTop/>} />
        <Route path="/TidbStats" element={<Playerstidb/>} />


      </Routes>
     
    </div>
  </Router>
  );
}

export default App;
