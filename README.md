[PL]
Serwer aplikacji brydżowej do zarządzania przebiegiem licytacji.
Wsparcie dla wielu systemów licytacji i ich edycji w trakcie rozgrywki.

[EN]
Bridge auction management system server with multiple bidding system support and on-the-fly edit mechanism.

To run:
- Make sure all parameters (port, hostname, schemes) are properly setup in ./app.js

Setup dependencies:
```
npm install
```

```
node ./app.js
```

To add new bidding system just add a new JSON file in ./schemes/ folder, following the structure of other files in this folder.
