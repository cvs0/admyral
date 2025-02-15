#!/bin/bash

# Install nsjail
sudo apt install -y build-essential pkg-config flex bison protobuf-compiler libprotobuf-dev libnl-route-3-dev
git clone -b master --single-branch https://github.com/google/nsjail.git
cd nsjail && make && sudo mv nsjail /bin && cd .. && rm -rf /nsjail


# Install docker

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# fix permission denied error
sudo chmod 666 /var/run/docker.sock

# Start docker daemon
sudo service docker start


# Install pdb
sudo apt install -y python-dev-is-python3


# Git clone admyral
git clone https://github.com/Admyral-Security/admyral.git


# Install poetry
curl -sSL https://install.python-poetry.org | python3 -
echo "export PATH=\"/home/ubuntu/.local/bin:$PATH\"" >> ~/.bashrc
source ~/.bashrc
