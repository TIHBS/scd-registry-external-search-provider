FROM dpage/pgadmin4

COPY servers.json /pgadmin4/servers.json
COPY .pgpass /pgadmin4/.pgpass
USER root
RUN chmod 600 /pgadmin4/.pgpass
RUN chown pgadmin /pgadmin4/.pgpass
USER pgadmin