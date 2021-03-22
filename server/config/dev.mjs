
const config = {
    "dev": {
      "name": "Projet_COVDM - Dev Mode",
      "port": 8000,
      "mode": "development",
      "protocol": "http",
      "serverUrl": "localhost",
      "database": {
        "multipleStatements": true,
        "host": "mongodb://localhost:27017",
        "name":"project_covdm",
        "user": "",
        "password": "",
        "database": ""
      },
      "email": {
        "host": "",
        "port": "",
        "username": "",
        "password": ""
      }
    }
}

export default config;