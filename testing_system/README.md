###Here is the testing system for ProgrammingGolf project:

File `testing.js` contains description of class TestSystem with main function `testing()`.

File `index.js` contains example of using function `testing()`.

***

Main function:

`testing(filename, langs, tasks, tests, solutions)`

Arguments:

1. `filename` - full name of the file with user's code (for example, `/home/user/myfolder/mycode.cpp`).
2. `langs` - object that contains data from table "PROGRAM_LANGUAGES".
3. `tasks` - object that contains data from table "TASKS".
4. `tests` - object that contains data from table "TESTS".
5. `solutions` - object that contains data from table "SOLUTIONS".

Returns:

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

Algorithm:

1. Take information about solution and task (language of solution, time limit for task, etc.) from database.
2. Take test case (input / output data) from database and write it to files (`input.txt` / `etalon.txt`).
3. Run the user's code like `programm.exe < input.txt > output.txt`.
4. Check runtime errors and time limit.
5. Compare `output.txt` with `etalon.txt`. If files are the same, then continue. Else update status and break the function.
6. Back to step 2 and repeate for other test cases (if it exists).