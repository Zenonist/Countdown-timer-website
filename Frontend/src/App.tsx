import "./App.css";
import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import axios from "axios";
import { mock_data } from "./mock/mockData";
import { useEffect, useState } from "react";
import { CountdownFormat } from "./entity/CountdownFormat";

function App() {
  const [countdowns, setCountdowns] = useState<CountdownFormat[]>([]);
  const [selectedCountdown, setSelectedCountdown] = useState<string | null>(null);

  useEffect(() => {
    getCountdowns();
  },[])

  const getCountdowns = () => {
    const URL = import.meta.env.VITE_BACKEND_URL + "/" + encodeURIComponent("timer");
    axios.get(URL)
      .then((response) => {
        console.log(response.data);
        setCountdowns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCountdowns(mock_data);
      })
  }

  const selectedCountdownData = countdowns.find(
    (countdown) => countdown.title === selectedCountdown
  );

  return (
    <div>
      <Navbar createTimer={() => getCountdowns()} timers={countdowns} onSelectTimer={
        (timer: string | null) => {
          setSelectedCountdown(timer);
        }
      }/>
      <div className="text-transparent text-4xl bg-gradient-to-b from-blue-500 to-purple-700 bg-clip-text">
        Countdown timer website
      </div>
      <div>
        {!selectedCountdown ? countdowns.map((countdown) => (
          <Countdown
            key={countdown.id}
            _id={countdown.id}
            _title={countdown.title}
            _description={countdown.description}
            _category={countdown.category}
            _dueDate={countdown.dueDate}
            onDelete={() => getCountdowns()}
          />
        )) : ( selectedCountdownData &&
          <Countdown
            _id={selectedCountdownData.id}
            _title={selectedCountdownData.title}
            _description={selectedCountdownData.description}
            _category={selectedCountdownData.category}
            _dueDate={selectedCountdownData.dueDate}
          />
        )}
      </div>
    </div>
  );
}

export default App;
