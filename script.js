function togglePass(inputId, openEyeId, closeEyeId) {
    const passField = document.getElementById(inputId);
    const openEye = document.getElementById(openEyeId);
    const closeEye = document.getElementById(closeEyeId);

    if (passField.type === "password") {
        passField.type = "text";
        openEye.classList.add('hidden');
        closeEye.classList.remove('hidden');
    } else {
        passField.type = "password";
        openEye.classList.remove('hidden');
        closeEye.classList.add('hidden');
    }
}

function login(role) {
    if (role === 'customer') {
        const passwordInput = document.getElementById('customerPass').value;
        if (passwordInput === "customer") {
            window.location.href = "customer_dashboard.html";
        } else {
            alert("Password Customer Salah!");
        }
    } 
    else if (role === 'kasir') {
        const passwordInput = document.getElementById('kasirPass').value;
        if (passwordInput === "salim321") {
            window.location.href = "kasir_dashboard.html";
        } else {
            alert("Password Kasir Salah!");
        }
    }
}