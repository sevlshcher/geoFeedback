function mapInit() {
  
    ymaps.ready(() => {
        console.log("111");

        var placemark,
            map = new ymaps.Map("map", {
            center: [59.94, 30.30], // Saint-Petersburg
            zoom: 8,
            controls: ['zoomControl'],
            behavior: ['drag']
        }, {
            baloonMaxWidth: 200
        });

        map.events.add('click', function (e) {
            var coords = e.get('coords');
            placemark = createPlacemark(coords);
            map.geoObjects.add(placemark);
            getAddress(coords);
        });

        function createPlacemark(coords) {
            return new ymaps.Placemark(coords, {}, {
                preset: 'islands#redIcon'
            });
        }

        // Определяем адрес по координатам (обратное геокодирование).
        function getAddress(coords) {
            placemark.properties.set('iconCaption', 'поиск...');
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);

                placemark.properties
                    .set({
                        // Формируем строку с данными об объекте.
                        iconCaption: [
                            // Название населенного пункта или вышестоящее административно-территориальное образование.
                            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                            // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                        ].filter(Boolean).join(', '),
                        // В качестве контента балуна задаем строку с адресом объекта.
                        balloonContentHeader: firstGeoObject.getAddressLine(),
                        balloonContentBody: '<div class="feedbacks"></div>',
                        balloonContentFooter:'<div class="add-feedback">Ваш отзыв:</div>'+
                        '<br><input type="text" class="add-name-input" placeholder="Ваше имя">'+
                        '<br><input type="text" class="add-place-input" placeholder="Укажите место">'+
                        '<br><input type="text" class="add-feedback-input" placeholder="Поделитесь впечатлениями">'+
                        '<br><button class="add-button">Добавить</button>'+
                        '<style type="text/css"> .add-feedback-input {margin:10px 0; height:72px;'+
                        'width:20em; border-radius: 25px; border:1px solid #a9a9a9; padding:0 15px;}'+
                        'input {margin:10px 0;'+
                        'width:20em; border-radius: 25px; border:1px solid #a9a9a9; padding:0 15px;}'+
                        '</sryle>'
                    });
            });
            
        }
    })
}

export {
  mapInit
}
