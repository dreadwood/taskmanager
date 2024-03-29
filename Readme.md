# Проект «Менеджер задач» 

**Опубликованная версия доступна [тут](https://dreadwood.github.io/taskmanager/)**


## О проекте

«Менеджер задач» помогает пользователю организовывать и контролировать выполнение задач. Минималистичный интерфейс приложения не позволит пользователю отвлекаться по пустякам и сфокусирует внимание на главном — задачах.

![Главный экран](public/img/main-screen.jpg)


### Особенности

- Проект является Single Page Application (SPA)
- Реализует паттерн проектирования MVP (Model-View-Presenter)
- Загружает данные с сервера(REST API), позволяет их модифицировать, создавать и удалять
- Использует ServiceWorker для работы без интернета и синхронизации с сервером
- Генерирует моковые данные для ознакомления с приложением
- Отображает статистику согласно введенным (или сгенерированным) данным с помощью [chart.js](https://www.chartjs.org/)
- Использует в качестве сборщика [webpack](https://webpack.js.org/) с плагинами, отображение календаря с помощью [flatpickr](https://flatpickr.js.org/), работа с датами и временем — [moment](https://momentjs.com/), [he](https://github.com/mathiasbynens/he) — для экранирования данных введенных пользователем 


## Разработка


### Основные команды:

* Установка — `npm i`
* Сборка проекта — `npm run build`
* Запуск локального сервера для разработки — `npm start`
* Запуск тестирования на соответствия код-гайдам — `npm run test`
* Обновить версию Github Pages (перед выполнением нужно собрать проект) — `gh-pages`


## Каталоги:

* Все разработка ведётся в директории `src/` и в файле `public/sw.js`
* Верстка, разметка, шрифты и изображения находятся в директории `public/`
* Итоговый код собираеться в файл `public/bundle.js`
