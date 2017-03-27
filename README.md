# vk-bot
Node.js VK chat bot

## Requirements
 - Node.js >= 7.6.0
 - MongoDB >= 3.4
 - Redis

## Installation
 - `npm i`

## Running
Demo: `node index.js`
Developement: `nodemon index.js`
Production: `pm2 index.js`  - Not implemented yet!

### Running on Node.js 6.x
Demo: `npm run babel`
Developement: `npm run nodemon`
Production: `npm run pm2` - Not implemented yet!

# Features roadmap
 - [ ] Добавить раздельные чаты
 - [ ] Добавить обновление токена на сервере
 - [ ] Добавить перезапуск бота при изменении токена
 - [ ] Добавить команды для фраз и обобщить расширения
 - [ ] Формат команд: `bot cmd clanTag text` (`bot basic_hello`, `bot tt2_boss_dead RUS 12:34`)
 - [ ] Поддержка других соцсетей и чатов:
    - [ ] Discord

 - [ ] Перевести интерфейс на отдельный урл (?)
 - [ ] Добавить интерфейс для редактирования расширений
 - [ ] Добавить интерфейс для статистики
