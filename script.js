const pemain = ['Player 1', 'Player 2'];
const jumlahBaris = 6;
const jumlahKolom = 7;

let pemainSekarang; // ini buat nentuin giliran siapa sekarang
let gameOver; // ini buat nentuin udah game over atau belum
let board; // ini buat gambaran board game-nya dalam bentuk array 2 dimensi (value-nya nanti akan diisi sama array 2 dimensi)
let kolom; // ini buat nentuin tinggi kolom yang tersisa di kolom yang ditekan di board game-nya

window.onload = setPermainan; // kalau udah termuat, langsung eksekusi function setPermainan()

function setPermainan() {
    gameOver = false;
    pemainSekarang = pemain[0];
    kolom = Array(jumlahKolom).fill(jumlahBaris - 1);
    board = Array.from({ length: jumlahBaris }, () => Array(jumlahKolom).fill('')); // isinya array 2 dimensi yang jumlah barisnya ada 6 sama jumlah kolomnya ada 7
    
    document.getElementById('board').style.cursor = "pointer"; // set kursornya jadi yang 'pointer' kalau kursornya ada di atas board

    for (let r = 0; r < jumlahBaris; r++) {
        for (let c = 0; c < jumlahKolom; c++) {
            const keping = buatKeping(r, c);
            document.getElementById("board").append(keping); 
        }
    }
}

function buatKeping(r, c) { // ini buat bikin kepingan-kepingan (yang lingkaran-lingkaran itu) di board HTML-nya
    const keping = document.createElement("div");
    keping.id = `${r}-${c}`;
    keping.classList.add("keping");
    keping.addEventListener("click", letakinKeping);
    return keping;
}

function letakinKeping() {
    if (gameOver) return; // kalau udah game over, kepingnya ngga akan diletakin

    const [_, c] = this.id.split("-").map(Number); // buat nentuin keping yang diklik itu di baris berapa sama kolom berapa
    if (kolom[c] < 0) return; // kalau jumlah keping di kolom itu udah penuh, ngga akan diletakin keping lagi karena udah penuh

    board[kolom[c]][c] = pemainSekarang; // buat letakin keping ke board-nya sesuai sama giliran player sekarang
    const keping = document.getElementById(`${kolom[c]}-${c}`);
    keping.classList.add(pemainSekarang === pemain[0] ? "keping-merah" : "keping-kuning"); // buat kasih warna keping-nya. Kalau giliran player sekarang itu player 1, warnanya jadi merah; kalau player 2, jadi kuning

    kolom[c]--; // tinggi kolom yang tersisa di kolom yang diklik akan dikurangin sama 1 karena tadi udah diletakin satu keping di kolom itu

    cekApakahGameOver();
    ubahGiliran();
}

function ubahGiliran() {
    pemainSekarang = pemainSekarang === pemain[0] ? pemain[1] : pemain[0]; // ini command yang buat ganti giliran

    document.querySelectorAll('.box-player').forEach((elemen, i) => {
        if (gameOver) {
            elemen.lastElementChild.innerText = 'Menang!';
            return;
        }

        elemen.lastElementChild.textContent = "Giliranmu";
        if (pemainSekarang === pemain[i])
            elemen.classList.add('active');
        else
            elemen.classList.remove('active');
    })
}

function cekApakahSeri() {
    for (let r = 0; r < jumlahBaris; r++) {
        for (let c = 0; c < jumlahKolom; c++) {
            if (board[r][c] === '')
                return false;
        }
    }
    return true;
}

