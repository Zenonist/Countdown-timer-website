import "./App.css";
import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import axios from "axios";
import { mock_data } from "./mock/mockData";
import { useEffect, useState } from "react";
import { CountdownFormat } from "./entity/CountdownFormat";

function App() {
  const [countdowns, setCountdowns] = useState<CountdownFormat[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getCountdowns();
  }, []);

  const getCountdowns = () => {
    const URL =
      import.meta.env.VITE_BACKEND_URL + "/" + encodeURIComponent("timer");
    axios
      .get(URL)
      .then((response) => {
        console.log(response.data);
        setCountdowns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCountdowns(mock_data);
      });
  };

  const selectedCountdownData = () => {
    if (selectedTitle && selectedCategory) {
      return countdowns.filter(
        (countdown) =>
          countdown.title === selectedTitle &&
          countdown.category.name === selectedCategory
      );
    } else if (selectedTitle && !selectedCategory) {
      return countdowns.filter(
        (countdown) => countdown.title === selectedTitle
      );
    } else if (!selectedTitle && selectedCategory) {
      return countdowns.filter(
        (countdown) => countdown.category.name === selectedCategory
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <Navbar
        createTimer={() => getCountdowns()}
        timers={countdowns}
        onSelectTimer={(timer: string | null) => {
          setSelectedTitle(timer);
        }}
        onSelectCategory={(category: string | null) => {
          setSelectedCategory(category);
        }}
      />
      <div className="text-transparent text-4xl bg-gradient-to-b from-blue-500 to-purple-700 bg-clip-text p-2">
        Countdown timer website
      </div>
      <div>
        {/* It requires () because it is function */}
        {!selectedCountdownData()
          ? countdowns
              // Show unarchived countdowns first
              // NOTE: Sort works by comparing the boolean values if it is same then return 0 (No change) if a is true and b is false then return 1 (a comes first) if a is false and b is true then return -1 (b comes first)
              .sort((a, b) => (a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1))
              .map((countdown) => (
                <Countdown
                  key={countdown.id}
                  _id={countdown.id}
                  _title={countdown.title}
                  _description={countdown.description}
                  _category={countdown.category}
                  _dueDate={countdown.dueDate}
                  _isArchived={countdown.isArchived}
                  onDelete={() => getCountdowns()}
                  onArchive={() => getCountdowns()}
                />
              ))
          : selectedCountdownData()
              ?.sort((a, b) => (a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1))
              .map((countdown: CountdownFormat) => (
                <Countdown
                  key={countdown.id}
                  _id={countdown.id}
                  _title={countdown.title}
                  _description={countdown.description}
                  _category={countdown.category}
                  _dueDate={countdown.dueDate}
                  _isArchived={countdown.isArchived}
                  onDelete={() => getCountdowns()}
                  onArchive={() => getCountdowns()}
                />
              ))}
      </div>
    </div>
  );
}

export default App;
