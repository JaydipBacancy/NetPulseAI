export function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getFormValues<const T extends readonly string[]>(
  formData: FormData,
  keys: T,
): Record<T[number], string> {
  return Object.fromEntries(
    keys.map((key) => [key, getFormValue(formData, key)]),
  ) as Record<T[number], string>;
}