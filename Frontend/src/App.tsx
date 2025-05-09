import "./App.css";
import Navbar from "./components/Navbar";
import Countdown from "./components/Countdown";
import axios from "axios";
import { mock_data } from "./mock/mockData";
import React, { useEffect, useState } from "react";
import { CountdownFormat } from "./entity/CountdownFormat";
import { Pagination } from "@mui/material";

function App() {
  // * Variable
  const cardsPerPage = 3;

  // * Use state
  const [countdowns, setCountdowns] = useState<CountdownFormat[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const currentCards = (countdowns: CountdownFormat[] | null | undefined) => {
    if (!countdowns) return [];
    const result = countdowns.slice(
      (page - 1) * cardsPerPage,
      page * cardsPerPage
    );
    return result;
  };

  useEffect(() => {
    getCountdowns();
  }, []);

  const getCountdowns = () => {
    // ! Always check that the environment variable is set before fetching the data from the backend because sometime error does not show up that env is not set
    // NOTE: Always implement code to check that the environment variable is set before fetching the data from the backend
    if (import.meta.env.VITE_BACKEND_URL === "" || import.meta.env.VITE_BACKEND_URL === undefined) {
      setCountdowns(mock_data);
      console.log("Environment variable is not set");
      return;
    }
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

  // * Variable for setting the number of pages
  // If there is selected countdown data, then use the selected countdown data for the number of pages
  // Otherwise (when is null in this case), use the total countdown data for the number of pages
  const dataSourceForPageCount = selectedCountdownData() ?? countdowns;
  const totalPages = Math.ceil(dataSourceForPageCount.length / cardsPerPage);

  // Countdown component structure
  const renderCountdown = (countdown: CountdownFormat) => (
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
  );

  // Render countdown list component
  const renderCountdownList = (data: CountdownFormat[]) => {
    if (data.length === 0) {
      return <div className="text-center text-white mt-4">No countdowns available</div>;
    }
    const result = currentCards(data)
    // NOTE: renderCountdown does not need to have () because it will be called automatically by the map function if it has () then it will be called immediately
    return result.sort((a, b) => (a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1)).map(renderCountdown);
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
        {/* Cards */}
        {renderCountdownList(selectedCountdownData() ?? countdowns)}
      </div>
      <div>
        {/* Pagination */}
        <Pagination
          count={totalPages}
          onChange={(_event: React.ChangeEvent<unknown>, page: number) => {
            setPage(page);
          }}
          color="primary"
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            color: "white",
            // Need to change the color of the pagination item instead of pagination (without item in text)
            "& .MuiPaginationItem-root": {
              color: "white",
            },
          }}
          size="large"
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
}

export default App;
