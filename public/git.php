<?php

$DESIRED_BRANCH     = "deploy";

echo shell_exec("echo hello alex");
echo shell_exec("forever stopall");
echo shell_exec("git pull && git checkout {$BRANCH} && forever start bin/www");

die("done " . mktime());
