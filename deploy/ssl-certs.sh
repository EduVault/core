# remember to run from project root

# parse arguments
env=$1;
echo 'env: '$env;

# load envs
export $(cat .env | xargs);
# check host environment variable
echo 'host: ' $PROD_HOST;
echo 'email: ' $EMAIL;

echo 'current directory: ';
pwd;

clean_folders() {
    echo 'cleaning folders';
    cd ./deploy &&  
    rm -rf ./dev-certs; \
    mkdir ./dev-certs; \
    rm -rf ./prod-certs; \
    mkdir ./prod-certs;
};

link_certs() {
    local cert_script=$1;
    echo 'linking from: ' $cert_script;
    echo 'current directory: ';
    pwd;
    if [ $cert_script == "make-cert" ]; then
        cd ./dev-certs && \
        ln -s cert.pem localhost.crt && \
        ln -s key.pem localhost.key && \

        cd ../prod-certs && \
        ln -s cert.pem localhost.crt && \
        ln -s key.pem localhost.key;

    elif [ $cert_script == "mkcert" ]; then
        cd ./dev-certs && \
        ln -s localhost-key.pem key.pem && \
        ln -s localhost-key.pem localhost.key && \

        ln -s localhost.pem cert.pem && \
        ln -s localhost.pem localhost.crt && \

        cd ../prod-certs && \
        ln -s localhost-key.pem key.pem && \
        ln -s localhost-key.pem localhost.key && \

        ln -s localhost.pem cert.pem && \
        ln -s localhost.pem localhost.crt;

    elif [ $cert_script == "certbot" ]; then
        cd ./prod-certs && \
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
        cd ./dev-certs && \
        ../../node_modules/.bin/make-cert localhost && \
        cd ../prod-certs && \
        ../../node_modules/.bin/make-cert localhost && \
        cd ../;
        link_certs make-cert;
    elif [ $env == "local" ]; then
        echo 'making local certs';
        cd ./dev-certs && \
        mkcert localhost && \
        cd ../prod-certs  && \
        mkcert localhost && \
        cd ../;       
        link_certs mkcert;
    elif [ $env == "prod" ]; then
        echo 'making prod certs'
        cd ./prod-certs && \
        sudo certbot certonly --standalone -d $PROD_HOST --agree-tos -m $EMAIL --non-interactive;
        cd ../;
        link_certs certbot;
    fi;
};


make_certs;