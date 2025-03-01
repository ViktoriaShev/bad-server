# Users

#### Default admin

- login: `adminRoot@mail.ru`
- password: `password`

#### Customer 1

- login: `userName@mail.ru`
- password: `password`

# How to restore database

1. Через MongoDB Compass подключаемся к базе по адресу:

```
mongodb://root:example@localhost:27017/weblarek?authSource=admin
```

2. Выбираем коллекцию `users`, в ней `ADD DATA` и `Import JSON or CSV file`. Выбираем файл `.dump/weblarek.users.json`
3. Выбираем коллекцию `products`, в ней `ADD DATA` и `Import JSON or CSV file`. Выбираем файл `.dump/weblarek.products.json`
   Файлы изображений для продуктов уже находятся в директории backend/src/public/images/
