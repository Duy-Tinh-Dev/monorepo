export const saveDataToLocalStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromLocalStorage = <T>(key: string): T | null => {
  const savedDataJSON = localStorage.getItem(key);
  if (savedDataJSON !== null) {
    return JSON.parse(savedDataJSON);
  } else {
    return null;
  }
};
