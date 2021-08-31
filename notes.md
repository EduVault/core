# Notes

## References

- [supertest](https://github.com/visionmedia/supertest#readme)
- [using moxios](https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/)
- [express best practice](http://expressjs.com/en/advanced/best-practice-performance.html)
- [dotenv with jest](https://tekloon.dev/using-dotenv-with-jest)
- [express.js](http://expressjs.com/en/)
- [localhost https](https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28)
- [express http to https](https://stackoverflow.com/a/65551891/12662244)
- [Digital Ocean deploy with github actions CI](https://codememoirs.com/automatic-deployment-digitalocean-github-actions/)

## Environments and builds

| env        | docker | ssl |
| ---------- | ------ | --- |
| unit test  | no     | no  |
| dev        | no     | yes |
| CI test    | yes    | yes |
| Production | yes    | yes |

> if you get "error: port in use": `kill $(lsof -t -i:<PORT_NUMBER>)`

## SSL certs

use the scripts `npm run ssl-certs:` + env (local, ci, prod)

- CI: we use an npm package make-cert during CI to make a self-signed cert without a cert authority, good enough for headless e2e tests.

- Local development: its better to use [mkcert](https://github.com/FiloSottile/mkcert/) because it adds a cert authority (still have to manually get browser to trust it)

- Production: must have certbot installed (see deploy below)

## Deploy

send namecheap dns to digital ocean dns
create DO ubuntu server with docker default image
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


# make certs
sudo apt update
sudo apt install certbot
## must wait until DNS changes take effect to create ssl certs!
npm run ssl-certs:prod
# permission key
sudo chown jacob /home/jacob/eduvault/deploy/prod-certs/key.pem
sudo chmod 400 /home/jacob/eduvault/deploy/prod-certs/key.pem

# allow port 80:
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

# start
npm run production
```
