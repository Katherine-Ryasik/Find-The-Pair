
// обьявляем переменные для смены офрмления
var body = document.body,
	cards = document.querySelector('.cards'),
 	caption = document.querySelector('.caption'),
 	secondCaption = document.querySelector('.second--caption'),
	wrap = document.querySelector('.wrap'),
    levelH = document.getElementById('level'),
    levelPointsH = document.getElementById('level_points'),
    totalPointsH = document.getElementById('total_points');
	// changeClassButton = document.querySelector('.change_style_body');

// функция меняющая стили body на клик по кнопке (стили прописаны для  боди, контейнера для карт, заголовков, дива-обертки)
 function changeClassButton() {
	body.classList.toggle('new--body');
 	cards.classList.toggle('cards--new--style_property'); //меняем стили контейнера ,в котором хранятся карты
 	caption.classList.toggle('logo__new--style--main--caption'); //меняем стили главного заголовка
  	secondCaption.classList.toggle('wrap__new--style--second-caption'); //меняем стили второго заголовка
  	wrap.classList.toggle('new--style_body__wrap'); //меняем стили главного div
    // seconds.classList.toggle('new--style__timer');
};

//обьявляем переменные для карточного поля
var  countTens = document.getElementById("tens"),
     countSeconds = document.getElementById("seconds"),
     levelPoints = document.getElementById("level_points"),
     winText = document.getElementById("win--the--text"),
     winDiv = document.getElementById("win--text"),
     sizeArea = 10,
     conteiner,
     count = 0,
     cards,
     seconds = 00,
     tens = 00, 
     mark = false,
     resultsArray = [],
     resultsUser = {size10:[],size16:[],size20:[],size24:[]},
     timesInterval,
     choice = document.getElementById("choice"),
     img = [
          'knaveOfDiamonds', //валет бубновый
     	  'knaveOfHearts', //валет червей
     	  'knaveOfSpades', //валет пиковый
     	  'queenOfDiamonds',//дама бубновая
     	  'queenOfSpades', //дама пиковая
     	  'queenOfHearts',//дама червей
     	  'kingOfHearts',//король червей
     	  'kingOfDiamonds',//король бубновый
     	  'kingOfSpades',//король пиковый
     	  'tenOfDiamonds',//десятка бубновая
     	  'tenOfHearts',//десятка червей
     	  'tenOfSpades',// десятка пиковая
         ];// массив карт, которые добавятся в контейнер
var localValue = JSON.parse(localStorage.getItem('DB'));

if(localValue){
    resultsUser=localValue;
} else localStorage.setItem('DB',JSON.stringify(resultsUser));

    defaultLevel(); //заполняем контейнер для карт при загрузке

//функция для заполнения контейнера для карт
function defaultLevel() {
    var lastLevelPoints, level = identefySizeDesk().length+1;
    if(identefySizeDesk().length===0){lastLevelPoints=0;}
    else {lastLevelPoints = identefySizeDesk()[(identefySizeDesk().length-1)]}
    fillingTheArea(randomArray(img,sizeArea));//выводим в рандомном порядке карты на экран, согласно значению value, заданному по-умолчанию
    levelH.innerHTML =  level;
    seconds = 00,
    tens = 00;
    countTens.innerHTML=tens;
    countSeconds.innerHTML=seconds;
    levelPointsH.innerHTML =  lastLevelPoints;
    totalPointsH.innerHTML =  sumPoints(identefySizeDesk())
    clearInterval(timesInterval);  //обнуляем интервал для того, чтобы таймер не ускорялся с последующим кликом
}



//функция для изменения размера контейнера
choice.onchange = function () {
    sizeArea = this.value;
    defaultLevel();
}


//функция для формирования рандомного порядка карт в массиве
function randomArray(array,size) {
    var outerArray = [],
    rand,
    outRandArray;
    while(outerArray .length <size){
        rand = Math.floor(Math.random()*array.length);
        if (outerArray .indexOf(array[rand])===-1){
            outerArray .push(array[rand]);//добавляем массив карт
            outerArray .push(array[rand]);//повторно добавляем массив карт(дублируем его)
        }
    }
    for (var i = 0; i < outerArray.length-1; i++) {
        rand = Math.floor(Math.random()*(outerArray.length-1));
        outRandArray= outerArray[rand];
        outerArray[rand] = outerArray[outerArray.length-1];
        outerArray[outerArray.length-1] = outRandArray;
    }
    return outerArray ;
}
//функция для добавления нового контейнера для карт, блоков содержащих карты и присвоения классов новым блокам 
function newConteiner() {
    if (conteiner) {
        conteiner.parentNode.removeChild(conteiner);
    }
        var cardsCont = document.getElementById('cards');
        conteiner = document.createElement('div');
        conteiner .className = 'new--cards';
        cardsCont.appendChild(conteiner);
}

