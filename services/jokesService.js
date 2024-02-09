require("dotenv").config();
const _ = require("lodash");
const AsyncQueue = require('../helpers/asyncQueue')

exports.getJokes = async () => {
  return await fetch(`${process.env.DB_URI}/jokes`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

exports.getUserWithEmail = async (email) => {
  return await fetch(`${process.env.DB_URI}/users/?email=${email}`)
    .then((res) => res.json())
    .then((json) => {
      return json[0];
    });
};

exports.getUserWithId = async (id) => {
  return await fetch(`${process.env.DB_URI}/users/?id=${id}`)
    .then((res) => res.json())
    .then((json) => {
      console.log('got the user:', json[0])
      return json[0];
    });
};
