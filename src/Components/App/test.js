// instead of test = [3, 10, 18, 20]

let test = [
    {myAge: 3},
    {myAge: 10},
    {myAge: 18},
    {myAge: 20},
];

let found = test.findIndex((item) => {
    return item.myAge >= 10;
});

if (found >= 0) {
    test.splice(found, 1);
}
console.log(found);
console.log(test);

if (found) {
    console.log("FOUND");
}
else {
    console.log("NOT FOUND");
}