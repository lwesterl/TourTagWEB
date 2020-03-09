# TourTagWEB
TourTag client web application

## Deployment

**Directory structure** <br>
/some-dirs/tourtag  (backend repository)  <br>
/some-dirs/TourTagWeb (this repository)

1. Install docker and docker-compose
```
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install curl
curl -sSL https://get.docker.com | sh
sudo apt-get install libffi-dev libssl-dev python python-pip
sudo pip install docker-compose
```

2. Create Docker images
```
cd frontend
./build_docker.sh
cd ../../tourtag
./build_docker.sh
```

3. Start service using docker-compose (from this dir)
```
sudo docker-compose up -d
```
After waiting a little the service should be available on ip address of the machine

4. Stop service
```
sudo docker-compose down
```
