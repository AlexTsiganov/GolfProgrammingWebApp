###Instructions for testing system:

Main function:

`testing(solution, filename)`
File `index.js` contains example of using this function with error handling.

Arguments:

`solution` - ID of user's solution in database (for example, `1`);
`filename` - full name of the file with user's code (for example, `/home/user/myfolder/mycode.cpp`).

Returns:

nothing to return, but generate events with information about test process:
1. `runtimeError`
2. `testFailed`
3. `success`

***

Algorithm:

1. Take information about solution and task (language of solution, time limit for task, etc.) from database.
2. Take test case (input / output data) from database and write it to files (`input.txt` / `etalon.txt`).
3. Run the user's code like `programm.exe < input.txt > output.txt`.
4. Check runtime errors and time limit.
5. Compare `output.txt` with `etalon.txt`. If files are the same, then continue. Else update status and break the function.
6. Back to step 2 and repeate for other test cases (if it exists).