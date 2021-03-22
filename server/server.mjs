// Charge le module HTTP
import { createServer } from "http";

const hostname = "127.0.0.1";
const port = 8000;

// Crée un serveur HTTP
const server = createServer((req, res) => {
   // Configure l'en-tête de la réponse HTTP avec le code du statut et le type de contenu
   response.writeHead(200, {'Content-Type': 'text/plain'});

   // Envoie le corps de la réponse "Salut tout le monde"
   response.end('Salut tout le monde\n');
})

// Démarre le serveur à l'adresse 127.0.0.1 sur le port 8000
// Affiche un message dès que le serveur commence à écouter les requêtes
server.listen(port, hostname, () => {
   console.log(`Le serveur tourne à l'adresse http://${hostname}:${port}/`);
})