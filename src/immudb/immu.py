from flask import Flask, request
from immudb import ImmudbClient
import uuid

# Crie uma instância do Flask
app = Flask(__name__)
app.debug = True

# Defina uma rota que responde a requisições POST
client = ImmudbClient()
client.login(username="immudb", password="immudb")            


@app.route('/exemplo', methods=['POST'])
def exemplo():
    # Verifique se a requisição é do tipo POST
    if request.method == 'POST':
        if request.headers['Content-Type'] == 'application/json':

            # Use o método json para analisar os dados JSON do corpo da requisição
            dados_json = request.json

            # Faça algo com os dados JSON (por exemplo, imprima-os)
            user = dados_json[0]['user']

            sql = "INSERT INTO certificate (id, title, dim_score, status) VALUES ('" + str(uuid.uuid4()) + "', '" + user + "', '10.101010', 'CREATED')"
            client.sqlExec(sql)
            # client.logout()

            # Retorne uma resposta
            return "Requisição POST JSON recebida com sucesso!"

if __name__ == '__main__':
    # Inicie o servidor Flask na porta 5000
    app.run(port=8081)
