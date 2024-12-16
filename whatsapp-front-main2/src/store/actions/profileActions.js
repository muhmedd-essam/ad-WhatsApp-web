export const updateProfile = (profileDate) => {
  return {
    type: "UPDATE_PROFILE",
    payload: profileDate,
  };
};
