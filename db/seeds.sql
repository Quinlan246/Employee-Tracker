INSERT INTO department (name) 
VALUES
('Administration'),
('Finance'),
('Engineering');


INSERT INTO role (title, salary, department_id)
VALUES
('CEO', 250000, 1),
('Executive Assistant', 75000, 1),
('Account Manager', 150000, 2),
('Accountant', 85000, 2),
('Accountant', 85000, 2),
('Senior Engineeer', 175000, 3),
('Software Devolper', 135000, 3),
('Junior Developer', 95000, 3),
('Intern', 45000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Joel', 'Quenneville', 1, null),
('Antti', 'Niemi', 2, 1),
('Jonathan', 'Toews', 3, 1),
('Patrick', 'Kane', 4, 3),
('Marian', 'Hosse', 5, 3),
('Duncan', 'Keith', 6, 1),
('Brent', 'Seabrook', 7, 6),
('Patrick', 'Sharp', 8, 6),
('Andrew', 'Ladd', 9, 6);
