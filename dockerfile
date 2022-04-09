FROM 172.16.100.39/docker/nginx:spa-1.4
ADD ./dist/ /usr/share/nginx/html
# RUN curl $AUTH_UPDATE_URL   # 需要升级踢线请移除注释
#dev: $AUTH_UPDATE_URL=http://dev.auth.authority-web-v2.172.16.90.27.xip.io/account/clientOffline?tenantCode=[当前项目租户名]&clientCode=[当前项目客户端]&latestVersion=[当前项目版本号]
#qas: $AUTH_UPDATE_URL=http://uat.auth.authority-web-v2.172.16.90.28.xip.io/account/clientOffline?tenantCode=[当前项目租户名]&clientCode=[当前项目客户端]&latestVersion=[当前项目版本号]
#app: $AUTH_UPDATE_URL=http://dev.auth.authority-web-v2.172.16.90.27.xip.io/account/clientOffline?tenantCode=[当前项目租户名]&clientCode=[当前项目客户端]&latestVersion=[当前项目版本号]