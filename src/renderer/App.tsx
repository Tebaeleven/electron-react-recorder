import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

function Hello() {
  const [imageData, setImageData] = useState('');

  const [windowList, setWindowList] = useState(['']);
  const [selectedWindow, setSelectedWindow] = useState();
  async function getWindowData() {
    const thumbnails = await screenshot.getWindowThumbnail();
    setImageData(thumbnails);
    console.log(thumbnails);
  }
  async function setSource(id) {
    await screenshot.setSource(id);

  }
  useEffect(() => {
    getWindowData();
  }, []);
  return (
    <div style={{display:"flex"}}>
      <div >
      {Object.entries(imageData).map(([key, value]) => (
        <div key={key}>
          <img
            src={value.dataURL}
            alt=""
            style={{ width: '200px' }}
            onClick={() => setSource(value.id)}
          />
          <p>
            {value.name} | {value.id}
          </p>
        </div>
      ))}
      <button id="startBtn" onClick={setSource} type="button">
        画面情報を取得
      </button>
      <button id="startBtn" type="button">
        Start
      </button>
      <button id="stopBtn">Stop</button>
      <select
        value={selectedWindow}
        onChange={(e) => setSelectedWindow(e.target.value)}
      >
        <option>画面を選択</option>
        {windowList.map((window) => (
          <option key={window.id} value={window.id}>
            {window.name}
          </option>
        ))}
      </select>
      {selectedWindow}

      </div>
      <div>
      <video></video>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
