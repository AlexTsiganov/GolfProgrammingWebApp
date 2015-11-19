###Hello NodeJS Golf Programming v.1.0.0

#[Golf programming](http://ec2-54-173-174-148.compute-1.amazonaws.com)

Amazon Web service EC2 ubuntu
  Public DNS: [ec2-54-173-174-148.compute-1.amazonaws.com](http://ec2-54-173-174-148.compute-1.amazonaws.com)
  Public IP: [54.173.174.148](http://54.173.174.148/)

  Active ports: http -> 80, 3000

***

## Instructions for start local

If you would like to download the code and try it for yourself:

1. Clone the repo: `git clone https://github.com/AlexTsiganov/GolfProgrammingWebApp.git`
2. Open project folder: `cd GolfProgrammingWebApp`
3. Install packages: `npm install`
4. Set NODE_ENV to development `export NODE_ENV=dev`
5. Launch: `npm start` or `node bin/www`
6. Visit in your browser at: `http://localhost:3000`

***

###Building project on cloud:

1. Switch to local **deploy** branch: `git checkout deploy`
2. Commit your last changes to deploy branch or **merge with master**
3. Push deploy branch to github: `git push origin deploy`
   After that web server restart and download lash commits from *deploy* branch via github hook

***

###Connect to AWS EC2 cloud:

1. Copy GolfProgramming.pem to folder `ws ec2 access`
2. Connect to cloud via bash/ec2-cloud without params: `./bash/ec2-cloud` (default user: *ubuntu*)
3. NodeJS web server working in the background with *forever* module
  If *forever* doesn't working, start web server: `forever start bin/www`
  Check the current bg web servers: `forever list`
  Stop all web servers: `forever stopall`
4. Project directory at `/home/ubuntu/GolfProgrammingWebApp`

***

###Access to MySQL database:

**Be very careful with the editing database; errors can lead to data loss**

1. Connect `mysql -u golf -p` *password: golf*
2. Select database: `use golf_programming`
3. Show tables: `show tables;`
4. All tables duplicate into `Database/tables.txt`

***

###Development:

export NODE_ENV=production
echo export NODE_ENV=production >> ~/.bash_profile

sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080

create database golf_programming;
grant all on golf_programming.* to 'golf' identified by 'golf';
