# Notes

## Environments and builds

| env        | docker | ssl |
| ---------- | ------ | --- |
| unit test  | no     | no  |
| dev        | no     | yes |
| CI test    | yes    | yes |
| Production | yes    | yes |

> if you get "error: port in use": `npx kill-port :<PORT_NUMBER>`

## How to dev

prepare dev env

```sh
npm run inst
npm run ssl-certs:local
npm run build
```

Ping **server** at <http://localhost:8081/api/ping> or <https://localhost:8082/api/ping>

The **app** is at <http://localhost:8081/>

1. **Local** `npm run dev` will start everything locally
2. **Unit Tests** you'll probably want to keep unit tests on watch mode as you make changes, `npm run test:api:watch` and `npm run test:app` (watches by default). Before commit do a full run with `npm run test`
3. **Local Prod Build Run** `npm run build:start`
4. **Local Docker Prod Build Run** `start:local:docker`

## SSL certs

use the scripts `npm run ssl-certs:` + env (local, ci, prod)

- CI: We use an npm package make-cert during CI to make a self-signed cert without a cert authority, good enough for headless e2e tests.

- Local development: It's better to use [mkcert](https://github.com/FiloSottile/mkcert/) because it adds a cert authority (still have to manually get browser to trust it)

- Production: Must have certbot installed on the server (see deploy below)

## Deploy

### CI/CD explanation

CD works by using [watchtower](https://containrrr.dev/watchtower/) in the docker-compose file. It will periodically check for new versions of the app/server's docker images on docker hub.
On commits to `staging` or `prod` branches, if tests pass, Github actions will push updated images to docker hub with the corresponding tags.

### Server setup

send namecheap dns to digital ocean (DO) dns
create DO ubuntu server with docker default image
give it a floating ip
link domain to floating ip

copy over .env file
change PROD_HOST to host e.g. eduvault.org

```bash
# create user
ssh root@your_server_ip -i /path/to/keys
adduser jacob
usermod -aG sudo jacob
rsync --archive --chown=jacob:jacob ~/.ssh /home/jacob

# firewall
ufw app list
ufw allow OpenSSH
ufw allow http
ufw allow https
ufw enable
sudo ufw status verbose

# disconnect and ssh as jacob
## get the code
mkdir eduvault
cd eduvault
git init
git remote add origin https://github.com/EduVault/core.git
git fetch origin
git checkout origin/main -ft

## copy .env file over
### edit the following in the .env file
PORT_DOCKER=80
PORT_DOCKERS=443
# TEST_ENV='e2e' # deactivate
HOST=is-a-test.xyz
IMAGE_SUFFIX=production # or staging
WATCHTOWER_POLLING_INTERVAL=600 #or whatever (in seconds)

#node
sudo apt update
sudo apt install nodejs npm

# certbot
sudo apt install certbot
## must wait until DNS changes take effect!
# replace eduvault.org with prod/staging server name
npm run ssl-certs:prod

# enable swap to use RAM better
sudo dd if=/dev/zero of=/swapfile bs=1024 count=256k
sudo mkswap /swapfile
sudo swapon /swapfile
sudo nano /etc/fstab
# add line:
 /swapfile       none    swap    sw      0       0
echo 10 | sudo tee /proc/sys/vm/swappiness
echo vm.swappiness = 10 | sudo tee -a /etc/sysctl.conf
sudo chown root:root /swapfile
sudo chmod 0600 /swapfile

sudo apt install gcc # if you run into an error using screen

# build and run not in detached first to check logs and manually test
npm run start:production:logs

# if ok, run in screen detached
sudo apt install screen
screen
sudo service docker start
npm run start:production

# To detach a screen session and return to your normal SSH terminal, type
Ctrl a d
```

## References

- [supertest](https://github.com/visionmedia/supertest#readme)
<!-- - [using moxios](https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/) -->
- [express.js](http://expressjs.com/en/)
- [express best practice](http://expressjs.com/en/advanced/best-practice-performance.html)
- [dotenv with jest](https://tekloon.dev/using-dotenv-with-jest)
- [localhost https](https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28)
- [express http to https](https://stackoverflow.com/a/65551891/12662244)
- [Digital Ocean deploy with github actions CI](https://codememoirs.com/automatic-deployment-digitalocean-github-actions/)
- [Cypress Dashboard](https://dashboard.cypress.io/projects/obyc2w/)
