import React from 'react';
import 'toastr/build/toastr.min.css';
import './App.scss';
import KanBan from "./components/kanban/Kanban";

function App() {
  return (
    <div className="App d-flex flex-column">
      <KanBan />
    </div>
  );
}

export default App;
