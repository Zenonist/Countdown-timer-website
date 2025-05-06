import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { useState } from "react";

interface CreateButtonProps {
  onCreate?: () => void;
}

export default function CreateButton({ onCreate }: Readonly<CreateButtonProps>) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setDueDate(new Date());
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {  
    setCategory(event.target.value);
  }

  const handleCreateCountdown = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitted:", { title, description, dueDate });

    const URL =
      import.meta.env.VITE_BACKEND_URL + "/" + encodeURIComponent("timer");

    axios
      .post(URL, {
        title: title,
        description: description,
        categoryName: category,
        dueDate: dueDate,
      }).then((response) => {
        console.log("Response:", response.data);
        handleClose();
        // Check that onCreate is existed
        if (onCreate) {
          onCreate();
        }
      }).catch((error) => {
        console.error("Error creating countdown:", error);
        handleClose();
      });
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add new countdown
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form id="create-form" onSubmit={handleCreateCountdown}>
          <DialogTitle>Create new countdown timer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Insert information for the new countdown timer.
            </DialogContentText>
            {/* Title */}
            <TextField
              id="title"
              label="Title"
              type="text"
              value={title}
              fullWidth
              margin="dense"
              onChange={handleTitleChange}
            />
            {/* Description */}
            <TextField
              id="description"
              label="Description"
              type="text"
              value={description}
              fullWidth
              margin="dense"
              onChange={handleDescriptionChange}
            />
            {/* Category */}
            <TextField
              id="category"
              label="Category"
              type="text"
              value={category}
              fullWidth
              margin="dense"
              onChange={handleCategoryChange}
            />
            {/* Date picker */}
            <DateTimePicker
              label="Due date"
              value={dueDate}
              /* slotProps allows passing props to internal components (slots) of the DateTimePicker.
                   Here we're setting the margin="dense" on the internal TextField component to
                   maintain consistent spacing with other form fields. */
              slotProps={{ textField: { margin: "dense" } }}
              onChange={setDueDate}
            />
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
              type="submit"
              form="create-form"
            >
              Create
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
