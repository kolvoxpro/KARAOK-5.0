# KARAOKÊ 5.0
> **"Transforme qualquer festa em um palco."**
> *Seu karaokê profissional com controle pelo celular, pontuação, playlists, efeitos e milhares de músicas.*

---

## 🎤 Visão Geral

O **KARAOKÊ 5.0** é uma plataforma profissional de entretenimento completa voltada para bares, pubs, festas particulares, operadoras de som, DJs e uso residencial de alto nível.

A arquitetura separa o controle do operador da experiência visual da plateia e permite que qualquer convidado utilize o próprio smartphone para escolher músicas, entrar na fila da apresentação e interagir enviando reações ao vivo para o telão/TV via QR Code dinâmico.

---

## 🚀 1. Como Instalar

Certifique-se de possuir o **Node.js (versão 18 ou superior)** instalado.

```bash
# 1. Clone o repositório ou acesse a pasta raiz do projeto
cd karaoke-5.0

# 2. Instale as dependências do projeto
npm install
```

---

## ⚙️ 2. Como Configurar e Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Porta do servidor (padrão 3000)
PORT=3000

# URL pública da aplicação (para geração correta do QR Code de celulares em rede local ou produção)
APP_URL=http://localhost:3000

# Modo de ambiente (development ou production)
NODE_ENV=development
```

---

## 💾 3. Como Configurar o Banco de Dados

O KARAOKÊ 5.0 conta com um banco de dados estruturado com persistência em disco localizada em `/data/karaoke_db.json`.

- **Esquema de dados nativo:**
  - `users`: Usuários e operadores com papéis (operator, admin, guest)
  - `events`: Eventos ativos e históricos com código de sessão exclusivo
  - `songs`: Catálogo de músicas completas com letras sincronizadas por tempo (`time` e `text`)
  - `queue`: Fila de reprodução em tempo real com posição e tempo de espera estimado
  - `scores`: Histórico de pontuações (0 a 100), notas vocais, energia e fotos
  - `reactions`: Contadores e registros de reações (🔥, 👏, ❤️, 😂, 🎤, ⭐, 🚀)
  - `playlists`: Playlists e modo Auto-DJ
  - `settings`: Configurações de marca, temas neon, atalhos e moldura de foto
  - `plans`: Pacotes comerciais (Prata, Ouro, Diamante)
  - `tickets`: Chamados do helpdesk de suporte

> **Migrações e Inicialização:** O banco de dados é auto-inicializado com mais de 18 clássicos nacionais e internacionais (Sertanejo, Pagode, MPB, Rock, Pop, Gospel, etc.) prontos para cantar.

---

## 💻 4. Como Executar Localmente

### Modo Desenvolvimento:
```bash
npm run dev
```
Acesse no seu navegador: `http://localhost:3000`

### Modo Produção:
```bash
npm run build
npm start
```

---

## ☁️ 5. Como Fazer Deploy

1. Compile o frontend: `npm run build`
2. Configure a variável `NODE_ENV=production` e `PORT=3000`
3. Execute o servidor de produção: `node dist/server.js` ou `tsx server.ts`
4. Compatível com plataformas como Google Cloud Run, Railway, Render, VPS Ubuntu/Debian e Docker.

---

## 📺 6. Como Configurar o Modo Público (TV / Projetor)

1. No computador do operador, clique no botão **"Modo TV (Monitor 2)"** ou abra a URL:
   ```
   http://localhost:3000/?mode=public
   ```
2. Essa tela foi desenhada no padrão **16:9 Full HD e 4K**, com tipografia legível a longas distâncias, ausência de controles administrativos, letras progressivas coloridas e animações de reações da plateia.
3. Pressione `F11` para colocar o navegador em tela cheia na TV.

---

## 🖥️ 7. Como Utilizar Dois Monitores (Dual Screen)

1. Conecte sua TV ou projetor na saída de vídeo do computador (HDMI, DisplayPort ou adaptador USB-C).
2. No Windows, pressione o atalho **`Windows + P`** e selecione a opção **"Estender"** (não utilize duplicar).
3. Abra o KARAOKÊ 5.0:
   - **Monitor 1 (Seu notebook/computador):** Mantenha o **Painel do Operador** aberto com fila, atalhos, volume e busca.
   - **Monitor 2 (TV do bar/festa):** Abra a **Tela Pública** clicando em "Abrir Tela Pública em Nova Janela" no painel e arraste-a para a TV.

---

## 📱 8. Como Conectar o Celular dos Convidados e QR Code

1. No painel do operador ou na TV, clique em **"QR Code para Convidados"**.
2. O sistema gera automaticamente um QR Code dinâmico com link direto para o celular:
   ```
   http://seu-ip-ou-dominio:3000/?mode=mobile&session=KARAOKE50
   ```
3. O convidado apenas abre a câmera do smartphone e escaneia.
4. Pelo celular, o convidado pode:
   - Buscar músicas por título, artista ou gênero
   - Entrar na fila informando seu nome
   - Escolher ajuste de tom (+1, 0, -1)
   - Acompanhar sua posição na fila ("Sua posição: #3")
   - Enviar reações ao vivo (🔥, 👏, ❤️, 😂, 🎤, ⭐, 🚀) que flutuam na TV!

---

## 💳 9. Como Configurar o Pagamento dos Planos

1. Acesse a seção de **Planos** na Landing Page ou o **Painel Administrativo Master**.
2. Planos padrão configurados:
   - **Pacote Prata:** R$ 37,00 (Acervo, player, controle de tom, QR Code)
   - **Pacote Ouro:** R$ 57,00 (Reações avançadas, foto do cantor, Auto-DJ, sugestões)
   - **Pacote Diamante:** R$ 77,00 (Todos os recursos, dual screen 4K, suporte 24/7)
3. O sistema possui arquitetura de checkout com validação de status (`status: APROVADO`), geração de ID de transação e liberação imediata pós-confirmação.

---

## 🔌 10. Integrações Externas e Modo Offline

- **Funcionamento Offline:** Se o computador estiver sem internet, o KARAOKÊ 5.0 entra em modo offline local automaticamente. O player, controle de tom, fila, acervo e pontuação funcionam sem interrupção.
- **Microfone & Análise Vocal:** O sistema utiliza a **Web Audio API** do navegador para captar o microfone via `navigator.mediaDevices.getUserMedia` e calcular o índice de energia vocal para a pontuação!
- **Modo Foto do Cantor:** Utiliza a webcam conectada para capturar o cantor no momento triunfal e renderizar uma moldura de show comemorativa com nome, nota e download em PNG.

---

## ⌨️ 11. Atalhos de Teclado do Operador

| Tecla | Ação |
| :--- | :--- |
| **Espaço (Space)** | Tocar / Pausar música atual |
| **Enter** | Chamar próximo cantor / Finalizar |
| **Esc** | Parar reprodução (Stop) |
| **Seta para Cima (↑)** | Aumentar volume |
| **Seta para Baixo (↓)** | Diminuir volume |

---

*Desenvolvido com padrão de qualidade e tecnologia para transformar qualquer festa em um show inesquecível.*
