
export function useFormRules() {
  const required = (v: any) => !!v || 'Pflichtfeld'
  const minLength = (min: number) => (v: string) =>
    v?.length >= min || `Mindestens ${min} Zeichen`
  const number = (v: any) => !isNaN(v) || 'Muss eine Zahl sein'
  const positive = (v: number) => v > 0 || 'Muss größer als 0 sein'

  return {
    required,
    minLength,
    number,
    positive
  }
}
