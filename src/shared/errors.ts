export const notFoundErr = new Error("Not found");

export const wrongPasswordErr = new Error("Wrong password");

export const usernameNotFoundErr = new Error("No username found");

export const usernameExistsErr = new Error("Username already exists");

export const paramMissingErr = new Error(
  "One or more of the required parameters was missing."
);

export const noValidEntryFoundErr = new Error(
  "No valid entry found for provided ID"
);

export const bodyMissingPropsErr = new Error(
  "One or more of the required properties was missing."
);

export const cannotPerformUpdateErr = new Error(
  "Cannot perform update because update values are not defined"
);

export const tokenAuthFailedErr = new Error("Failed to authenticate token");

export const missingTokenErr = new Error("Access token is missing");
