import "./App.css";
import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import axios from "axios";
import { mock_data } from "./mock/mockData";
import { useEffect, useState } from "react";
import { CountdownFormat } from "./entity/CountdownFormat";
import CreateButton from "./components/CreateButton";

function App() {
  const [countdowns, setCountdowns] = useState<CountdownFormat[]>([]);

  useEffect(() => {
    getCountdowns();
  },[])

  const getCountdowns = () => {
    const URL = import.meta.env.VITE_BACKEND_URL + "/" + encodeURIComponent("timer");
    axios.get(URL)
      .then((response) => {
        setCountdowns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCountdowns(mock_data);
      })
  }

  return (
    <div>
      <Navbar />
      <div className="text-transparent text-4xl bg-gradient-to-b from-blue-500 to-purple-700 bg-clip-text">
        Countdown timer website
      </div>
      <div>
        {countdowns.map((countdown) => (
          <Countdown
            key={countdown.id}
            _title={countdown.title}
            _description={countdown.description}
            _category={countdown.category}
            _dueDate={countdown.dueDate}
          />
        ))}
      </div>
      <CreateButton onCreate={() => getCountdowns()}/>
    </div>
  );
}

export default App;
