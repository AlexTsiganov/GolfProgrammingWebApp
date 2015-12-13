###Here is the testing system for ProgrammingGolf project:

File `testing.js` contains description of class TestSystem with main function `testing()`.

File `db_test.js` contains example of using function `testing()` with mySQL database.

Folder `mock data` contains examples of client's programs.

***

###Main function:

`testing(lang, task, test, solution)`

####Arguments:

1. `lang` - object that contains data from table "PROGRAM_LANGUAGES".
2. `task` - object that contains data from table "TASKS".
3. `test` - object that contains data from table "TESTS".
4. `solution` - object that contains data from table "SOLUTIONS".

####Returns:

generate events with object that contains information about test process:

1. `runtimeError`.
2. `testFailed`.
3. `success`.

fields of response object:

1. `id_solution` - id of checked solution (take from database).
2. `result` - result of testing (`runtime error`, `test failed`, `success`).
3. `error_log` - log of runtime error.
4. `number_of_fail_test` - number of failed test.

***

###Algorithm:

1. Write tests to files (input data to `input.txt` / output data to `etalon.txt`).
2. Run the user's code like `programm.exe < input.txt > output.txt`.
3. Check runtime errors and time limit.
4. Compare `output.txt` with `etalon.txt`. If files are the same, then continue. Else update status and break the function.
5. Back to step 2 and repeate for other test cases (if it exists).