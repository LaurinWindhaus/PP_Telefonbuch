FROM python:3.8

RUN apt-get update
RUN apt-get install -y --no-install-recommends \
        libatlas-base-dev gfortran nginx supervisor

RUN apt-get update --fix-missing
RUN apt-get install -y poppler-utils

RUN pip3 install uwsgi


RUN chmod +rwx /etc/ssl/openssl.cnf
RUN sed -i 's/TLSv1.2/TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/SECLEVEL=2/SECLEVEL=1/g' /etc/ssl/openssl.cnf

ENV ACCEPT_EULA=Y
RUN apt-get update && apt-get install -y gnupg2
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - 
RUN curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list 
RUN apt-get update 
RUN ACCEPT_EULA=Y apt-get -y --no-install-recommends install msodbcsql17 unixodbc-dev 





ARG nwrfc_local=/usr/local/sap
# sap nw rfc lib
RUN printf "\n# nwrfc sdk \n" >> ~/.bashrc
RUN printf "export SAPNWRFC_HOME=${nwrfc_local}/nwrfcsdk \n" >> ~/.bashrc
USER root
RUN mkdir -p ${nwrfc_local}
RUN ls /
RUN mkdir -p ${nwrfc_local}/nwrfcsdk
COPY ./nwrfcsdk ${nwrfc_local}/nwrfcsdk

RUN chmod -R a+r ${nwrfc_local}/nwrfcsdk && chmod -R a+x ${nwrfc_local}/nwrfcsdk/bin
RUN printf "# include nwrfcsdk\n${nwrfc_local}/nwrfcsdk/lib\n" |  tee /etc/ld.so.conf.d/nwrfcsdk.conf
RUN ldconfig && ldconfig -p | grep sap

RUN export SAPNWRFC_HOME=${nwrfc_local}/nwrfcsdk
ARG SAPNWRFC_HOME=${nwrfc_local}/nwrfcsdk
RUN pip3 install pyrfc 
#--no-binary :all:







COPY ./requirements.txt /project/requirements.txt

RUN pip3 install -r /project/requirements.txt

RUN useradd --no-create-home nginx

RUN rm /etc/nginx/sites-enabled/default
RUN rm -r /root/.cache

COPY server-conf/nginx.conf /etc/nginx/
COPY server-conf/flask-site-nginx.conf /etc/nginx/conf.d/
COPY server-conf/uwsgi.ini /etc/uwsgi/
COPY server-conf/supervisord.conf /etc/supervisor/

COPY src /project/src

WORKDIR /project

CMD ["/usr/bin/supervisord"]
