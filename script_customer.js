const blockLeft = document.getElementById('blockLeft');
const blockRight = document.getElementById('blockRight');
const aisle = document.querySelector('.aisle');
const seatCountDisplay = document.getElementById('seatCount');

const rows = ['D', 'C', 'B', 'A'];

function updateDisplay() {
    const savedData = localStorage.getItem('cinemaData');
    if (!savedData) return;

    const data = JSON.parse(savedData);
    seatCountDisplay.innerText = data.availableSeats;

    blockLeft.innerHTML = '';
    blockRight.innerHTML = '';

    rows.forEach((rowName) => {
        // Kolom 1-4 kiri
        for (let col = 1; col <= 4; col++) renderCustomerSeat(blockLeft, col, rowName, data.bookedSeats);
        // Kolom 5-7 kanan
        for (let col = 5; col <= 7; col++) renderCustomerSeat(blockRight, col, rowName, data.bookedSeats);
    });
}

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

window.addEventListener('storage', (e) => {
    if (e.key === 'cinemaData') updateDisplay();
});

updateDisplay();