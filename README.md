# Circles

JavaScript библиотека, которая генерирует круговые диаграммы в SVG и анимирует их.

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
* `percent` 		- Конечная точка круга (default `0`, min `0`, max `100`)
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
//Или
Circle.update(String param, String value [,duration ,callback]);
```

```js
var circlePercent = chart.get('percent');
circlePercent.update({percent:96}, 2000, function( circle ){  console.log('circle',this);  });
```
Обновляет параметры круга с анимвцией или без.
Возвращает экземпляр круга


### Licence

MIT License.

### Changelog

* 0.0.1    Первый релиз.
