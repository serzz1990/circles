# Circles

JavaScript библиотека, которая генерирует круговые диаграммы в SVG и анимирует их.

![Circles](http://s36-temporary-files.radikal.ru/0595fd1fe33047ada47468cc5e2adcf4/-929206895.jpg)

### Usage

Подключите `circles.js` в HTML файле.

```html
<script src="circles.js"></script>
<div id="с"></div>
```

Создадим SVG элемент:

```js
var chart = document.createElementSvgCircles();
// Теперь поместим его на страницу
document.querySelector('#c').appendChild(chart);
// или с помощью jQuery 
$('#c').append(chart);
```



Добавим круги в SVG элемент

```js
chart.add({
    start: 0,         
    percent: 50,      
    radius: 28,       
    width: 11,       
    opacity: 1,      
    color: '#4DAAFF', 
    name : 'percent'  
});
```

Где

* `start` 		    - `Number` Началиная точка круга (default `0`, min `0`, max `100`)
* `percent` 		- `Number` *Обязательно. Конечная точка круга ( min `0`, max `100`)
* `radius` 		    - `Number` Радиус (default `50`, min `0`, max `50`)
* `width` 		    - `Number` Ширина круга (default `0.1`, min `0`, max `50`)
* `opacity` 		- `Number` Прозрачность круга (default `1`, min `0`, max `1`)
* `rotate` 		    - `Number` Процент поворота (default : `0`)
* `color` 		    - `String` Цвет (default : Случайный)
* `name` 		    - `String` Название круга, а так же className (default : `null`)



### SVG Element - API 

```js
chart.add(Array кругов или Object круга);
```

Добавляет один или несколько кругов в SVG элемент.
Вернет добавленые преобразованные экземпляры кругов.

```js
chart.get([,String])
```

Получает все круги или результат запроса. Например поиск по имени: chart.get('className'). 
Вернет один или несколько экземпляров кругов.


### Circle Element - API 

```js
Circle.update(Object params [,duration ,callback]);
//or
Circle.update(String param, String value [,duration ,callback]);
```

Обновляет параметры круга с анимвцией или без.
Возвращает экземпляр круга.

```js
Circle.delay(Number)
```

Устанавливает задержку запуска анимации.
Возвращает экземпляр круга. 

```js
Circle.stop(Number time [,callback])
```

Останавливает анимацию и очищает очередь.
Возвращает экземпляр круга. 



### Licence

MIT License.

### Changelog

* 0.3.0    Добавлен параметр rotate и метод остановки анимации.
* 0.2.0    Добавлена задержка и очередь анимации.
* 0.1.0    Добавлена анимация цвета1.
* 0.0.1    Первый релиз.
