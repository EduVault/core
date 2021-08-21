# remember to run from project root

# parse arguments
env=$1;
echo 'env: '$env;

# load envs
export $(cat .env | xargs);
# check host environment variable
echo 'prod host: ' $PROD_HOST;
echo 'dev host' $DEV_HOST;
echo 'email: ' $EMAIL;

echo 'current directory: ';
pwd;

clean_folders() {
    echo 'cleaning folders';
    cd ./deploy &&  
    rm -rf ./certs; \
    mkdir ./certs;
};

link_certs() {
    local cert_script=$1;
    echo 'linking from: ' $cert_script;
    echo 'current directory: ';
    pwd;
    if [ $cert_script == "make-cert" ]; then
        cd ./certs && \
        ln -s cert.pem $DEV_HOST.crt && \
        ln -s key.pem $DEV_HOST.key;

    elif [ $cert_script == "mkcert" ]; then
        cd ./certs && \
        ln -s $DEV_HOST-key.pem key.pem && \
        ln -s $DEV_HOST-key.pem $DEV_HOST.key && \

        ln -s $DEV_HOST.pem cert.pem && \
        ln -s $DEV_HOST.pem $DEV_HOST.crt;

    elif [ $cert_script == "certbot" ]; then
        cd ./certs && \
        ln -s /etc/letsencrypt/live/$PROD_HOST/privkey.pem key.pem && \
        ln -s /etc/letsencrypt/live/$PROD_HOST/privkey.pem $PROD_HOST.key && \

        ln -s /etc/letsencrypt/live/$PROD_HOST/fullchain.pem cert.pem && \
        ln -s /etc/letsencrypt/live/$PROD_HOST/fullchain.pem $PROD_HOST.crt;
    fi;
};

make_certs() {
    clean_folders;
    echo 'current directory: ';
    pwd;
    if [ $env == "ci" ]; then
        echo 'making CI certs';    
        cd ./certs && \
        ../../node_modules/.bin/make-cert $DEV_HOST && \
        cd ../;
        link_certs make-cert;
    elif [ $env == "local" ]; then
        echo 'making local certs';
        cd ./certs && \
        mkcert $DEV_HOST && \
        cd ../;       
        link_certs mkcert;
    elif [ $env == "prod" ]; then
        echo 'making prod certs'
        cd ./certs && \
        sudo certbot certonly --standalone -d $PROD_HOST --agree-tos -m $EMAIL --non-interactive;
        cd ../;
        link_certs certbot;
    fi;
};


make_certs;