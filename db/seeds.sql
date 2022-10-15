INSERT INTO departments (name) 
VALUES
('Administration'),
('Finance'),
('Engineering');


INSERT INTO roles (title, salary, department_id)
VALUES
('CEO', 250000, 1),
('Executive Assistant', 75000, 1),
('Account Manager', 150000, 2),
('Accountant', 85000, 2),
('Accountant', 85000, 2)
('Senior Engineeer', 175000, 3),
('Software Devolper', 135000, 3),
('Junior Software Developer', 95000, 3),
('Intern Software Developer', 45000, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager)
VALUES
('Joel', 'Quenneville', 1, null, 1),
('Antti', 'Niemi', 2, 1, 0),
('Jonathan', 'Toews', 3, 1, 1),
('Patrick', 'Kane', 4, 3, 0),
('Marian', 'Hosse', 5, 3, 0),
('Duncan', 'Keith', 6, 1, 1),
('Brent', 'Seabrook', 7, 5, 0),
('Patrick', 'Sharp', 8, 5, 0),
('Andrew', 'Ladd', 9, 5, 0);
