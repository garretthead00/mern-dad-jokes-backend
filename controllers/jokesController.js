require("dotenv").config();
const _ = require("lodash");
const { getUserWithId } = require("../services/userService");

const tasksList = _.times(12, _.uniqueId.bind(null, "task_"));

// Async Promise Queue
const getAllJokes = async (req, res) => {
  const tasksQueue = [];
  _.each(tasksList, function (task) {
    console.log("pushing userId ", task.split("_")[1]);
    tasksQueue.push(
        getUserWithId(task.split("_")[1])
    );
  });

  await Promise.allSettled(tasksQueue).then((values) => {
    console.log("values => ", values);
    res.json(values);
  });
  
};

module.exports = {
    getAllJokes,
};
