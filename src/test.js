/**
 * Created by Kelvin Ishigo on 1/29/18.
 *
 * Copyright (c) 2018 Kelvin Ishigo
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */
var persons = [
    {firstname : "Malcom", lastname: "Reynolds"},
    {firstname : "Kaylee", lastname: "Frye"},
    {firstname : "Jayne", lastname: "Cobb"}
];

let foo = persons.map((item) => {
	return item.firstname;
});

let bar = persons.map((item) => item.firstname);
console.log(persons.length === 3);
console.log(foo);
console.log(bar)