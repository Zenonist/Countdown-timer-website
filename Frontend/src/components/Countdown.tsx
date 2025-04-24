import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import TimeFormat from "../entity/timeformat";

function Countdown({
    _title,
    _description,
    _category,
    _dueDate,
    }: {
    _title: string;
    _description: string;
    _category: string;
    _dueDate: Date;
    }
) {
  const [title, setTitle] = useState("Test");
  const [description, setDescription] = useState("Test description");
  const [category, setCategory] = useState("Test category");
  const [timeLeft, setTimeLeft] = useState<TimeFormat>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTitle(_title);
    setDescription(_description);
    setCategory(_category);
    setTimeLeft(calculateTimeLeft(new Date(_dueDate)));
  }, [_title, _description, _category, _dueDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(_dueDate)));
    }, 1000);

    return () => clearInterval(interval);
  }, [_dueDate]);

  const calculateTimeLeft = (dueDate: Date): TimeFormat => {
    const now = new Date();
    const difference = dueDate.getTime() - now.getTime();

    const timeLeft: TimeFormat = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };

    return timeLeft;
  }


  return (
    <div className="flex justify-center items-center w-full p-4 md:p-8">
      <Card className="shadow-lg w-full max-w-xl bg-gray-700">
        <CardHeader title={title} />
        <CardContent>
          {!(timeLeft.days == 0 &&
          timeLeft.hours == 0 &&
          timeLeft.minutes == 0 &&
          timeLeft.seconds == 0) ? (
            <Box className="flex justify-center gap-2 my-3 text-blue-500">
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3">{timeLeft.days}</Typography>
                <Typography variant="body2">Days</Typography>
              </Box>
              <Typography variant="h3">:</Typography>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </Typography>
                <Typography variant="body2">Hours</Typography>
              </Box>
              <Typography variant="h3">:</Typography>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </Typography>
                <Typography variant="body2">Minutes</Typography>
              </Box>
              <Typography variant="h3">:</Typography>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </Typography>
                <Typography variant="body2">Seconds</Typography>
              </Box>
            </Box>
          ) : (
            <Box className="flex justify-center gap-2 my-3">
              <Typography variant="h3">Finished</Typography>
            </Box>
          )}
          <div className="text-gray-900">
            <Typography variant="body1">Description: {description}</Typography>
          </div>
          <div className="justify-right">
            <Typography>Category:</Typography>
            <Chip label={category} color="primary" />
          </div>
        </CardContent>
        <CardActions>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}

export default Countdown;