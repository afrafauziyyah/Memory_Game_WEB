const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Susunan items
const items = [
  { name: "bee", image: "img/bee.png" },
  { name: "crocodile", image: "img/crocodile.png" },
  { name: "macaw", image: "img/macaw.png" },
  { name: "gorilla", image: "img/gorilla.png" },
  { name: "tiger", image: "img/tiger.png" },
  { name: "monkey", image: "img/monkey.png" },
  { name: "chameleon", image: "img/chameleon.png" },
  { name: "piranha", image: "img/piranha.png" },
  { name: "anaconda", image: "img/anaconda.png" },
  { name: "sloth", image: "img/sloth.png" },
  { name: "cockatoo", image: "img/cockatoo.png" },
  { name: "toucan", image: "img/toucan.png" },
];

//Waktu Awal
let seconds = 0,
  minutes = 0;
//Pergerakan awal dan jumlah kemenangan
let movesCount = 0,
  winCount = 0;

//Untuk pengatur waktu
const timeGenerator = () => {
  seconds += 1;
  //logika menit
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format waktu sebelum ditampilkan
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Untuk menghitung gerakan
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pilih objek acak dari array item
const generateRandom = (size = 4) => {
  //array sementara
  let tempArray = [...items];
  //menginisialisasi array cardValues
  let cardValues = [];
  //ukuran harus ganda (matriks 4*4)/2 karena akan ada pasangan objek
  size = (size * size) / 2;
  //Pemilihan objek secara acak
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //setelah dipilih, hapus objek dari array temp
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //acak kartu
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
     /*
        Buat Kartu
        sebelum => sisi depan (berisi tanda tanya)
        sesudah => sisi belakang (berisi gambar sebenarnya);
        data-card-values ​​adalah atribut khusus yang menyimpan nama kartu untuk dicocokkan nanti
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Jika kartu yang dipilih belum cocok maka jalankan saja (yaitu kartu yang sudah cocok ketika diklik akan diabaikan)
      if (!card.classList.contains("matched")) {
        //membalik kartu yang diklik
        card.classList.add("flipped");
        //jika itu adalah kartu pertama (!firstCard karena firstCard awalnya salah)
        if (!firstCard) {
          //jadi kartu saat ini akan menjadi Kartu pertama
          firstCard = card;
          //nilai kartu saat ini menjadi firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //peningkatan pergerakan sejak pengguna memilih kartu kedua
          movesCounter();
          //Kartu kedua dan value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //jika kedua kartu cocok, tambahkan kelas yang cocok sehingga kartu ini akan diabaikan di lain waktu
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //setel firstCard ke false karena kartu berikutnya akan menjadi yang pertama sekarang
            firstCard = false;
            //peningkatan winCount saat pengguna menemukan kecocokan yang benar
            winCount += 1;
            //periksa apakah winCount == setengah dari cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Yey! Kamu menang😍</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //jika kartu tidak cocok
            //balikkan kartu ke normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//memulai game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //kontrol dan visibilitas button
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //memulai timer
  interval = setInterval(timeGenerator, 1000);
  //gerakan awal
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//memberhentikan game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Inisialisasi nilai dan panggilan fungsi
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
