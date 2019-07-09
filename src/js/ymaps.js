import render from "../templates/modal.hbs"
import {getData} from './data'

var modal = document.querySelector('.modal'),
    placemarks = [];

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
            var coords = e.get('coords'),
                geoCoords = ymaps.geocode(coords),
                position = e.get('position');
            let content = 'Отзывов нет';

            geoCoords.then(res => {
                var obj = {};
                obj.coords = coords;
                obj.address = res.geoObjects.get(0).properties.get('text');
                obj.comments = {};

                openPopup (obj, map, position, clusterer, content);
            });
        });
    });
}

function openPopup (obj, map, position, clusterer, content) {
    modal.style.display = 'block';
    modal.innerHTML = render();
    if (window.innerWidth - position[0] < modal.offsetWidth){
        modal.style.left = `${position[0] - modal.offsetWidth}px`
    } else {modal.style.left = `${position[0]}px`};
    if (window.innerHeight - position[1] < modal.offsetHeight){
        modal.style.top = `${position[1] - modal.offsetHeight}px`
    } else {modal.style.top = `${position[1]}px`};

    var feedback = document.querySelector('.feedbacks');
    var fb = document.createElement('li');
    fb.innerHTML = content;
    feedback.appendChild(fb);

    let closeModal = document.querySelector('.close');
    
    const header = document.querySelector('.modal__header');
    header.innerHTML = obj.address;
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
            let sms = {};
            sms.d = date;
            sms.n = name.value;
            sms.p = point.value;
            sms.m = message.value;
            obj.comments = sms;
            name.value = '';
            point.value = '';
            message.value = '';
            createPlacemark(obj, map, position, clusterer);
        }
    });
}

function createPlacemark(obj, map, position, clusterer) {

    let placemark = new ymaps.Placemark(obj.coords, {
        balloonContentHeader: `<h2>${obj.comments.p}</h2>`,
        balloonContentBody: `<h3>${obj.address}</h3>${obj.comments.m}`,
        balloonContentFooter: obj.comments.d,
        hintContent: obj.comments
    }, {
        preset: 'islands#redDotIconWithCaption',
        hasBalloon: false
    });
    
    clusterer.add(placemark);
    let content = placemark.properties._data.hintContent;

    placemark.events.add('click', () => {
        openPopup(obj, map, position, clusterer, `${content.n} ${content.p} ${content.d}<br>${content.m}`);
    });
}

export {
  mapInit
}
