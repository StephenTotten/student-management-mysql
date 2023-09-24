const Sequelize = require('sequelize');
const readline = require('readline');

// Define the Sequelize model for the Student entity
const sequelize = new Sequelize('student_management_db', 'root', 'AngryCuddle5', {
  host: 'localhost',
  dialect: 'mysql',
});

const Student = sequelize.define('student', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER,
}, {
  timestamps: false, // Disable timestamps
});

// Define the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function promptUser() {
  console.log('Press the option number to perform the action');
  console.log('1. Add student');
  console.log('2. Delete student');
  console.log('3. Update student');
  console.log('4. Search student');
  console.log('5. Print all students');
  console.log('6. Exit');

  const choice = await askQuestion('Enter your choice: ');

  switch (parseInt(choice)) {
    case 1:
      // Add student
      const name = await askQuestion('Enter student name: ');
      const age = parseInt(await askQuestion('Enter student age: '));
      await addStudent(name, age);
      await promptUser();
      break;

    case 2:
      // Delete student
      const deleteName = await askQuestion('Enter student name to delete: ');
      await deleteStudent(deleteName);
      await promptUser();
      break;

    case 3:
      // Update student
      const oldName = await askQuestion('Enter student name to update: ');
      const newName = await askQuestion('Enter new name: ');
      const newAge = parseInt(await askQuestion('Enter new age: '));
      await updateStudent(oldName, newName, newAge);
      await promptUser();
      break;

    case 4:
      // Search student by name or ID
      console.log('Search by:');
      console.log('1. Name');
      console.log('2. ID');
      const searchOption = await askQuestion('Enter your choice: ');

      switch (parseInt(searchOption)) {
        case 1:
          // Search by name
          const searchName = await askQuestion('Enter student name to search: ');
          await searchStudentByName(searchName);
          await promptUser();
          break;

        case 2:
          // Search by ID
          const searchID = parseInt(await askQuestion('Enter student ID to search: '));
          await searchStudentByID(searchID);
          await promptUser();
          break;

        default:
          console.log('Invalid search option. Please try again.');
          await promptUser();
          break;
      }
      break;

    case 5:
      // Print all students
      await printStudents();
      await promptUser();
      break;

    case 6:
      // Exit
      console.log('Exiting...');
      process.exit();

    default:
      console.log('Invalid choice. Please try again.');
      await promptUser();
      break;
  }
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function addStudent(name, age) {
  try {
    const student = await Student.create({ name, age });
    console.log('Student added to database with ID: ' + student.id);
  } catch (err) {
    console.error('Error adding student to database: ' + err.message);
  }
}

async function updateStudent(oldName, newName, newAge) {
  try {
    const [updatedRows] = await Student.update({ name: newName, age: newAge }, { where: { name: oldName } });
    if (updatedRows > 0) {
      console.log('Student updated in database.');
    } else {
      console.log('Student not found.');
    }
  } catch (err) {
    console.error('Error updating student in database: ' + err.message);
  }
}

async function deleteStudent(name) {
  try {
    const deletedRows = await Student.destroy({ where: { name } });
    if (deletedRows > 0) {
      console.log('Student deleted from database.');
    } else {
      console.log('Student not found.');
    }
  } catch (err) {
    console.error('Error deleting student from database: ' + err.message);
  }
}

async function printStudents() {
  try {
    const students = await Student.findAll();
    students.forEach((student) => {
      console.log(`Name: ${student.name} // Age: ${student.age} // ID: ${student.id}`);
    });
  } catch (err) {
    console.error('Error fetching students from database: ' + err.message);
  }
}

async function searchStudentByID(id) {
  try {
    const student = await Student.findByPk(id);
    if (student) {
      console.log(`Student found: ${student.name} // Age: ${student.age}`);
    } else {
      console.log('Student not found.');
    }
  } catch (err) {
    console.error('Error searching for student by ID: ' + err.message);
  }
}

async function searchStudentByName(name) {
  try {
    const students = await Student.findAll({ where: { name } });
    if (students.length > 0) {
      students.forEach((student) => {
        console.log(`Student found: ${student.name}, Age: ${student.age}, ID: ${student.id}`);
      });
    } else {
      console.log('Student not found.');
    }
  } catch (err) {
    console.error('Error searching for student by name: ' + err.message);
  }
}

// Sync the Sequelize model with the database and start the application
sequelize
  .sync()
  .then(() => {
    console.log('Connected to MySQL');
    console.log('Welcome to Student Management System');
    promptUser();
  })
  .catch((err) => {
    console.error('Error connecting to MySQL: ' + err.message);
  });
