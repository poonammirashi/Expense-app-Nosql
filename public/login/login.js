async function login(e) {
            try {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const loginUser = await axios.post("https://expense-tracker-app-o6bo.onrender.com//user/login", { email, password })
                    window.alert("login successfull");
                    localStorage.setItem('token', loginUser.data.token);
                    window.location.href = ("https://expense-tracker-app-o6bo.onrender.com//expenses/user-expense.html")
            }
            catch (err) {
                console.log(err)
                window.alert(err);
            }
        }