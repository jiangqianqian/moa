nginx

server {
        listen       8888;
        server_name  localhost;

        #charset koi8-r;

        location /api/ {
           proxy_pass        http://weixin1.qfang.com/qfang-weixin/qiye/;
             proxy_set_header  X-Real-IP  $remote_addr;
             proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location / {
          root D:/nosvnpage/MOA/moa;
          #  proxy_pass        http://localhost:8080/;
          #  proxy_set_header  X-Real-IP  $remote_addr;
          #  proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }