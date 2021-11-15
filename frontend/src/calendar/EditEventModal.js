import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { MenuItem } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Checkbox } from '@mui/material';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import axios from 'axios';
import moment from "moment";

export default function EditEventModal ({clicked, events, setEvents, setModal}) { 
    const [startDate, setStartDate] = React.useState(clicked.start);
    const [endDate, setEndDate] = React.useState(clicked.end);
    const [category, setCategory] = React.useState(clicked.category);
    const [important, setImportance] = React.useState(clicked.importance);
    const [title, setTitle] = React.useState(clicked.title);
    const [description, setDescription] = React.useState(clicked.description);
    const [doNotPush, setDoNotPush] = React.useState(clicked.doNotPush);

    function handleClose() {
        setModal(false)
    }

    const handleChangeStartDate = (date) => {
        setStartDate(date);
    };

    const handleChangeEndDate = (date) => {
        setEndDate(date);
    };

    const handleChangeDoNotPush = () => {
        setDoNotPush(!doNotPush)
    }

    const handleChangeCategory = (cat) => {
        setCategory(cat.target.value);
      };

    const handleChangeImportance = (im) => {
        setImportance(im.target.value);
      };

    async function deleteEvent(){
        try {
            const response = await axios.delete('http://localhost:5000/todos/' + clicked._id);
            if(response.status === 204){
                events = events.filter(e => e._id !== clicked._id)
                setEvents([...events])
            }
            else {
                console.log("Error, event not deleted from database.")
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    async function updateEvent(){
        const event = {
            title: title,
            start: doNotPush ? new Date(startDate) : moment(new Date(startDate)).subtract(important, 'day'),
            end: doNotPush ? new Date(endDate) : moment(new Date(endDate)).subtract(important, 'day'),
            description: description,
            importance: important,
            givenStart: new Date(startDate),
            givenEnd: new Date(endDate),
            category: category,
            doNotPush: doNotPush,
            completed: false
        }
        try {
            const response = await axios.put('http://localhost:5000/todos/' + clicked._id, event);
            if(response.status === 204){
                events = events.filter(e => e._id !== clicked._id)
                event["_id"] = clicked._id
                setEvents([...events, event])
            }
            else {
                console.log("Error, event not deleted from database.")
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    const handleDelete = () => {
        deleteEvent()
        setModal(false)
    }

    const handleUpdate = () => {
        updateEvent()
        setModal(false)
    }

    const importance = [
        {
          value: 1,
          label: '!',
        },
        {
          value: 3,
          label: '!!',
        },
        {
          value: 5,
          label: '!!!',
        },
        {
          value: 7,
          label: '!!!!',
        },
      ];

      const categories = [
        {
          value: 'School',
          label: 'School',
        },
        {
          value: 'Work',
          label: 'Work',
        },
        {
          value: 'Other',
          label: 'Other',
        },
      ];

    return (
        <div>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent >
                <DialogContentText style={{marginBottom: "30px"}}>
                    Please modify the information below to edit the event!
                </DialogContentText>
                <DateTimePicker
                    label="Start"
                    value={startDate}
                    onChange={handleChangeStartDate}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                    label="End"
                    value={endDate}
                    onChange={handleChangeEndDate}
                    renderInput={(params) => <TextField {...params} />}
                />
                <FormGroup style={{marginBottom: "30px"}}>
                    <FormControlLabel control=
                        {<Checkbox
                             checked={doNotPush}
                             onChange={handleChangeDoNotPush}   
                        />} label="Do NOT Push Up Date" />
                </FormGroup>
                <TextField
                    select
                    label="Select"
                    value={important}
                    onChange={handleChangeImportance}
                    helperText="Importance"
                    >
                    {importance.map((option) => (
                        <MenuItem key={option.label} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Select"
                    value={category}
                    onChange={handleChangeCategory}
                    helperText="Please select a category"
                    >
                    {categories.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                margin="dense"
                autoFocus
                id="name"
                label="Title"
                fullWidth
                variant="standard"
                value={title}
                onChange={(event) => {setTitle(event.target.value)}}
                />
                <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="standard"
                value={description}
                onChange={(event) => {setDescription(event.target.value)}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </div>
    );
}