function cekApakahGameOver() {
        for (let r = 0; r < jumlahBaris; r++) {
            for (let c = 0; c < jumlahKolom; c++) {
                // Cek horizontal
                if (c < jumlahKolom - 3 && board[r][c] !== '' &&
                    board[r][c] === board[r][c + 1] &&
                    board[r][c + 1] === board[r][c + 2] &&
                    board[r][c + 2] === board[r][c + 3]) {
                    setPemenang();
                    return;
                }
    
                // Cek vertikal
                if (r < jumlahBaris - 3 && board[r][c] !== '' &&
                    board[r][c] === board[r + 1][c] &&
                    board[r + 1][c] === board[r + 2][c] &&
                    board[r + 2][c] === board[r + 3][c]) {
                    setPemenang();
                    return;
                }
    
                // Cek diagonal1
                if (r < jumlahBaris - 3 && c < jumlahKolom - 3 && board[r][c] !== '' &&
                    board[r][c] === board[r + 1][c + 1] &&
                    board[r + 1][c + 1] === board[r + 2][c + 2] &&
                    board[r + 2][c + 2] === board[r + 3][c + 3]) {
                    setPemenang();
                    return;
                }
    
                // Cek diagonal2
                if (r >= 3 && c < jumlahKolom - 3 && board[r][c] !== '' &&
                    board[r][c] === board[r - 1][c + 1] &&
                    board[r - 1][c + 1] === board[r - 2][c + 2] &&
                    board[r - 2][c + 2] === board[r - 3][c + 3]) {
                    setPemenang();
                    return;
                }
            }
        }

    new Audio('Assets/suara_stack.ogg').play(); // ini buat play suara meletakkan keping ke board
    
    if (cekApakahSeri()) { // ini kalau hasil akhirnya seri
        gameOver = true;
        document.querySelectorAll('.box-player').forEach((elemen) => elemen.classList.remove('active')); // hapus class 'active' di semua box-player biar ngga ada yang punya border
        kirimPesan('Permainan Seri', 'Tidak ada yang menang'); // kalau hasil akhirnya seri, bakal dikirim pop-up pesan yang kasih tahu kalau hasil permainannya seri
        document.getElementById('board').style.cursor = "not-allowed"; // buat set kursornya jadi yang 'not-allowed' kalau kursornya ada di atas board
    }
}

function setPemenang() { // ini kalau ada yang menang
    gameOver = true;
    document.getElementById('board').style.cursor = "not-allowed"; // buat set kursornya jadi yang 'not-allowed' kalau kursornya ada di atas board
    new Audio('Assets/suara_menang.ogg').play(); // ini buat play suara kalau ada yang menang
    kirimPesan('Pemenang:', `<span style="font-size: 1.5rem;" class="${pemainSekarang === pemain[0] ? 'player-merah' : 'player-kuning'}">${pemainSekarang}</span>`);
    document.querySelector('.box-player.active').classList.add('pemenang'); // buat nambahin class 'pemenang' ke box-player yang jadi pemenangnya, biar punya border yang warnanya kuning
}

function restart() {
    const board = document.getElementById('board');
    const boxPlayer1 = document.querySelector('.box-player');

    if (!cekApakahSeri() && gameOver)
        document.querySelector('.box-player.active.pemenang').classList.remove('pemenang'); // kalau sebelumnya ada yang menang dan hasilnya bukan seri, class 'pemenang' tadi bakal dihapus biar warna border-nya jadi putih lagi

    document.querySelectorAll('.box-player').forEach((elemen) => elemen.classList.remove('active')); // buat hapus class 'active' di semua box-player
    boxPlayer1.classList.add('active'); // habis semuanya dihapus, box-player player 1 bakal ditambahin class 'active' biar ketampil ada border-nya lagi
    boxPlayer1.lastElementChild.innerText = 'Giliranmu';

    while (board.firstChild) {
        board.removeChild(board.lastChild); // buat hapus semua keping yang udah diletakin di board
    }

    setPermainan();
}

function kirimPesan(judul, isiPesan) { // function buat kirim pop-up pesan (pakai sweetalert2)
    Swal.fire({
        icon: 'info',
        title: judul,
        html: isiPesan,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Oke',
        denyButtonText: 'Restart',
    }).then((result) => {
        if (result.isDenied) {
            Swal.fire('Game telah di-restart', '', 'success');
            document.body.classList.remove('swal2-height-auto');
            restart();
        }
    })

    document.body.classList.remove('swal2-height-auto');
}