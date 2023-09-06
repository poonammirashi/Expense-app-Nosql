async function recovery(e) {
    try {
        e.preventDefault();
    const email = document.getElementById("email").value;
    console.log(email);
    const user = await axios.post("https://expense-tracker-app-o6bo.onrender.com/password/forgot-password", {email});
    console.log(user);
    }
    catch(err) {
        console.log(err);
    }
}