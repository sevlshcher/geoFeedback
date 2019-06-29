import render from "../templates/modal.hbs"
import {getData} from './data'

var modal = document.querySelector('.modal');

function mapInit() {
  
    ymaps.ready(() => {
        var map = new ymaps.Map("map", {
            center: [59.94, 30.30], // Saint-Petersburg
            zoom: 8,
            controls: ['zoomControl'],
            behavior: ['drag']
        }, {});

        var clustererLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
                '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: clustererLayout
        });

        map.events.add('click', (e) => {
            var coords = e.get('coords');
            var geoCoords = ymaps.geocode(coords);
            var position = e.get('position');

            geoCoords.then(res => {
                var obj = {};
                obj.coords = coords;
                obj.address = res.geoObjects.get(0).properties.get('text');
                obj.comments = {};

                openPopup (obj, map, position, clusterer);
            });
        });
    });
}

    function openPopup (obj, map, position, clusterer) {
        modal.innerHTML = render();
        //let openModal = document.querySelector('.bg-modal');
        let closeModal = document.querySelector('.close');
        const header = document.querySelector('.modal_header');
        header.innerHTML = obj.address;
        document.addEventListener('click', function (e) {
            modal.style.display = 'flex';
            if(e.target === closeModal) {
                modal.style.display = 'none';
            }
        });
        createComment();
    }

        // document.querySelector('.close').addEventListener('click',function() {
        //     document.querySelector('.bg-modal').style.display = 'none'});

        function createComment(obj) {
            const comment = document.querySelector('.comment');
            const button = document.querySelector('.button');
            const name = document.querySelector('#name');
            const point = document.querySelector('#point');
            const message = document.querySelector('#message');
            const date = getData();
            button.addEventListener('click', () => {
                if (name === '' || point === '' || message === '') {
                    alert('Незаполненное поле формы');
                } else {
                    let sms = {};
                    sms.time = date;
                    sms.name = name.value;
                    sms.point = point.value;
                    sms.message = message.value;
                    obj.comments.push(sms);
                    createPlacemark();
                }
            });
        }

        function createPlacemark(coords) {
            let placemark = new ymaps.Placemark(obj.coords, {
                balloonContentHeader: obj.comments.point,
                balloonContenBody: [obj.commments[obj.comments.length - 1].name, obj.commments[obj.comments.length - 1].message],
                balloonContenFooter: obj.commments[obj.comments.length - 1].time
            }, {
                preset: 'islands#redIcon'
            });
            clusterer.add(placemark);
            map.geoObjects.add(clusterer);
        }

export {
  mapInit
}
