import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../store/user/userActions';
import { StoreState } from '../store/store';
import Alert from './alertComponent/alert';
import { Button } from '@material-ui/core';
import axios from 'axios';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: StoreState) => state);
  const checkStatus = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const account = (await axios.get(`/api/user/stripe/${user.id}`)).data;
    console.log(account);
    if (!account) {
      console.log(user.stripeAccount);
      window.location = user.stripeAccount;
    } else {
      const userData = (await axios.post(`/api/user/stripe/${user.id}`)).data;
      user.stripeDashBoard = userData.stripeDashBoard;
    }
  };
  return (
    <div className="navbar-fixed">
      <nav className="green accent-4">
        <div className="nav-wrapper">
          <Link to="/stream">(LOGO HERE)</Link>
          <ul id="nav-mobile" className="right hide-on-small-only">
            {!!user.clearance && (
              <li className="user-profile">
                <Link to="/account">
                  <img
                    src={user.image}
                    width="20"
                    height="20"
                    className="border-circle"
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                </Link>
                <div className="user-profile-subnav green accent-4">
                  {!user.stripeDashBoard ? (
                    <>
                      <Button onClick={e => checkStatus(e)}>
                        check Onboarding Status
                      </Button>
                    </>
                  ) : (
                    <a href={user.stripeDashBoard}>Link to Stripe Dashboard</a>
                  )}
                  <button
                    className="btn btn-small"
                    onClick={() => dispatch(logoutThunk())}
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              </li>
            )}
            <Button>
              <Alert />
            </Button>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            <li>
              <Link to="/map">Map</Link>
            </li>
            <li>
              <Link to="/inbox" className={user.clearance ? '' : 'ghost'}>
                Inbox
              </Link>
            </li>
            <li>
              <Link to="/account" className={user.clearance ? 'ghost' : ''}>
                Account
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
