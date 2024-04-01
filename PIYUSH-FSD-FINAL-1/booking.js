
$(document).ready(function () {
    // Define the number of rows and columns for the seat selection grid
    const numRows = 5;
    const numCols = 10;
    const basePrice = 200; // Base price per ticket
    const premiumPrice = 5; // Additional price for premium seats
    const bookedSeats = ['1E', '5E', '5F']; // Example of already booked seats
    const disabledSeats = ['1A', '3B', '2C']; // Example of disabled seats

    let selectedSeats = [];

    // Generate the seat selection interface
    for (let i = 1; i <= numRows; i++) {
        let row = $('<div class="row mb-2">');
        for (let j = 1; j <= numCols; j++) {
            let seatNumber = i + String.fromCharCode(64 + j);
            let seat = $('<div class="seat">').text(seatNumber);
            if (bookedSeats.includes(seatNumber)) {
                seat.addClass('booked').prop('disabled', true);
            } else if (disabledSeats.includes(seatNumber)) {
                seat.addClass('disabled').prop('disabled', true);
            }
            row.append(seat);
        }
        $('#seatSelection').append(row);
    }

    // Handle seat selection
    $('.seat').click(function () {
        if (!$(this).hasClass('booked') && !$(this).hasClass('disabled')) {
            let seat = $(this).text();
            if (!selectedSeats.includes(seat)) {
                if (selectedSeats.length >= 3) {
                    alert('You can select a maximum of 3 seats.');
                    return;
                }
                selectedSeats.push(seat);
                $(this).addClass('selected');
            } else {
                selectedSeats = selectedSeats.filter(item => item !== seat);
                $(this).removeClass('selected');
            }
            updateTotalPrice();
        }
    });

    // Update total price based on the number of selected seats
    function updateTotalPrice() {
        let totalPrice = selectedSeats.length * basePrice;
        // Check if any selected seats are premium and add premium price
        selectedSeats.forEach(function (seat) {
            if (isPremium(seat)) {
                totalPrice += premiumPrice;
            }
        });
        $('#ticketCount').text(selectedSeats.length);
        $('#totalPrice').text(totalPrice);
    }

    // Check if the seat is premium
    function isPremium(seat) {
        // Example premium seats logic
        return seat[0] === 'A' || seat[0] === 'E'; // Rows A and E are considered premium
    }

    // Validate form before submission
    $('#bookingForm').submit(function (event) {
        // Validate name
        const name = $('#name').val();
        if (name.length < 3 || /\d/.test(name)) {
            $('#name').addClass('is-invalid');
            alert('Name should be at least 3 characters long and should not contain digits.');
            event.preventDefault();
            return;
        }

        // Validate phone number
        const phoneNumber = $('#phone').val();
        if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            $('#phone').addClass('is-invalid');
            alert('Phone number must be 10 digits long and contain only digits.');
            event.preventDefault();
            return;
        }

        if ($('#seatSelection .selected').length === 0) {
            alert('Please select at least one seat.');
            event.preventDefault();
        } else {
            event.preventDefault();
            displayReceipt();
        }
    });

    // Remove is-invalid class on input change
    $('#name, #phone').change(function () {
        $(this).removeClass('is-invalid');
    });

    // Function to display booking receipt
    function displayReceipt() {
        const bookingId = generateBookingId();
        const movie = $('#movieSelect').val(); // Update to get selected movie
        const name = $('#name').val();
        const phone = $('#phone').val();
        const seats = selectedSeats.join(', ');
        const totalPrice = calculateTotalPrice();

        $('#bookingId').text(bookingId);
        $('#receiptMovie').text(movie);
        $('#receiptName').text(name);
        $('#receiptPhone').text(phone);
        $('#receiptSeats').text(seats);
        $('#receiptTotalPrice').text(totalPrice);

        $('#receipt').show();
    }

    // Function to generate a random booking ID
    function generateBookingId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let bookingId = '';
        for (let i = 0; i < 8; i++) {
            bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return bookingId;
    }

    // Function to calculate total price
    function calculateTotalPrice() {
        let totalPrice = selectedSeats.length * basePrice;
        selectedSeats.forEach(function (seat) {
            if (isPremium(seat)) {
                totalPrice += premiumPrice;
            }
        });
        return totalPrice;
    }

    // Update selected movie when dropdown changes
    $('#movieSelect').change(function() {
        alert('You have selected the movie: ' + $(this).val()); // Alert when a movie is selected
        $('#receiptMovie').text($(this).val()); // Update displayed movie
    });
});
