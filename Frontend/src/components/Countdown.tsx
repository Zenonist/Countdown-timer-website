import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  // Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import TimeFormat from "../entity/TimeFormat";
import { DateTimePicker } from "@mui/x-date-pickers";

function Countdown({
  _title,
  _description,
  // _category,
  _dueDate,
}: {
  _title: string;
  _description: string;
  // _category: string;
  _dueDate: Date;
}) {
  const [title, setTitle] = useState("Test");
  const [description, setDescription] = useState("Test description");
  // const [category, setCategory] = useState("Test category");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeFormat>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // state for dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(_title);
  const [editDescription, setEditDescription] = useState(_description);
  // const [editCategory, setEditCategory] = useState(_category);
  const [editDueDate, setEditDueDate] = useState<Date | null>(_dueDate);

  // const [openDelete, setOpenDelete] = useState(false);

  // Initialize state with props
  useEffect(() => {
    setTitle(_title);
    setDescription(_description);
    // setCategory(_category);
    setDueDate(_dueDate);
    setTimeLeft(calculateTimeLeft(new Date(_dueDate)));
  }, [
    _title, 
    _description, 
    // _category, 
    _dueDate]);

  // Update time left every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(new Date(dueDate as Date));
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days <= 0 &&
        newTimeLeft.hours <= 0 &&
        newTimeLeft.minutes <= 0 &&
        newTimeLeft.seconds <= 0
      ) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  // Function to calculate time left
  const calculateTimeLeft = (dueDate: Date): TimeFormat => {
    const now = new Date();
    const difference = dueDate.getTime() - now.getTime();

    const timeLeft: TimeFormat = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };

    return timeLeft;
  };

  // Function to handle dialog edit
  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === "title") {
      setEditTitle(value);
    } else if (id === "description") {
      setEditDescription(value);
    }
    //  else if (id === "category") {
    //   setEditCategory(value);
    // }
  };

  const handleDateChange = (newDate: Date | null) => {
    setEditDueDate(newDate);
    console.log(newDate?.toISOString());
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Edit form submitted");

    // Prevent default form submission -> prevent page reload which is the default behavior of a form
    event.preventDefault();
    // Update the countdown with the new values
    setTitle(editTitle);
    setDescription(editDescription);
    // setCategory(editCategory);
    setDueDate(editDueDate);
    if (editDueDate) {
      setTimeLeft(calculateTimeLeft(editDueDate));
    } else {
      console.warn("editDueDate is null, using current date as fallback.");
      setTimeLeft(calculateTimeLeft(new Date()));
    }

    // TODO: Add API request to update the countdown in the database

    // Close the dialog after successful submission
    handleCloseEdit();
  };

  return (
    <div className="flex justify-center items-center w-full p-4 md:p-4">
      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          width: "100%",
          maxWidth: "36rem",
        }}
      >
        <CardHeader title={title} />
        <CardContent>
          {!(
            timeLeft.days <= 0 &&
            timeLeft.hours <= 0 &&
            timeLeft.minutes <= 0 &&
            timeLeft.seconds <= 0
          ) ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                my: 3,
              }}
            >
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                my: 3,
              }}
            >
              <Typography variant="h3">Finished</Typography>
            </Box>
          )}
          <div className="text-gray-900">
            <Typography variant="body1">Description: {description}</Typography>
          </div>
          {/* <div className="justify-right">
            <Typography>Category:</Typography>
            <Chip label={category} color="primary" />
          </div> */}
        </CardContent>
        <CardActions>
          <IconButton onClick={handleOpenEdit}>
            <EditIcon />
          </IconButton>
          <Dialog open={openEdit} onClose={handleCloseEdit}>
            <form id="edit-form" onSubmit={handleEditSubmit}>
              <DialogTitle>Edit countdown timer</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To edit the countdown timer, please fill in the form below.
                </DialogContentText>
                {/* Title */}
                <TextField
                  id="title"
                  label="Title"
                  type="text"
                  value={editTitle}
                  fullWidth
                  margin="dense"
                  onChange={handleInputChange}
                />
                {/* Description */}
                <TextField
                  id="description"
                  label="Description"
                  type="text"
                  value={editDescription}
                  fullWidth
                  margin="dense"
                  onChange={handleInputChange}
                />
                {/* Category
                <TextField
                  id="category"
                  label="Category"
                  type="text"
                  value={editCategory}
                  fullWidth
                  margin="dense"
                  onChange={handleInputChange}
                /> */}
                {/* Date picker */}
                <DateTimePicker
                  label="Due date"
                  value={editDueDate}
                  /* slotProps allows passing props to internal components (slots) of the DateTimePicker.
                   Here we're setting the margin="dense" on the internal TextField component to
                   maintain consistent spacing with other form fields. */
                  slotProps={{ textField: { margin: "dense" } }}
                  onChange={handleDateChange}
                />
              </DialogContent>
              <DialogActions>
                <Button type="submit">Edit</Button>
                <Button onClick={handleCloseEdit}>Cancel</Button>
              </DialogActions>
            </form>
          </Dialog>

          <IconButton>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}

export default Countdown;
