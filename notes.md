# Notes

## references

[supertest](https://github.com/visionmedia/supertest#readme)
[using moxios](https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/)
[express best practice](http://expressjs.com/en/advanced/best-practice-performance.html)
[dotenv with jest](https://tekloon.dev/using-dotenv-with-jest)
[express.js](http://expressjs.com/en/)
[localhost https](https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28)
[express http to https](https://stackoverflow.com/a/65551891/12662244)
[Digital Ocean deploy with github actions CI](https://codememoirs.com/automatic-deployment-digitalocean-github-actions/)

## Deploy

send namecheap dns to digital ocean dns
create DO ubuntu server
give it flaoting ip
link domain to floating ip
ssh in
from ubuntu server

```bash
ssh root@your_server_ip -i /path/to/keys
adduser jacob
usermod -aG sudo jacob
rsync --archive --chown=jacob:jacob ~/.ssh /home/jacob
ufw app list
ufw allow OpenSSH
ufw allow http
ufw allow https
ufw enable
sudo ufw status verbose


# disconnect and ssh as jacob
```

```bash
# make a project folder in home/jacob
mkdir eduvault
cd eduvault
git init
git remote add origin https://github.com/EduVault/server.git
git fetch origin
git checkout origin/main -ft
```

```bash
# Download and install the latest runner package.

mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.278.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.278.0/actions-runner-linux-x64-2.278.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.278.0.tar.gz
# Configure the runner and start the runner as a Linux service.

./config.sh --url https://github.com/username/repo_name --token <your_token>
sudo ./svc.sh install
sudo ./svc.sh start

# Set up the project dependencies (Node.js and PM2 Process Manager).
cd ~
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install nodejs
sudo npm install pm2 -g

# Log in to the Droplet via the terminal using the sudo user created earlier, navigate to the project root directory and start the application using the PM2 process manager.

cd /actions-runner/_work/digitalocean-actions/digitalocean-actions
pm2 start --name eduvault npm -- start
```