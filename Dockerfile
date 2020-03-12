FROM nginx

# Install prereqs
RUN apt update && apt install -y curl gnupg2

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install -y yarn

COPY ./src /usr/share/nginx/html

WORKDIR /app

EXPOSE 80
