Object.values = obj => Object.keys(obj).map(key => obj[key]);
Object.entries = obj =>
  Object.keys(obj).reduce(
    (initial, key) => initial.push([key, obj[key]]) && initial,
    [],
  );
