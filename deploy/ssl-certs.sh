# remember to run from project root

# parse arguments
env=$1;
echo 'env: '$env;

# load envs
export $(cat .env | xargs) # check host environment variables. Might give errors if you have comments in the .env file. Those errors don't matter as long as the comments are each on a separate line.
echo 'host: ' $HOST;
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
        ln -s cert.pem $HOST.crt && \
        ln -s key.pem $HOST.key;

    elif [ $cert_script == "mkcert" ]; then
        cd ./certs && \
        ln -s $HOST-key.pem key.pem && \
        ln -s $HOST-key.pem $HOST.key && \

        ln -s $HOST.pem cert.pem && \
        ln -s $HOST.pem $HOST.crt;

    elif [ $cert_script == "certbot" ]; then
        cd ./certs && \
        ln -s /etc/letsencrypt/live/$HOST/privkey.pem key.pem && \
        ln -s /etc/letsencrypt/live/$HOST/privkey.pem $HOST.key && \

        ln -s /etc/letsencrypt/live/$HOST/fullchain.pem cert.pem && \
        ln -s /etc/letsencrypt/live/$HOST/fullchain.pem $HOST.crt;
    fi;
};

make_certs() {
    clean_folders;
    echo 'current directory: ';
    pwd;
    if [ $env == "ci" ]; then
        echo 'making CI certs';    
        cd ./certs && \
        ../../node_modules/.bin/make-cert $HOST && \
        cd ../;
        link_certs make-cert;
    elif [ $env == "local" ]; then
        echo 'making local certs';
        cd ./certs && \
        mkcert $HOST && \
        cd ../;       
        link_certs mkcert;
    elif [ $env == "prod" ]; then
        echo 'making prod certs'
        cd ./certs && \
        sudo certbot certonly --standalone -d $HOST --agree-tos -m $EMAIL --non-interactive;
        cd ../;
        link_certs certbot;
    fi;
};


make_certs;