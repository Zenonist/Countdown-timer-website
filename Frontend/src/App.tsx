import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Button from "@mui/material/Button";
import Countdown from "./components/Countdown";
import { mock_data } from "./mock/mockData";

function App() {
  return (
    <div>
      <Navbar />
      <div className="text-transparent text-4xl bg-gradient-to-b from-blue-500 to-purple-700 bg-clip-text">
        Countdown timer website
      </div>
      <div>
        {mock_data.map((countdown) => (
          <Countdown
            key={countdown.id}
            _title={countdown.title}
            _description={countdown.description}
            _category={countdown.category}
            _dueDate={countdown.dueDate}
          />
        ))}

        <Button variant="outlined">Add new countdown</Button>
      </div>
    </div>
  );
}

export default App;
