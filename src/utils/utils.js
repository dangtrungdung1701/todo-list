export const generateUniqueId = (todos) => {
  let newId;
  while (true) {
    newId = Math.floor(1000 + Math.random() * 9000);

    if (!todos.some((todo) => todo.id === newId)) {
      break;
    }
  }

  return newId;
};

export const debounce = (callback, delay = 1000) => {
  let timer;

  return function (...args) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
