export const getChatTime = date => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
};

export const setDateChat = oldDate => {
  const year = oldDate.getFullYear();
  const month = oldDate.getMonth() + 1;
  const date = oldDate.getDate();

  return `${year}-${month}-${date}`;
};

export const getDateTime = datetime => {
  const year = datetime.getFullYear();
  const month = datetime.getMonth() + 1;
  const date = datetime.getDate();
  const time = datetime.getHours();
  const minutes = datetime.getMinutes();
  const seconds = datetime.getSeconds();

  return `${year}-${month}-${date} ${time}:${minutes}:${seconds}`;
};
