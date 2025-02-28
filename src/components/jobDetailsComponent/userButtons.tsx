import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../../store/store';
import { findOrCreateChat } from '../../store/inbox/inboxActions';
import { Chatroom } from '../../store/inbox/inboxInterface';
import { reserveJob, unreserveJob } from '../../store/job/jobActions';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const UserButtons: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const history = useHistory();

  const dispatch: (
    a: ThunkAction<any, any, any, any>
  ) => Promise<any> = useDispatch();

  const {
    user,
    job: { job },
  } = useSelector((state: StoreState) => state);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const openChat = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<any> => {
    e.preventDefault();
    if (!user.clearance) {
      setMessage('You must be logged in to send a message');
      setOpen(true);
    }
    return new Promise((res, rej) => {
      try {
        res(
          dispatch(
            findOrCreateChat(
              user.id,
              job.userId,
              user.username,
              job.createdUser,
              job.id,
              job.name
            )
          )
        );
      } catch (err) {
        rej(err);
      }
    }).then((res: Chatroom) => {
      if (res) {
        history.push(`/inbox/${res.id}`);
      }
    });
  };
  const handleReserve = (): void => {
    if (job.reserved) {
      // TODO - ARE YOU SURE? YOU'LL LOSE YOUR DEPOSIT
      dispatch(unreserveJob(job.id))
        .then(() => {
          setMessage('Reservation Cancelled');
          setOpen(true);
        })
        .catch(() => {
          setMessage('Error - Please Try Again');
          setOpen(true);
        });
    } else {
      dispatch(reserveJob(job.id))
        .then(() => {
          setMessage('Reservation Confirmed');
          setOpen(true);
        })
        .catch(e => {
          setMessage(e);
          setOpen(true);
        });
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <Button variant="outlined" onClick={handleReserve} className="m1em">
        {job.reserved ? 'Cancel' : 'Reserve'}
      </Button>
      <Button variant="outlined" onClick={openChat} className="m1em">
        Message Poster
      </Button>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
        message={message}
      />
    </div>
  );
};

export default UserButtons;
