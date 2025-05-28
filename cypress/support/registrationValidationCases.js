export const testCases = {
  signupName: [
    { value: "", error: "Name required" },
    { value: "!", error: "Name is invalid" },
    { value: "a", error: "Name has to be from 2 to 20 characters long" },
    {
      value: "a".repeat(21),
      error: "Name has to be from 2 to 20 characters long",
    },
  ],
  signupLastName: [
    { value: "", error: "Last name required" },
    { value: "!", error: "Last name is invalid" },
    { value: "a", error: "Last name has to be from 2 to 20 characters long" },
    {
      value: "a".repeat(21),
      error: "Last name has to be from 2 to 20 characters long",
    },
  ],
  signupEmail: [
    { value: "", error: "Email required" },
    { value: "invalid-email", error: "Email is incorrect" },
  ],
  signupPassword: [
    { value: "", error: "Password required" },
    { value: "123", error: "Password has to be from 8 to 15 characters" },
    { value: "abcdefgh", error: "Password has to be from 8 to 15 characters" },
  ],
  signupRepeatPassword: [{ value: "", error: "Re-enter password required" }],
};
