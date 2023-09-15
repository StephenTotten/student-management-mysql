DROP DATABASE IF EXISTS student_management_db;
CREATE DATABASE student_management_db;

USE student_management_db;

CREATE TABLE student (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    PRIMARY KEY (id)
);
