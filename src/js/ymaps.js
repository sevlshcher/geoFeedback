function mapInit() {
  
    ymaps.ready(() => {
        var clustererLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
                '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        var placemark,
            map = new ymaps.Map("map", {
            center: [59.94, 30.30], // Saint-Petersburg
            zoom: 8,
            controls: ['zoomControl'],
            behavior: ['drag']
        }, {
            baloonMaxWidth: 200
        });
    
        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: clustererLayout
        });

        map.events.add('click', function (e) {
            var coords = e.get('coords');
            var geoCoords = ymaps.geocode(coords);
            // var adress = geoCoords.geoObjects.get(0).properties.get('text');
            document.querySelector('.bg-modal').style.display = 'flex';
            createPlacemark(coords);
        });
        
        document.querySelector('.close').addEventListener('click',function() {
            document.querySelector('.bg-modal').style.display = 'none'});

        

        const button = document.querySelector('button');
        button.addEventListener('click', (e) => {
            e.preventDefault()});

        function createPlacemark(coords) {
            const name = document.querySelector('name').value;
            const point = document.querySelector('point').value;
            const message = document.querySelector('message').value;

            if (name === '') {
              alert('Как тебя зовут?');
            } else if (point === '') {
              alert('Откуда ты?');
            } else if (message === '') {
              alert('Неужели ты ничего не расскажешь?');
            } else {
                return new ymaps.Placemark(coords, {}, {
                    preset: 'islands#redIcon'
                });
            }
        }
    })
}

export {
  mapInit
}
