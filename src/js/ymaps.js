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
            '<h2 class=ballon_header>{{ properties.balloonContentHeader}}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody}}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter}}</div>'
        );

        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 300,
            clusterBalloonContentLayoutHeight: 200,
            clusterBalloonPagerSize: 5,
            clusterBalloonItemContentLayout: clustererLayout
        });
        
        map.geoObjects.add(clusterer);

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
    let closeModal = document.querySelector('.close');
    const header = document.querySelector('.modal_header');
    header.innerHTML = obj.address;
    // function applyElementOffset() {
    //     modal.css({
    //         left: -(modal.offsetWidth / 2),
    //         top: -(modal.offsetHeight + modal.find('.arrow').offsetHeight)
    //     });
    // }
    // модалку так позиционировать по клику или я что-то путаю?
    типма.жю
    document.addEventListener('click', function (e) {
        // applyElementOffset();
        modal.style.display = 'flex';
        if(e.target === closeModal) {
            modal.style.display = 'none';
        }
    });
    createComment(obj, map, position, clusterer);
}

function createComment(obj, map, position, clusterer) {
    const comment = document.querySelector('.comment');
    const button = document.querySelector('.button');
    const name = document.querySelector('#name');
    const point = document.querySelector('#point');
    const message = document.querySelector('#message');
    const date = getData();
    button.addEventListener('click', (e) => {
        if (name.value === '' || point.value === '' || message.value === '') {
            e.preventDefault();
            alert('Незаполненное поле формы');
        } else {
            let sms = {};
            sms.time = date;
            sms.name = name.value;
            sms.point = point.value;
            sms.message = message.value;
            obj.comments.sms = sms;
            name.value = '';
            point.value = '';
            message.value = '';
            createPlacemark(obj, map, position, clusterer);
        }
    });
}

function createPlacemark(obj, map, position, clusterer, coords) {
    let placemark = new ymaps.Placemark(obj.coords, {
        balloonContentHeader: obj.comments.sms.point,
        balloonContenBody: obj.comments.sms.name,
        balloonContenFooter: obj.comments.sms.time
    }, {
        preset: 'islands#redIcon'
    });

    clusterer.add(placemark);
    clusterer.events.add('click', (e) => {
        modal.style.display = 'none';
    })
}

export {
  mapInit
}
