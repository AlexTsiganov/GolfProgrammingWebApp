###Hello new NodeJS Golf Programming v.1.0.0

#[Golf programming](http://ec2-54-208-42-199.compute-1.amazonaws.com)

Amazon Web service EC2 ubuntu
  Public DNS: [ec2-54-208-42-199.compute-1.amazonaws.com](http://ec2-54-208-42-199.compute-1.amazonaws.com)
  Public IP: [54.208.42.199](54.208.42.199)

  Active ports: http -> 80, 9000

***

## Instructions for start local

If you would like to download the code and try it for yourself:

1. Clone the repo: `git clone https://github.com/AlexTsiganov/GolfProgrammingWebApp.git`
2. Install packages: `npm install`
3. Launch: `npm start` or `DEBUG=all npm start` with logs
4. Visit in your browser at: `http://localhost:3000`

***

###Development:

1. Connect for cloud: ssh -i aws\ ec2\ access/AlexTsiganov.pem ubuntu@54.208.42.199
new `ssh -i aws\ ec2\ access/GolfProgramming.pem ubuntu@54.173.174.148`
  user: ubuntu
2. Run NodeJS web server with npm: npm install | npm start (TODO://replace with script)
  before: 'export NODE_ENV=development'
3. Run web server on cloud: sudo PORT=80 DEBUG=golf-apm start (TODO://replace with script)
  Running web server in the background:

***

###Database MySql:

1. Connect `mysql -u root -p` pass: 123123
  user: golf pass: golf
  create database golf_programming;
  grant all on golf_programming.* to 'golf' identified by 'golf';

***

TODO:// npm install -> https://github.com/foreverjs/forever
            debug   -> https://github.com/visionmedia/debug

sudo PORT=80 DEBUG=golf-app:* npm start

sudo PORT=80 nodejs bin/www

nohup nodejs bin/www > output.log &

export NODE_ENV=production
echo export NODE_ENV=production >> ~/.bash_profile

sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080

1
