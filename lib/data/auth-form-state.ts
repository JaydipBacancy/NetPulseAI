import type { SignInFormState, SignUpFormState } from "@/types/auth";

export const initialSignInFormState: SignInFormState = {
  fieldErrors: {},
  message: "",
  status: "idle",
  values: {},
};

export const initialSignUpFormState: SignUpFormState = {
  fieldErrors: {},
  message: "",
  status: "idle",
  values: {},
};