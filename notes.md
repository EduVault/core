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

## SSL certs

We use an npm package `make-cert:ci` during CI to make a self-signed cert without a cert authority, good enough for headless e2e tests. For local development, its better to use install [mkcert](https://github.com/FiloSottile/mkcert/) because it adds a cert authority (still have to manually get browser to trust it)
e the script `yarn make-certs:local`

## Deploy

send namecheap dns to digital ocean dns
create DO ubuntu server
give it flaoting ip
link domain to floating ip

copy over .env file
change PROD_HOST to host e.g. eduvault.org

add ssh info to github secrets

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

# certbot
sudo apt update
sudo apt install certbot
## must wait until DNS changes take effect!
# replace eduvault.org with prod/staging server name
mkdir deploy/prod-certs ; cd deploy/prod-certs && sudo certbot certonly --standalone -d eduvault.org<domain>
# copy them in
cd deploy/prod-certs && cp /etc/letsencrypt/live/is-a-test.xyz/fullchain.pem cert.pem && cp /etc/letsencrypt/live/is-a-test.xyz/privkey.pem key.pem
# permission key
sudo chown jacob /home/jacob/eduvault/deploy/prod-certs/key.pem
sudo chmod 400 /home/jacob/eduvault/deploy/prod-certs/key.pem

# allow port 80:
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
# Set up the project dependencies (Node.js and PM2 Process Manager).
cd ~
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install nodejs
sudo npm install pm2 -g

# Log in to the Droplet via the terminal using the sudo user created earlier, navigate to the project root directory and start the application using the PM2 process manager.

cd ./eduvault && npm run build:production && pm2 start --name eduvault npm -- run start
pm2 logs #view logs
```
