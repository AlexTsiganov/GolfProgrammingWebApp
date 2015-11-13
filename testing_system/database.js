// table TESTS from database
var tests = [
    {
        id_test: '1',
        id_task: '1',
        input_data: '4 6',
        output_data: '10'
    },
    {
        id_test: '2',
        id_task: '1',
        input_data: '423 577',
        output_data: '1000'
    },
    {
        id_test: '3',
        id_task: '1',
        input_data: '17 33',
        output_data: '50'
    }];

// part of the table TASKS from database
var tasks = [
    {
        id_task: '1',
        timelimit: '30'
    }
];

// part of the table LANGUAGES from database
var langs = [
    {
        lang: 'C++',
        exec_command: ''
    }
];

// export variables to other module
exports.tests = tests;
exports.tasks = tasks;
exports.langs = langs;