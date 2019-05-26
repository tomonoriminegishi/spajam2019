FROM amazonlinux:latest

RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs zip
RUN npm install -g yarn

RUN mkdir /test
COPY ./package.json /test/

WORKDIR /test

ENTRYPOINT ["yarn"]
CMD ["install"]
