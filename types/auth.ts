type BaseAuthFormState<FieldName extends string> = {
  fieldErrors: Partial<Record<FieldName, string[]>>;
  message: string;
  status: "idle" | "validation_error" | "server_error" | "success";
  submittedAt?: string;
  values: Partial<Record<FieldName, string>>;
};

export type SignInFieldName = "email" | "password";

export type SignUpFieldName =
  | "confirmPassword"
  | "email"
  | "fullName"
  | "password";

export type SignInFormState = BaseAuthFormState<SignInFieldName>;

export type SignUpFormState = BaseAuthFormState<SignUpFieldName>;