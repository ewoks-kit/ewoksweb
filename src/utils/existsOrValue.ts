// TODO: return type definition? It can all types of value
export default function existsOrValue(
  object: object,
  property: string,
  value: string | boolean | number | object
) {
  return object && property in object ? object[property] : value;
}
