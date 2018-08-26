var words = [{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}];

var idFound = words.filter(function(word){
  return word.id===2 ;
});
console.log(idFound)
if (idFound.length) {
	console.log('ada')
	console.log(idFound)
}
else if (!idFound.length) {
	// statement
	console.log('tidak ada')
}