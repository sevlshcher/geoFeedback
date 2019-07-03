import render from "../templates/modal.hbs"
import render2 from "../templates/feedbacks.hbs"
import {getData} from './data'

var modal = document.querySelector('.modal');

function mapInit() {
  
    ymaps.ready(() => {
        var map = new ymaps.Map("map", {
            center: [59.94, 30.30], // Saint-Petersburg
            zoom: 8,
            controls: ['zoomControl']
        }, {});

        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            openBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            groupByCoordinates: false
        });
        
        map.geoObjects.add(clusterer);

        map.events.add('click', (e) => {
            var coords = e.get('coords');
            var geoCoords = ymaps.geocode(coords);
            var position = e.get('position');
            // var comment = document.querySelector('.comment');
            // comment.setContent(e.get('target').properties.get('balloonContent'));

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
    modal.style.display = 'block';
    modal.innerHTML = render();
    let closeModal = document.querySelector('.close');
    const header = document.querySelector('.modal__header');
    header.innerHTML = obj.address;
    // comment.innerHTML = render2(obj.comments);
    // function applyElementOffset() {
    //     modal.css({
    //         left: -(modal.offsetWidth / 2),
    //         top: -(modal.offsetHeight + modal.find('.arrow').offsetHeight)
    //     });
    // }
    // модалку так позиционировать по клику или я что-то путаю?
    document.addEventListener('click', e => {
        if(e.target === closeModal) {
            modal.style.display = 'none';
        }
    });
    createComment(obj, map, position, clusterer);
}

function createComment(obj, map, position, clusterer) {
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
            // modal.style.display = 'none';
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
        balloonContentHeader: `<h2>${obj.comments.sms.point}</h2>`,
        balloonContentBody: `<h3>${obj.address}</h3>${obj.comments.sms.message}`,
        balloonContentFooter: obj.comments.sms.time
    }, {
        preset: 'islands#redDotIconWithCaption'
    });

    clusterer.add(placemark);
}

export {
  mapInit
}
