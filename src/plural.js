export default function plural(number, one, few, many) {
    let result = ''
    if (number % 10 === 1) return one;
    if (number % 100 > 11 && number % 100 <= 14) {
      result = ' раз';
    } else {
  
      result = (number % 10 > 1 && number % 10 < 5) ? few : many;
    }
    return result;
  }