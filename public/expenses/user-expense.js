let page = 1;
        document.addEventListener("DOMContentLoaded", async () => {
            try {
                const limit = localStorage.getItem("rowsperpage");
                const token = localStorage.getItem('token');
                const decodeToken = parseJwt(token);
                console.log(decodeToken,limit);
                if (decodeToken.isPremier === true) {
                    showPremier();
                    const fileUrl = await axios.get("http://localhost:4000/user/expense/download/getfiles", { headers: { "Authorization": token } })
                    console.log(fileUrl);
                    fileUrl.data.files.forEach((data) => {
                        showdownloadedFiles(data);
                    })
                }
                
                const pageData = await axios.get(`http://localhost:4000/user/expense/get-expenses?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
                console.log(pageData)
                localStorage.setItem("rowsperpage", pageData.data.limit);
                document.getElementById("rows").value = pageData.data.limit ;
                getExpenses(page);
            }
            catch (err) {
                console.log(err);
            }
        })

        document.getElementById("rzp-btn1").onclick = async function goRazorPay(e) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:4000/user/purchase/premium-membership", { headers: { "Authorization": token } });
                console.log(response);
                var options = {
                    "key": response.data.key_id,
                    "order_id": response.data.order.id,
                    "handler": async function (response) {
                        const res = await axios.post("http://localhost:4000/user/purchase/premium-membership", {
                            order_id: options.order_id,
                            payment_id: response.razorpay_payment_id
                        },
                            { headers: { "Authorization": token } })
                        console.log(res)
                        alert("you got premium membership");
                        showPremier();
                        localStorage.setItem('token', res.data.token);
                    },
                };
                const rzp1 = new Razorpay(options);
                rzp1.open();
                e.preventDefault();

                rzp1.on("payment.failed", async function (response) {
                    console.log(response, "err");
                    await axios.post("http://localhost:4000/user/purchase/premium-membership-fail", {
                        order_id: response.error.metadata.order_id,
                        payment_id: response.error.metadata.payment_id
                    },
                        { headers: { "Authorization": token } });


                    alert("something went wrong");
                })
            }
            catch (err) {
                console.log(err);
            }

        }

        async function addExpense(e) {
            try {
                e.preventDefault();
                const token = localStorage.getItem('token');
                const amount = document.getElementById("amount").value;
                const description = document.getElementById("description").value;
                const category = document.getElementById("category").value;
                const newexpense = await axios.post("http://localhost:4000/user/expense/add-expense", {
                    amount,
                    description,
                    category,

                }, { headers: { "Authorization": token } })
                console.log(newexpense.data);
                showExpenseOnScreen(newexpense.data.newExpense);
            }
            catch (err) {
                console.log(err);
            }
        }

        function changeRows() {
            const rowsPerPage = document.getElementById("rows").value;
            localStorage.setItem("rowsperpage", rowsPerPage);

            getExpenses(page);
        }

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }

        function showPremier() {
            const pbtn = document.getElementById("rzp-btn1");
            pbtn.style.visibility = "hidden";
            document.getElementById("message").innerHTML = `you are a premium member <button onclick="showLeaderboard()">
                Show Leaderboard
                </button>
            <button onclick="download()" id="downloadExpense">Download File</button>
            `
        }

        async function download() {
            try {
                const token = localStorage.getItem('token');
                const download = await axios.get("http://localhost:4000/user/expense/download", { headers: { "Authorization": token } });
                showdownloadedFiles(download.data.userUrl);
            } catch (err) {
                console.log(err);
            }
        }
        var i = 1;
        function showdownloadedFiles(data) {
            const ul = document.getElementById("datafile");
            // ul.innerHTML = "<h3>Downloaded Files</h3>"
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = data.url;
            a.style.color = "purple";
            a.textContent = `${i++} File Link- ${data.date}`;
            a.download = "Expense.csv";
            li.appendChild(a);
            ul.appendChild(li);
        }


        async function showLeaderboard() {
            try {
                const token = localStorage.getItem("token");
                const LeaderboardUsers = await axios.get("http://localhost:4000/user/expense/leaderboard", { headers: { "Authorization": token } });
                console.log(LeaderboardUsers);
                const ul = document.getElementById("lb");
                ul.innerHTML = `<h3>Leader Baord</h3>`;
                LeaderboardUsers.data.forEach(ele => {
                    showLeaderboardUsers(ele)
                })
            } catch (err) {
                console.log(err);
            }
        }

        function showLeaderboardUsers(user) {
            const ul = document.getElementById("lb");
            if (user.total_cost === null) user.total_expense = 0;
            ul.innerHTML += `<li>Name-${user.name},Total Expense-${user.total_expense}</li>`
        }

        function showExpensepage(data) {
            const page = document.getElementById("page-button");
            page.innerHTML = "";
            if (data.hasprevpage) {
                // create button and textcontent = data.prevpage
                const prevbutton = document.createElement("button");
                prevbutton.textContent = data.prevpage;
                prevbutton.addEventListener("click", () => getExpenses(data.prevpage))
                page.appendChild(prevbutton);
            }
            if (data.currpage) {
                // create button and text content = dta.currentpage
                const currbutton = document.createElement("button");
                currbutton.innerHTML = `<h3>${data.currpage}</h3>`;
                currbutton.addEventListener("click", () => getExpenses(data.currpage));
                page.appendChild(currbutton);

            }
            if (data.hasnextpage) {
                // create button and textcontent = data.nextpage;
                const nextbutton = document.createElement("button");
                nextbutton.textContent = data.nextpage;
                nextbutton.addEventListener("click", () => getExpenses(data.nextpage));
                page.appendChild(nextbutton);
            }
        }

        async function getExpenses(page) {
            try {
                const limit = localStorage.getItem("rowsperpage");
                const ul = document.getElementById("items");
                ul.innerHTML = ""
                const token = localStorage.getItem("token");
                const pageData = await axios.get(`http://localhost:4000/user/expense/get-expenses?page=${page}&limit=${limit}`, { headers: { "Authorization": token} });
                pageData.data.expenses.forEach(data => {
                    showExpenseOnScreen(data);
                })
                console.log()
                showExpensepage(pageData.data);
            } catch (err) {
                console.log(err);
            }
        }
        function showExpenseOnScreen(data) {
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            document.getElementById('category').value = '';
            const ul = document.getElementById('items');
            ul.innerHTML += `<li id="${data.id}"> ${data.amount}-${data.description}-${data.category}
                <button onclick="deleteExpense(${data.id})">Delete</button>
                </li>`;
        }

        async function deleteExpense(id) {
            try {
                const token = localStorage.getItem('token');
                const expense = await axios.delete(`http://localhost:4000/user/expense/delete-expense/${id}`, { headers: { "Authorization": token } });
                console.log(expense);
                const ul = document.getElementById('items');
                const li = document.getElementById(`${id}`);
                ul.removeChild(li);
            }
            catch (err) {
                console.log(err);
            }
        }