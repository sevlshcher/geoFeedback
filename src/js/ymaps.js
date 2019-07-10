import render from "../templates/modal.hbs"
import render2 from "../templates/feedback.hbs"
import {getData} from './data'

var modal = document.querySelector('.modal');
// document.addEventListener('click', e => {
//     console.log(e.target)
// })

function mapInit() {
  
    ymaps.ready(() => {
        var map = new ymaps.Map("map", {
            center: [59.94, 30.30], // Saint-Petersburg
            zoom: 8,
            controls: ['zoomControl']
        }, {});

        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            '<h2 class=ballon_header>{{ properties.balloonContentHeader }}</h2>' +
            '<div class=ballon_body><a href="#" class="link">{{ properties.balloonContentBody[0] | raw}}</a></br>{{ properties.balloonContentBody[1] | raw}}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter | raw}}</div>')

        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            openBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemContentLayout,
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
                obj.comments = {
                    list : []
                };

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
        modal.style.top = `${position[1] - modal.offsetHeight + 20}px`
    } else {modal.style.top = `${position[1]}px`};

    const feedbacks = document.querySelector('.feedbacks');
    feedbacks.innerHTML = render2(obj.comments);

    let closeModal = document.querySelector('.close');
    
    const header = document.querySelector('.modal__header');
    header.innerHTML = obj.address;
    document.addEventListener('click', e => {
        if(e.target === closeModal) {
            modal.style.display = 'none';
        }
    });
    createComment(obj, map, position, clusterer, feedbacks);
}

function createComment(obj, map, position, clusterer,feedbacks) {
    const button = document.querySelector('.button');
    const name = document.querySelector('#name');
    const point = document.querySelector('#point');
    const msg = document.querySelector('#message');
    const date = getData();
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const emptiFields = !(name.value && point.value && message.value);
        if (emptiFields) {
            alert('Незаполненное поле формы');
            return;
        }
        let sms = {};
        sms.date = date;
        sms.name = name.value;
        sms.point = point.value;
        sms.msg = msg.value;
        obj.comments.list.push(sms);
        feedbacks.innerHTML = render2(obj.comments);

        name.value = '';
        point.value = '';
        message.value = '';
        createPlacemark(obj, map, position, clusterer, feedbacks);
    });
}

function createPlacemark(obj, map, position, clusterer,feedbacks) {

    let placemark = new ymaps.Placemark(obj.coords, {
        balloonContentHeader: obj.comments.list[obj.comments.list.length-1].point,
        balloonContentBody: [obj.address, obj.comments.list[obj.comments.list.length-1].msg],
        balloonContentFooter: obj.comments.list[obj.comments.list.length-1].date,
        hintContent: obj
    }, {
        preset: 'islands#redIcon',
        hasBalloon: false
    });
    
    map.geoObjects.add(placemark);
    clusterer.add(placemark);

    document.addEventListener('click', e => {
        if (e.target.className === 'link') {
            let addressInLink = e.target.innerHTML;
            if (addressInLink === placemark.properties._data.hintContent.address) {
                openPopup(placemark.properties._data.hintContent, map, position, feedbacks);
            }
        }
    });

    placemark.events.add('click', () => {
        openPopup(obj, map, position, clusterer, feedbacks);
    });
}

export {
  mapInit
}
