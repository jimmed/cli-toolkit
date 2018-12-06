const undoTask = async (task, args) => {
  if (!task.undo) {
    return;
  }
  try {
    await task.undo(task, args);
  } catch (error) {
    console.warn(error);
  }
};

export default undoTask;
