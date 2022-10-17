const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

require('dotenv').config();

const Connection = mysql.createConnection(
    {
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db',
    host: 'localhost',
    },
);

Connection.connect(err => {
    if (err) throw err;
    console.log('connnected as id ' + Connection.threadId);
    afterConnection();
});

afterConnection = () => {
    console.log('employee manager')
    promptUser();
};

const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'Exit'
            ]
        }
    ]).then((answers) => {
        const { choices } = answers;

        if (choices === 'View all departments') {
            showDepartments()
        }

        if (choices === 'View all roles') {
            showRoles()
        }

        if (choices === 'View all employees') {
            showEmployees()
        }

        if (choices === 'Add a department') {
            addDepartment()
        }

        if (choices === 'Add a role') {
            addRole()
        }

        if (choices === 'Add an employee') {
            addEmployee()
        }

        if (choices === 'Update an employee role') {
            updateEmployee()
        }

        if (choices === 'Update an employee manager') {
            updateManager()
        }

        if (choices === 'Delete a department') {
            deleteDepartment()
        }

        if (choices === 'Delete a role') {
            deleteRole()
        }

        if (choices === 'Delete an employee') {
            deleteEmployee()
        }

        if (choices === 'View department budgets') {
            viewBudget()
        }

        if (choices === 'Exit') {
            Connection.end()
        }
    })
}

showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    Connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

showRoles = () => {
    console.log('Showing all roles...\n');

    const sql = `SELECT role.id, role.title, department.name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`

    Connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

showEmployees = () => {
    console.log('Showing all employees...\n');
    const sql = `SELECT employee.id,
                        employee.first_name,
                        employee.last_name,
                        role.title,
                        department.name AS department,
                        role.salary,
                        CONCAT (manager.first_name, ' ', manager.last_name) AS manager
                    FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`

    Connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What department do you want to add?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
            Connection.query(sql, answer.addDept, (err, res) => {
                if (err) throw err;
                console.log(('Added ' + answer.addDept + ' to departments'));

                showDepartments();
            });
    });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role do you want to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (addSalary) {
                    return true;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.role, answer.salary];
        const roleSql = `SELECT name, id FROM department`;

        Connection.query(roleSql, (err, data) => {
            if (err) throw err;

            const dept = data.map(({ name, id}) => ({name: name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ]) .then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role(title, salary, department_id)
                VALUES (?, ?, ?)`;

                Connection.query(sql, params, (err, res) => {
                    if(err) throw err; 
                    console.log('Added' + answer.role + ' to roles');

                    showRoles();
                });
            });
        });
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
            validate: addFirst => {
                if(addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
            validate: addLast => {
                if(addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ]) .then(answer => {
        const params = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;

        Connection.query(roleSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title}) => ({ name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employess role?',
                    choices: roles
                }
            ]).then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                Connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name}) => ({ name: first_name + ' '+ last_name, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employees manager?',
                            choices: managers
                        }
                    ]) .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

                        Connection.query(sql, params, (err, res) => {
                            if(err) throw err;
                            console.log('New employee has been added')

                        showEmployees();

                        });
                    });
                });
            });
        });
    });
};

updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;

    Connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name}) => ({name: first_name + ' '+ last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee woould you like to update?',
                choices: employees
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.name;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM role`;
            
            Connection.query(roleSql, (err, data) => {
                if(err) throw err;

                const roles = data.map(({ id, title}) => ({ name: title, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees new role?',
                        choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    Connection.query(sql, params, (err, res) => {
                        if(err) throw err;
                        console.log('Employee has been updated');

                    showEmployees();

                    });
                });
            });
        });
    });
};

updateManager = () => {
    const employeeSql = `SELECT * FROM employee`;

    Connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name}) => ({name: first_name + ' '+ last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee woould you like to update?',
                choices: employees
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.name;
            const params = [];
            params.push(employee);

            const managerSql = `SELECT * FROM employee`;

            Connection.query(managerSql, (err, data) => {

                const managers = data.map(({ id, first_name, last_name}) => ({name: first_name + ' '+ last_name, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        choices: managers
                    }
                ]).then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);

                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                    Connection.query(sql, params, (err, res) => {
                        if(err) throw err;
                            console.log('Employee has been updated');

                    showEmployees();

                    });
                });
            });
        });
    });
};
        
// deleteDepartment()

// deleteRole() 

// deleteEmployee()

// viewBudget()