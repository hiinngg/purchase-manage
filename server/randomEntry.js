
export default function randomEntry(pre='',randomLength=5){
  var result = pre;
  for(var i = 0; i < randomLength; i++) {
      result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}
