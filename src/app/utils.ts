export function expDateStringToDate(date: string): Date {
  try {
    return new Date(parseInt('20' + date.substring(3, 5)), parseInt(date.substring(0, 2)) - 1);
  } catch (e) {
    console.log(e);
  }
}

export function dateToExpDateString(date: Date): string {
  try {
    return date.toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit' });
  } catch (e) {
    console.log(e);
  }
}

export function expDateSlashHandler(newValue: string, oldValue: string): string {
  let value = newValue;

  if (newValue.length > oldValue.length) {
    if (newValue.length === 2) {
      value += "/";
    }
  } else {
    if (newValue.length === 3) {
      value = value.slice(0, newValue.length - 1);
    }
  }

  return value;
}
