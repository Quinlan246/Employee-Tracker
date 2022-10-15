const inquirer = require('inquirer')
const cTable = require('console.table');
const Connection = require('mysql2/typings/mysql/lib/Connection');

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

        if (choices === 'Exit') {
            Connection.end()
        }
    })
}

showDepartments()

showRoles()

showEmployees()

addDepartment()

addRole()

addEmployee()

updateEmployee()

updateManager()

deleteDepartment()

deleteRole()

deleteEmployee()