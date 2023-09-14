const mysql = require('mysql');
const readline = require('readline');
const Student = require('./student');
const studentList = [];

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'AngryCuddle5',
  database: 'student_management', // Replace with your database name
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.message);
    return;
  }
  console.log('Connected to MySQL');
  main();
});

async function main() {
  console.log('Welcome to Student Management System');
  await loadStudentsFromDatabase();
  await promptUser();
}

async function promptUser() {
    console.log('Press the option number to perform the action');
    console.log('1. Add student');
    console.log('2. Delete student');
    console.log('3. Update student');
    console.log('4. Search student');
    console.log('5. Print all students');
    console.log('6. Exit');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const choice = await askQuestion(rl, 'Enter your choice: ');

    switch (parseInt(choice)) {
        case 1:
            // Add student
            const name = await askQuestion(rl, 'Enter student name: ');
            const age = parseInt(await askQuestion(rl, 'Enter student age: '));
            const id = parseInt(await askQuestion(rl, 'Enter student id: '));
            addStudent(name, age, id);
            rl.close();
            await promptUser();
            break;

        case 2:
            // Delete student
            const deleteName = await askQuestion(rl, 'Enter student name to delete: ');
            deleteStudent(studentList, deleteName);
            rl.close();
            await promptUser();
            break;

        case 3:
            // Update student
            const oldName = await askQuestion(rl, 'Enter student name to update: ');
            const newName = await askQuestion(rl, 'Enter new name: ');
            const newAge = parseInt(await askQuestion(rl, 'Enter new age: '));
            const newId = parseInt(await askQuestion(rl, 'Enter new id: '));
            updateStudent(studentList, oldName, newName, newAge, newId);
            rl.close();
            await promptUser();
            break;

        case 4:
            // Search student by name or ID
            console.log('Search by:');
            console.log('1. Name');
            console.log('2. ID');
            const searchOption = await askQuestion(rl, 'Enter your choice: ');

            switch (parseInt(searchOption)) {
                case 1:
                    // Search by name
                    const searchName = await askQuestion(rl, 'Enter student name to search: ');
                    searchStudentByName(studentList, searchName);
                    rl.close();
                    await promptUser();
                    break;

                case 2:
                    // Search by ID
                    const searchID = parseInt(await askQuestion(rl, 'Enter student ID to search: '));
                    searchStudentByID(studentList, searchID);
                    rl.close();
                    await promptUser();
                    break;

                default:
                    console.log('Invalid search option. Please try again.');
                    rl.close();
                    await promptUser();
                    break;
            }
            break;

        case 5:
            // Print all students
            printStudents(studentList);
            rl.close();
            await promptUser();
            break;

        case 6:
            // Exit and save to file
            await saveStudentsToDatabase();
            console.log('Exiting...');
            rl.close();
            break;

        default:
            console.log('Invalid choice. Please try again.');
            rl.close();
            await promptUser();
            break;
    }
}

async function loadStudentsFromDatabase() {
  try {
    const query = 'SELECT * FROM students';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error loading students from database: ' + err.message);
        return;
      }
      results.forEach((row) => {
        const student = new Student(row.name, row.age, row.id);
        studentList.push(student);
      });
    });
  } catch (err) {
    console.error('Error loading students from database: ' + err.message);
  }
}

function addStudent(name, age, id) {
  const newStudent = new Student(name, age, id);
  studentList.push(newStudent);

  const query = 'INSERT INTO students (name, age, id) VALUES (?, ?, ?)';
  connection.query(query, [name, age, id], (err) => {
    if (err) {
      console.error('Error adding student to database: ' + err.message);
      return;
    }
    console.log('Student added to database');
  });
}

// TODO: Add similar changes to other functions

async function saveStudentsToDatabase() {
  try {
    const values = studentList.map((student) => [student.name, student.age, student.id]);
    const query = 'INSERT INTO students (name, age, id) VALUES ?';
    connection.query(query, [values], (err) => {
      if (err) {
        console.error('Error saving students to database: ' + err.message);
        return;
      }
      console.log('Changes saved to database');
    });
  } catch (err) {
    console.error('Error saving students to database: ' + err.message);
  }
}
