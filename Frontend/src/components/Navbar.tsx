import { Autocomplete, TextField } from "@mui/material";
import CreateButton from "./CreateButton";
import { useEffect, useState } from "react";
import { CountdownFormat } from "../entity/CountdownFormat";

function Navbar({
  createTimer,
  timers,
  onSelectTimer,
}: Readonly<{
  createTimer?: () => void;
  timers: CountdownFormat[];
  // * It must have option to be null for the use case that user clear the input
  onSelectTimer?: (timer: string | null) => void;
}>) {
  const [timerName, setTimerName] = useState<string[]>([]);

  useEffect(() => {
    setTimerName(timers.map((timer) => timer.title));
  }, [timers]);

  return (
    <div className="text-white flex justify-between items-center p-4">
      {/* ?. is used to check if createTimer is defined */}
      <CreateButton onCreate={() => createTimer?.()} />
      <Autocomplete
        disablePortal
        autoHighlight
        options={timerName}
        sx={{
          width: "200px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
        renderInput={(params) => <TextField {...params} label="Title search" />}
        onChange={(event: React.SyntheticEvent, newValue: string | null) => {
          // * When user select autocomplete option, newValue is the selected option
          if (newValue) {
            onSelectTimer?.(newValue);
          } else {
            // * When user clear the input, newValue is null
            onSelectTimer?.(null);
          }
        }}
      />
    </div>
  );
}

export default Navbar;
