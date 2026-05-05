let rawInitData = '';

export const setInitData = (token: string) => {
  rawInitData = token;
};

export const getInitData = () => rawInitData;
