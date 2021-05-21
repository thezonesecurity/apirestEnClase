# typescriptRest
## Installation
```bash
git clone https://github.com/Ditmar/typescriptRest.git
cd typescriptRest
npm install
docker-compose build
docker-compose up
```

## Configure Database
Check waht ip you have in the mongodb container
```bash
sudo docker ps
```
```bash
pip docker inspect <idcontainer>
```
change the ip in docker-compose.yml file 
```Docker
    environment:
      DBHOST: "mongodb://<ip>:27017"
      DATABASE: "seminario"
```
and change in the configuration database app.ts
```javascript
     let host: string = process.env.DBHOST || "mongodb://<ip>:27017";
        let database: string = process.env.DATABASE || "seminario";
        let connectionString: string = `${host}/${database}`;
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
```
## For compile
```bash
npm run build
```