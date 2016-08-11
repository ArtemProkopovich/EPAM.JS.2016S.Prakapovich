var data = [];
var objectCount = 5;
var typeObjectCount = 3;
for (var i = 0; i < objectCount; i++) {
    data[i] = {};
    data[i].count = random(1, 10);
    var objectType = "getCount" + random(1, typeObjectCount);
    data[i][objectType] = function() {
        return this.count;
    }
    console.log("type = " + objectType + ", count = " + data[i].count);
}