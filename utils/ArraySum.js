exports.SumFunc = (array) => {
  return array.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
};
