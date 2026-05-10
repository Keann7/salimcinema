const blockLeft = document.getElementById('blockLeft');
const blockRight = document.getElementById('blockRight');
const aisle = document.querySelector('.aisle');
const seatCountDisplay = document.getElementById('seatCount');

const rows = ['D', 'C', 'B', 'A'];

const firebaseConfig = {
    databaseURL: "https://salim-cinema-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


database.ref('cinemaData').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        seatCountDisplay.innerText = data.availableSeats;
        
        renderAllSeats(data.bookedSeats || []);
    }
});

function renderAllSeats(bookedSeats) {
    blockLeft.innerHTML = '';
    blockRight.innerHTML = '';

    rows.forEach((rowName) => {
        // Kolom 1-4 (Kiri)
        for (let col = 1; col <= 4; col++) {
            renderCustomerSeat(blockLeft, col, rowName, bookedSeats);
        }
        // Kolom 5-7 (Kanan)
        for (let col = 5; col <= 7; col++) {
            renderCustomerSeat(blockRight, col, rowName, bookedSeats);
        }
    });
}

database.ref('cinemaData').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    seatCountDisplay.innerText = data.availableSeats;

    blockLeft.innerHTML = '';
    blockRight.innerHTML = '';

    rows.forEach((rowName) => {
        for (let col = 1; col <= 4; col++) {
            renderCustomerSeat(blockLeft, col, rowName, data.bookedSeats || []);
        }
        for (let col = 5; col <= 7; col++) {
            renderCustomerSeat(blockRight, col, rowName, data.bookedSeats || []);
        }
    });
});

function renderCustomerSeat(container, col, rowName, bookedSeats) {
    const seatId = `seat-${col}${rowName}`;
    const isBooked = bookedSeats.includes(seatId);

    const seatContainer = document.createElement('div');
    seatContainer.className = 'seat-container';

    const label = document.createElement('span');
    label.className = 'seat-label';
    label.innerText = col + rowName;

    const seat = document.createElement('img');
    seat.src = isBooked ? 'r.png' : 'g.png';
    seat.className = 'seat';
    if (isBooked) seat.classList.add('booked');

    seatContainer.appendChild(label);
    seatContainer.appendChild(seat);
    container.appendChild(seatContainer);
}

updateDisplay();
