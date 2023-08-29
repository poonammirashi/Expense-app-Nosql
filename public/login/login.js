async function login(e) {
            try {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const loginUser = await axios.post("http://localhost:4000/user/login", { email, password })
                    window.alert("login successfull");
                    localStorage.setItem('token', loginUser.data.token);
                    window.location.href = ("http://localhost:4000/expenses/user-expense.html")
            }
            catch (err) {
                console.log(err)
                window.alert(err);
            }
        }