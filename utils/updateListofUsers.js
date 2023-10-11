export const removeLeftUserFromUsersList = (listOfUsers, id) => {
  return listOfUsers.filter((user) => {
    user.id !== id;
  });
};
