const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  const getFromLocalStorage = (key: string) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  };
  
  const addItemToLocalStorageArray = (key: string, newItem: any) => {
    const existingItems = getFromLocalStorage(key) || [];
    existingItems.push(newItem);
    saveToLocalStorage(key, existingItems);
  };
  
  const removeItemFromLocalStorageArray = (key: string, itemIndex: number) => {
    const existingItems = getFromLocalStorage(key) || [];
    existingItems.splice(itemIndex, 1); // Remove the item at the specified index
    saveToLocalStorage(key, existingItems);
  };
  
  const clearLocalStorageItem = (key: string) => {
    localStorage.removeItem(key);
  };
  
  export { saveToLocalStorage, getFromLocalStorage, addItemToLocalStorageArray, removeItemFromLocalStorageArray, clearLocalStorageItem };
  