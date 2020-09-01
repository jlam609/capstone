require('dotenv').config();
const { models } = require('./models');
const db = require('./db');
const axios = require('axios');

const { User, Job } = models;

const sync = async () => {
  try {
    const user = await User.create({
      username: 'admin@fullstack.com',
      password: 'password',
      firstName: 'Default',
      lastName: 'Admin',
      image:
        'https://thumbs.dreamstime.com/b/red-admin-sign-pc-laptop-vector-illustration-administrator-icon-screen-controller-man-system-box-88756468.jpg',
      clearance: 5,
    });
    console.log(user.validPassword('password'));

    const job1 = await Job.create({
      name: 'McCarren Park',
      status: 'paid',
      price: 20,
      city: 'Brooklyn',
      state: 'New York',
      address: 'Bedford Ave and Lorimer St',
      userId: user.id,
    });
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
          `${job1.address} ${job1.city}, ${job1.state}`
        )}&key=${process.env.GEOCODE_KEY}`
      )
      .then(async response => {
        const lat = response.data.results[0].geometry.location.lat;
        const lng = response.data.results[0].geometry.location.lng;
        await job1.update({ lat: lat });
        await job1.update({ lng: lng });
      });

    const job2 = await Job.create({
      name: 'Tompkins Square Park',
      status: 'paid',
      price: 20,
      city: 'New York',
      state: 'New York',
      address: 'Tompkins Square Park',
      userId: user.id,
    });

    await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
          `${job2.address} ${job2.city}, ${job2.state}`
        )}&key=${process.env.GEOCODE_KEY}`
      )
      .then(async response => {
        const lat = response.data.results[0].geometry.location.lat;
        const lng = response.data.results[0].geometry.location.lng;
        await job2.update({ lat: lat });
        await job2.update({ lng: lng });
      });

    const job3 = await Job.create({
      name: 'Cooper Park',
      status: 'paid',
      price: 20,
      city: 'Brooklyn',
      state: 'New York',
      address: 'Cooper Park',
      userId: user.id,
    });

    await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
          `${job3.address} ${job3.city}, ${job3.state}`
        )}&key=${process.env.GEOCODE_KEY}`
      )
      .then(async response => {
        const lat = response.data.results[0].geometry.location.lat;
        const lng = response.data.results[0].geometry.location.lng;
        await job3.update({ lat: lat });
        await job3.update({ lng: lng });
      });
  } catch (e) {
    console.error(e);
  }
};
const seed = async (force = true) => {
  try {
    await db.sync({ force });
    if (force) {
      await sync();
    }
    console.log('seed was successful');
  } catch (e) {
    throw new Error('seed unsuccessful', e);
  }
};

module.exports = {
  seed,
  models,
};
