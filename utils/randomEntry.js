export default function (randomLength=5) {
  return Number(
    Math.random().toString().substr(2, randomLength) + Date.now()
  ).toString(36);
}
