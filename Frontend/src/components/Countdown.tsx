import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import { useEffect, useState } from "react";
import TimeFormat from "../entity/TimeFormat";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import CategoryFormat from "../entity/CategoryFormat";

function Countdown({
  _id,
  _title,
  _description,
  _category,
  _dueDate,
  _isArchived,
  onDelete,
  onArchive,
}: {
  _id: number;
  _title: string;
  _description: string;
  _category: CategoryFormat;
  _dueDate: Date;
  _isArchived: boolean;
  onDelete?: () => void;
  onArchive?: () => void;
}) {
  const [title, setTitle] = useState("Test");
  const [description, setDescription] = useState("Test description");
  const [category, setCategory] = useState<CategoryFormat>({
    id: 0,
    name: "",
    color: "",
  });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isArchived, setIsArchived] = useState(false);
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
  // * editCategory is a string because we want to edit the category name (color will be handled by the backend)
  const [editCategory, setEditCategory] = useState(_category.name);
  const [editDueDate, setEditDueDate] = useState<Date>(_dueDate);

  const [openDelete, setOpenDelete] = useState(false);

  // Initialize state with props
  useEffect(() => {
    setTitle(_title);
    setDescription(_description);
    setCategory(_category);
    setDueDate(_dueDate);
    setTimeLeft(calculateTimeLeft(new Date(_dueDate)));
    setIsArchived(_isArchived);
  }, [_title, _description, _category, _dueDate, _isArchived]);

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
    // If dueDate is not a Date object, convert it to a Date object (this is to handle the case where the dueDate is a string)
    const dueDateFormatted = dueDate instanceof Date ? dueDate : new Date(dueDate);
    const difference = dueDateFormatted.getTime() - now.getTime();

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
    } else if (id === "category") {
      setEditCategory(value);
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setEditDueDate(newDate as Date);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission -> prevent page reload which is the default behavior of a form
    event.preventDefault();

    // If editDueDate is a Date object, convert it to a string
    // Otherwise, convert it to a string using new Date(editDueDate) 
    // NOTE: if there is no change in dueDate when user edits the countdown (The system returns string instead of Date object)
    const dateToSend = editDueDate instanceof Date 
    ? editDueDate.toISOString() 
    : new Date(editDueDate).toISOString();

    axios
      .patch(
        import.meta.env.VITE_BACKEND_URL +
          "/" +
          encodeURIComponent("timer") +
          "/" +
          encodeURIComponent(_id),
        {
          title: editTitle,
          description: editDescription,
          categoryName: editCategory,
          dueDate: dateToSend,
        }
      )
      .then((response) => {
        // Update the countdown with the new values
        setTitle(editTitle);
        setDescription(editDescription);
        setCategory({
          id: response.data.category.id,
          name: editCategory,
          color: response.data.category.color,
        });
        setDueDate(editDueDate);
        if (editDueDate) {
          setTimeLeft(calculateTimeLeft(editDueDate));
        } else {
          console.warn("editDueDate is null, using current date as fallback.");
          setTimeLeft(calculateTimeLeft(new Date()));
        }
        handleCloseEdit();
      })
      .catch((error: unknown) => {
        console.error("Error updating countdown:", error);
        handleCloseEdit();
      });
  };

  const deleteCountdown = () => {
    axios
      .delete(
        import.meta.env.VITE_BACKEND_URL +
          "/" +
          encodeURIComponent("timer") +
          "/" +
          encodeURIComponent(_id),
        {}
      )
      .then(() => {
        console.log("Countdown deleted");
        if (onDelete) {
          onDelete();
        }
        setOpenDelete(false);
      })
      .catch((error: unknown) => {
        console.error("Error deleting countdown:", error);
        setOpenDelete(false);
      });
  };

  const archiveCountdown = () => {
    axios
      .patch(
        import.meta.env.VITE_BACKEND_URL +
          "/" +
          encodeURIComponent("timer") +
          "/" +
          encodeURIComponent(_id),
        {
          isArchived: true,
        }
      )
      .then(() => {
        setIsArchived(true);
        if (onArchive) {
          onArchive();
        }
      })
      .catch((error: unknown) => {
        console.error("Error archiving countdown:", error);
      });
  };

  const unarchiveCountdown = () => {
    axios
      .patch(
        import.meta.env.VITE_BACKEND_URL +
          "/" +
          encodeURIComponent("timer") +
          "/" +
          encodeURIComponent(_id),
        {
          isArchived: false,
        }
      )
      .then(() => {
        setIsArchived(false);
        if (onArchive) {
          onArchive();
        }
      })
      .catch((error: unknown) => {
        console.error("Error unarchiving countdown:", error);
      });
  };

  return (
    <div className="flex justify-center items-center w-full p-4 md:p-4">
      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          width: "100%",
          maxWidth: "36rem",
          boxShadow: `0 0 25px 10px ${category.color}`,
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
          {/* flex items-center justify-center is used to center the category name and the chip in the same line*/}
          <div className="flex items-center justify-center">
            <Typography>Category: </Typography>
            <Chip
              label={category.name}
              sx={{
                backgroundColor: category.color,
                color: "white",
              }}
            />
          </div>
        </CardContent>
        <CardActions>
          <Tooltip title="Edit countdown timer">
            <IconButton onClick={handleOpenEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
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
                {/* Category */}
                <TextField
                  id="category"
                  label="Category"
                  type="text"
                  value={editCategory}
                  fullWidth
                  margin="dense"
                  onChange={handleInputChange}
                />
                {/* Date picker */}
                <DateTimePicker
                  label="Due date"
                  value={editDueDate instanceof Date ? editDueDate : new Date(editDueDate)}
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
          <Tooltip title="Delete countdown timer">
            <IconButton onClick={() => setOpenDelete(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
            <DialogTitle>Delete countdown timer</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this countdown timer?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                }}
                variant="contained"
                onClick={deleteCountdown}
              >
                Delete
              </Button>
              <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
          {/* && is used only if only one of the conditions is true and the other is false will not render anything */}
          {/* ? is used to check if the condition is true or false (both conditions are true ) */}
          {!isArchived ? (
            <Tooltip title="Archive countdown timer">
              <IconButton onClick={archiveCountdown}>
                <ArchiveIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Unarchive countdown timer">
              <IconButton onClick={unarchiveCountdown}>
                <UnarchiveOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </div>
  );
}

export default Countdown;
