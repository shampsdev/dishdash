export const getPriceCount = (price: number) => {
  if (price <= 800) {
    return [null];
  } else if (price < 1600) {
    return [null, null];
  } else {
    return [null, null, null];
  }
};
