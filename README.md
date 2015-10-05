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

* `start` 		    - Началиная точка круга (default `0`, min `0`, max `100`)
* `percent` 		- *Обязательно. Конечная точка круга ( min `0`, max `100`)
* `radius` 		    - Радиус (default `50`, min `0`, max `50`)
* `width` 		    - Ширина круга (default `0.1`, min `0`, max `50`)
* `opacity` 		- Прозрачность круга (default `1`, min `0`, max `1`)
* `color` 		    - Цвет (default : Случайный)
* `name` 		    - Название круга, а так же className (default : `null`)



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
chart.delay(Number)
```

Устанавливает задержку запуска анимации.
Возвращает экземпляр круга. 



### Licence

MIT License.

### Changelog

* 0.2.0    Добавлена задержка и очередь анимации.
* 0.1.0    Добавлена анимация цвета1.
* 0.0.1    Первый релиз.
