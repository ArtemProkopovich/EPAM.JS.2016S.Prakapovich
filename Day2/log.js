for (var i = 1; i <= typeObjectCount; i++) {
    var count = 0;
    var currentFunc = "getCount" + i;
    for (var j = 0; j < objectCount; j++) {
        if (currentFunc in data[j])
            count += data[j][currentFunc]();
    }
    console.log("count" + i + "=" + count);
}