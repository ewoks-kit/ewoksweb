export default function existsOrValue(object, property, value) {
  return object && property in object ? object[property] : value;
}
