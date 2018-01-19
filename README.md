# vk-bot
Node.js VK chat bot

**WARNING** Do not recommend for use now. It doesn't ready.

**ВНИМАНИЕ** Если кто-то это вообще читает, Бот ещё не готов, не рекомендую использовать!

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
<!-- Demo: `npm run babel` -->
Developement: `npm run nodemon`
<!-- Production: `npm run pm2` - Not implemented yet! -->

# Features roadmap
 - [x] Добавить раздельные чаты
 - [ ] Добавить обновление токена на сервере
 - [ ] Добавить перезапуск бота при изменении токена
 - [x] Добавить команды для фраз и обобщить расширения
 - [x] Формат команд: `bot cmd clanTag text` (`bot basic_hello`, `bot tt2_boss_dead RUS 12:34`)
 - [ ] Поддержка других соцсетей и чатов:
    - [ ] Discord
 - [ ] Продумать апи лучше, структуру чат румов и вообще // vkChat = vkChatRoom???

 - [ ] Перевести интерфейс на отдельный урл (?)
 - [ ] Добавить интерфейс для редактирования расширений
 - [ ] Добавить интерфейс для статистики
