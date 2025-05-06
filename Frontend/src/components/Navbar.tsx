import { Autocomplete, TextField } from "@mui/material";
import CreateButton from "./CreateButton";
import { useEffect, useState } from "react";
import { CountdownFormat } from "../entity/CountdownFormat";

function Navbar({
  createTimer,
  timers,
  onSelectTimer,
  onSelectCategory,
}: Readonly<{
  createTimer?: () => void;
  timers: CountdownFormat[];
  // * It must have option to be null for the use case that user clear the input
  onSelectTimer?: (timer: string | null) => void;
  onSelectCategory?: (category: string | null) => void;
}>) {
  const [timerName, setTimerName] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setTimerName(timers.map((timer) => timer.title));
    // Extract unique categories from timers
    const uniqueCategories = Array.from(
      // Get a list of categories from the timers first then use Set to remove duplicates
      new Set(timers.map((timer) => timer.category.name))
    );
    setCategories(uniqueCategories);
  }, [timers]);

  return (
    <div className="text-white flex justify-between items-center p-4">
      {/* ?. is used to check if createTimer is defined */}
      <CreateButton onCreate={() => createTimer?.()} />
      {/* flex gap-3 is used to create space between the autocomplete and the create button */}
      <div className="flex gap-3">
        <Autocomplete
          disablePortal
          autoHighlight
          options={timerName}
          sx={{
            width: "200px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
          renderInput={(params) => (
            <TextField {...params} label="Title search" />
          )}
          onChange={(_, newValue: string | null) => {
            // * When user select autocomplete option, newValue is the selected option
            if (newValue) {
              onSelectTimer?.(newValue);
            } else {
              // * When user clear the input, newValue is null
              onSelectTimer?.(null);
            }
          }}
        />
        <Autocomplete
          disablePortal
          autoHighlight
          options={categories}
          sx={{
            width: "200px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
          renderInput={(params) => (
            <TextField {...params} label="Category search" />
          )}
          onChange={(_, newValue: string | null) => {
            if (newValue) {
              onSelectCategory?.(newValue);
            } else {
              onSelectCategory?.(null);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Navbar;
