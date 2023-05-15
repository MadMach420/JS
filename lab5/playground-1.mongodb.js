/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('AGH');

// Insert a few documents into the sales collection.
// db.getCollection('students').insertMany([
//   { 'imie': 'Krzysztof', 'nazwisko': 'Mach', 'wydzial': 'IET' },
//   { 'imie': 'Marcin', 'nazwisko': 'Knapczyk', 'wydzial': 'FIS' },
//   { 'imie': 'Szymon', 'nazwisko': 'Ciosek', 'wydzial': 'IET' },
//   { 'imie': 'Kacper', 'nazwisko': 'Sloniec', 'wydzial': 'IET' },
//   { 'imie': 'Jan', 'nazwisko': 'Ciezkowski', 'wydzial': 'IET' }
// ]);

// Run a find command to view items sold on April 4th, 2014.
// const ietStudents = db.getCollection('students').find({
//   'wydzial': 'IET'
// });

db.getCollection('students').find({
  'wydzial': 'IET'
});

// Print a message to the output window.
// console.log(ietStudents.toString());
