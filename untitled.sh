./configure --prefix=/usr/local/php7 --with-config-file-path=/usr/local/php7/etc --with-mcrypt=/usr/include --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-gd --with-iconv --with-zlib --enable-xml --enable-bcmath --enable-shmop --enable-sysvsem   --enable-inline-optimization --enable-mbregex --enable-fpm --enable-mbstring --enable-ftp --enable-gd-native-ttf --with-openssl --enable-pcntl --enable-sockets  --with-xmlrpc  --enable-zip  --enable-soap --without-pear --with-gettext --enable-session --with-curl --with-jpeg-dir --with-freetype-dir --enable-opcache


cd /root && tar zxvf libmcrypt-2.5.7.tar.gz && cd libmcrypt-2.5.7
./configure --prefix=/usr/local/related/libmcrypt && make && make install
cd /root && rm -rf libmcrypt-2.5.7*

cd /root && tar zxf mhash-0.9.9.9.tar.gz && cd mhash-0.9.9.9
./configure --prefix=/usr/local/related/mhash && make && make install
cd /root && rm -rf mhash-0.9.9.9*