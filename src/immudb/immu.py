from flask import Flask, request
from immudb import ImmudbClient
import uuid
import random

# Crie uma instância do Flask
app = Flask(__name__)
app.debug = True

# Defina uma rota que responde a requisições POST
client = ImmudbClient()
client.login(username="immudb", password="immudb")


@app.route('/table', methods=['GET'])
def table():
    if request.method == 'GET':
        sql = "CREATE TABLE IF NOT EXISTS test (id VARCHAR[36], title VARCHAR[150], score VARCHAR, PRIMARY KEY (id))"
        client.sqlExec(sql)
        return "Requisição POST JSON recebida com sucesso!"


@app.route('/test', methods=['POST'])
def test():
    if request.method == 'POST':
        id = uuid.uuid4()
        sql = "INSERT INTO test (id, title, score) VALUES ('" + str(id) + "', 'user-" + str(id) + "', '"+str(random.random())+"')"
        client.sqlExec(sql)
        return "Requisição POST JSON recebida com sucesso!"


if __name__ == '__main__':
    app.run(port=8081)