//функция для добавления карт, и присвоения классов картам 
function fillingTheArea(array) {
    newConteiner();
    for (var i = 0; i < array.length; i++) {
        var div = document.createElement('div');
        var img = document.createElement('IMG');
        img.className = 'each--img';
        img.src = 'cards/' + array[i] + '.jpg';
        div.className = 'close_first';
        div.dataset.item = array[i]; //атрибут data даст нам возможность сравнивать открытые карты
        img.id = 'img' + i;
        div.appendChild(img);
        conteiner.appendChild(div);
        div.setAttribute('onClick','findThePair(this)')
        }
    intervalOpenCard('close',3000,'close_first');
}

//функция для открытия карт и присвоения классов картам и проверки наличия классов у карт
function findThePair(i) {
    if (i.className === 'close') {
        // if (i.className === 'new--div close') {
        i.className = 'open';
        var value = i.dataset.item; //сравниваем data-item карт, для того, чтобы найти пару
        resultsArray.push(value);
        clearInterval(timesInterval); //обнуляем интервал для того, чтобы таймер не ускорялся с последующим кликом
        timesInterval = setInterval(startTheTimer,10);
    }
    if (resultsArray.length > 1) {
        if (resultsArray[0] === resultsArray[1]) { //сравниваем две открытые карты
            intervalOpenCard("true",500,'open'); //определяем пару
            count++;
            win();
            resultsArray = [];
        } else {//если data-item не идентичны, закрываем карты
            intervalOpenCard("close",500,'open');
            resultsArray = [];
        }
    }
}

//функция задающая интервал открытых карт
function intervalOpenCard(className,time,classFind) {
    var x = document.getElementsByClassName(classFind);
    setTimeout(function() {
        for(var i = (x.length - 1); i >= 0; i--) {
            x[i].className = className;
        }
    },time)
}
//функция, сообщающая о времени сыгранной игры в случае победы
function  win() {
    if(count === sizeArea/2) {
        clearInterval(timesInterval);
        pointsDuringTheGame();
        showWinText();
        count=0;
        pointsDuringTheGame();
        console.log("Your time was " + seconds + ":" + tens);
        localStorage.setItem('DB',JSON.stringify(resultsUser));
        defaultLevel()
    }

}

//функция суммирующая очки
function sumPoints(massPoints){
    var sum=0;
    for (var i=0;i<massPoints.length;i++){
        sum += massPoints[i];
    } return sum;
}
//функция для запуска таймера
function startTheTimer () {
    tens++;
    mark=true;
    if(tens < 9)countTens.innerHTML = "0" + tens;
    if (tens > 9)countTens.innerHTML = tens;
    if (tens > 99) {
        seconds++;
        countSeconds.innerHTML = "0" + seconds;
        tens = 0;
        countTens.innerHTML = "0" + 0;
    }if (seconds > 9)countSeconds.innerHTML = seconds;
}
//функция останавливающая таймер при клике на кнопку
function pauseTimerGame() {
    if(mark){
        mark=false;
        clearInterval(timesInterval);
    }else {
        mark=true;
        timesInterval = setInterval(startTheTimer, 10);
    }
}
//функция,отображающая очки за скорость прохождения игры
function pointsDuringTheGame(){
    var points;
    if (seconds <=5 ) {
        points=1
    }if (seconds >5 && seconds<=10) {
        points=2
    }if (seconds >10 && seconds <=15) {
        points=3
    }if (seconds > 15 && seconds <=25) {
        points=4
    }if (seconds > 25) {
        points=4
    }identefySizeDesk().push(points);;
   }
   
//функция,отображающая сообщение о выиграше
function showWinText(){
        winDiv.style.display="block";
        winText.innerHTML="Your time was " + seconds + ":" + tens;
 setTimeout(function() {
        winDiv.style.display="none";
    }, 1000);
}
// Return mass of right sizeDesk from user
function identefySizeDesk() {
    if(sizeArea==10){return resultsUser.size10}
    if(sizeArea==16){return resultsUser.size16}
    if(sizeArea==20){return resultsUser.size20}
    if(sizeArea==24){return resultsUser.size24}
}





