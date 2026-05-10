const blockLeft = document.getElementById('blockLeft');
const blockRight = document.getElementById('blockRight');
const aisle = document.querySelector('.aisle');
const seatCountDisplay = document.getElementById('seatCount');
const modal = document.getElementById('resetModal');
const clickSound = document.getElementById('clickSound');


const rows = ['D', 'C', 'B', 'A'];
let availableSeats = 28;
let historyStack = [];

const firebaseConfig = {
    databaseURL: "https://salim-cinema-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function saveToFirebase() {
    const data = {
        availableSeats: availableSeats,
        bookedSeats: historyStack
    };
    // Simpan ke internet
    database.ref('cinemaData').set(data);
}

function updateCounter() {
    seatCountDisplay.innerText = availableSeats;
}

function createSeats() {
    blockLeft.innerHTML = '';
    blockRight.innerHTML = '';
    availableSeats = 28;
    historyStack = [];
    updateCounter();

    rows.forEach((rowName) => {
        // Kolom 1-4 di Kiri
        for (let col = 1; col <= 4; col++) {
            renderSeat(blockLeft, col, rowName);
        }
        // Kolom 5-7 di Kanan
        for (let col = 5; col <= 7; col++) {
            renderSeat(blockRight, col, rowName);
        }
    });

    saveToFirebase();
}


function renderSeat(container, col, rowName) {
    const seatId = `seat-${col}${rowName}`;
    const seatContainer = document.createElement('div');
    seatContainer.className = 'seat-container';

    const label = document.createElement('span');
    label.className = 'seat-label';
    label.innerText = col + rowName;

    const seat = document.createElement('img');
    seat.src = 'g.png';
    seat.className = 'seat';
    seat.id = seatId;
    seat.dataset.status = 'available';

    seat.addEventListener('click', function() {
        if (this.dataset.status === 'available') {
            if(clickSound) { clickSound.currentTime = 0; clickSound.play(); }
            historyStack.push(this.id);
            this.src = 'r.png';
            this.dataset.status = 'booked';
            this.classList.add('booked');
            availableSeats--;
            updateCounter();
            saveToFirebase();
        }
    });

    seatContainer.appendChild(label);
    seatContainer.appendChild(seat);
    container.appendChild(seatContainer);
}


function undoLastAction() {
    if (historyStack.length > 0) {
        const lastSeatId = historyStack.pop();
        const seatElement = document.getElementById(lastSeatId);
        if (seatElement) {
            seatElement.src = 'g.png';
            seatElement.dataset.status = 'available';
            seatElement.classList.remove('booked');
            availableSeats++;
            updateCounter();
            saveToFirebase();
        }
    }
}

function resetSeats() { createSeats(); closeModal(); }
function showModal() { modal.style.display = 'flex'; }
function closeModal() { modal.style.display = 'none'; }

document.addEventListener('DOMContentLoaded', createSeats);

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : 'ℹ️');
    
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => { toast.remove(); }, 3000);
}

function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (historyStack.length === 0) {
        showToast("Pilih kursi terlebih dahulu!", "warning");
        return;
    }
    modal.style.display = 'flex';
    setTimeout(() => { document.getElementById('classNameInput').focus(); }, 100);
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('classNameInput').value = "";
}

function finishPurchase() {
    const className = document.getElementById('classNameInput').value.trim();
    if (className === "") {
        showToast("Nama kelas tidak boleh kosong!", "warning");
        return;
    }

    let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const newSale = {
        id: Date.now(),
        namaKelas: className,
        jumlahKursi: historyStack.length,
        tanggal: new Date().toLocaleString('id-ID')
    };

    salesHistory.push(newSale);
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

    // OTOMATIS TUTUP DAN NOTIFIKASI
    closeCheckoutModal(); 
    resetSeats(); 
    showToast(`Penjualan untuk ${className} berhasil disimpan!`, "success");
}


function showModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

function resetSeats() {
    createSeats(); 
    closeModal();
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('DOMContentLoaded', createSeats);
