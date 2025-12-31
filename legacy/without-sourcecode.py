from tkinter import Tk, Label, Entry, Button, messagebox
from bs4 import BeautifulSoup
import requests

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

def verification(value, window):
    if value == '!!!!!!!!!!!!' and security == '1':
        window.destroy()
    else:
        messagebox.showerror(title='ERROR', message='Licença incorreta.')

def check_input():
    value = input.get()
    verification(value, window)

window = Tk()
window.title('Sistema de Verificação')
window.geometry('300x150')

text = Label(master=window, text='Insira sua licença.')
text.pack(pady=10)

input = Entry(master=window, width=30)
input.pack()

submit = Button(master=window, text='Verificar', command=check_input)
submit.pack(pady=15)

window.mainloop()
