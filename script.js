/* =========================================
   SUBTRACK
   SMART SUBSCRIPTION MANAGER
========================================= */


/*
    IMPORTANT:

    Starting data is EMPTY.

    Isliye dashboard:
    Monthly = ₹0
    Active Plans = 0
    Renewal = 0
    Yearly = ₹0
*/


const STORAGE_KEY =
    "subtrackData";


/* =========================================
   LOAD DATA
========================================= */


let subscriptions =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        ) || "[]"
    );


/* =========================================
   MONEY FORMAT
========================================= */


function money(value) {

    return (
        "₹" +
        Number(value || 0)
            .toLocaleString("en-IN")
    );

}


/* =========================================
   SAVE DATA
========================================= */


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            subscriptions
        )
    );

}


/* =========================================
   SAFE HTML
========================================= */


function escapeHTML(text) {

    return String(text)
        .replace(
            /[&<>"']/g,
            function (character) {

                const map = {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"

                };

                return map[character];

            }
        );

}


/* =========================================
   DATE
========================================= */


function formatDate(value) {

    return new Date(
        value + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   DAYS UNTIL RENEWAL
========================================= */


function daysUntil(value) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const renewal =
        new Date(
            value +
            "T00:00:00"
        );


    return Math.ceil(
        (
            renewal -
            today
        ) / 86400000
    );

}


/* =========================================
   STATUS
========================================= */


function getStatus(item) {

    const days =
        daysUntil(
            item.renewal
        );


    if (days < 0) {

        return [
            "Expired",
            "expired"
        ];

    }


    if (days <= 7) {

        return [
            "Renewing Soon",
            "soon"
        ];

    }


    return [
        "Active",
        ""
    ];

}


/* =========================================
   OPEN ADD / EDIT FORM
========================================= */


function openForm(id = null) {

    const modal =
        document.getElementById(
            "formBox"
        );


    if (!modal) {
        return;
    }


    let item = null;


    if (id !== null) {

        item =
            subscriptions.find(
                function (sub) {

                    return (
                        sub.id === id
                    );

                }
            );

    }


    modal.innerHTML = `

        <div class="modal-box">

            <div class="modal-head">

                <div>

                    <h2>

                        ${item
            ? "Edit Subscription"
            : "Add Subscription"
        }

                    </h2>

                    <p>
                        Enter subscription details.
                    </p>

                </div>


                <button
                    class="close"
                    onclick="closeForm()"
                >
                    ×
                </button>

            </div>


            <input
                type="hidden"
                id="editId"
                value="${item
            ? item.id
            : ""
        }"
            >


            <label>
                Subscription Name
            </label>

            <input
                id="name"
                type="text"
                placeholder="Example: Netflix"
                value="${item
            ? escapeHTML(
                item.name
            )
            : ""
        }"
            >


            <label>
                Category
            </label>

            <select id="category">

                <option value="Entertainment"
                    ${item &&
            item.category ===
            "Entertainment"
            ? "selected"
            : ""
        }>
                    Entertainment
                </option>

                <option value="Music"
                    ${item &&
            item.category ===
            "Music"
            ? "selected"
            : ""
        }>
                    Music
                </option>

                <option value="Software"
                    ${item &&
            item.category ===
            "Software"
            ? "selected"
            : ""
        }>
                    Software
                </option>

                <option value="Cloud"
                    ${item &&
            item.category ===
            "Cloud"
            ? "selected"
            : ""
        }>
                    Cloud
                </option>

                <option value="Education"
                    ${item &&
            item.category ===
            "Education"
            ? "selected"
            : ""
        }>
                    Education
                </option>

                <option value="Other"
                    ${item &&
            item.category ===
            "Other"
            ? "selected"
            : ""
        }>
                    Other
                </option>

            </select>


            <label>
                Renewal Date
            </label>

            <input
                id="renewal"
                type="date"
                value="${item
            ? item.renewal
            : ""
        }"
            >


            <label>
                Monthly Cost (₹)
            </label>

            <input
                id="cost"
                type="number"
                min="0"
                placeholder="499"
                value="${item
            ? item.cost
            : ""
        }"
            >


            <div class="modal-actions">

                <button
                    class="cancel"
                    onclick="closeForm()"
                >
                    Cancel
                </button>


                <button
                    class="save"
                    onclick="saveSubscription()"
                >
                    Save Subscription
                </button>

            </div>

        </div>

    `;


    modal.style.display =
        "flex";

}


/* =========================================
   CLOSE FORM
========================================= */


function closeForm() {

    const modal =
        document.getElementById(
            "formBox"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =========================================
   SAVE SUBSCRIPTION
========================================= */


function saveSubscription() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const category =
        document.getElementById(
            "category"
        ).value;


    const renewal =
        document.getElementById(
            "renewal"
        ).value;


    const cost =
        Number(
            document.getElementById(
                "cost"
            ).value
        );


    const editId =
        document.getElementById(
            "editId"
        ).value;


    if (
        name === "" ||
        renewal === "" ||
        isNaN(cost) ||
        cost < 0
    ) {

        alert(
            "Please enter all details."
        );

        return;

    }


    /* EDIT */

    if (editId !== "") {

        const id =
            Number(editId);


        const index =
            subscriptions.findIndex(
                function (sub) {

                    return (
                        sub.id === id
                    );

                }
            );


        if (index !== -1) {

            subscriptions[index] = {

                id: id,

                name: name,

                category: category,

                renewal: renewal,

                cost: cost

            };

        }

    }


    /* ADD */

    else {

        subscriptions.push({

            id: Date.now(),

            name: name,

            category: category,

            renewal: renewal,

            cost: cost

        });

    }


    saveData();

    closeForm();

    renderAll();

}


/* =========================================
   DELETE
========================================= */


function deleteSubscription(id) {

    const item =
        subscriptions.find(
            function (sub) {

                return (
                    sub.id === id
                );

            }
        );


    if (!item) {
        return;
    }


    const confirmDelete =
        confirm(
            "Delete " +
            item.name +
            "?"
        );


    if (!confirmDelete) {
        return;
    }


    subscriptions =
        subscriptions.filter(
            function (sub) {

                return (
                    sub.id !== id
                );

            }
        );


    saveData();

    renderAll();

}


/* =========================================
   RENDER TABLE
========================================= */


function renderTable() {

    const list =
        document.getElementById(
            "subscriptionList"
        );


    if (!list) {
        return;
    }


    const search =
        (
            document.getElementById(
                "search"
            ).value
        )
            .toLowerCase()
            .trim();


    const filter =
        document.getElementById(
            "filter"
        ).value;


    const filtered =
        subscriptions.filter(
            function (item) {

                const searchMatch =
                    item.name
                        .toLowerCase()
                        .includes(search);


                const categoryMatch =
                    filter === "All" ||
                    item.category === filter;


                return (
                    searchMatch &&
                    categoryMatch
                );

            }
        );


    list.innerHTML = "";


    filtered.forEach(
        function (item) {

            const status =
                getStatus(item);


            list.innerHTML += `

                <tr>

                    <td>

                        <b>
                            ${escapeHTML(
                item.name
            )}
                        </b>

                    </td>


                    <td>

                        <span class="badge">

                            ${escapeHTML(
                item.category
            )}

                        </span>

                    </td>


                    <td>

                        ${formatDate(
                item.renewal
            )}

                    </td>


                    <td>

                        <b>
                            ${money(
                item.cost
            )}
                        </b>

                    </td>


                    <td>

                        <span
                            class="
                                status
                                ${status[1]}
                            "
                        >

                            ${status[0]}

                        </span>

                    </td>


                    <td>

                        <button
                            class="edit"
                            onclick="openForm(${item.id})"
                        >
                            Edit
                        </button>


                        <button
                            class="delete"
                            onclick="deleteSubscription(${item.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }
    );


    const empty =
        document.getElementById(
            "emptyState"
        );


    if (empty) {

        empty.style.display =
            filtered.length === 0
                ? "block"
                : "none";

    }


    const count =
        document.getElementById(
            "resultCount"
        );


    if (count) {

        count.textContent =
            filtered.length +
            " subscription" +
            (
                filtered.length !== 1
                    ? "s"
                    : ""
            );

    }

}


/* =========================================
   UPDATE DASHBOARD
========================================= */


function updateDashboard() {

    let monthly = 0;


    subscriptions.forEach(
        function (item) {

            monthly +=
                Number(
                    item.cost
                ) || 0;

        }
    );


    const yearly =
        monthly * 12;


    const upcoming =
        subscriptions.filter(
            function (item) {

                const days =
                    daysUntil(
                        item.renewal
                    );


                return (
                    days >= 0 &&
                    days <= 7
                );

            }
        );


    /* STATS */

    setText(
        "monthlyExpense",
        money(monthly)
    );


    setText(
        "activeCount",
        subscriptions.length
    );


    setText(
        "renewalCount",
        upcoming.length
    );


    setText(
        "yearlyExpense",
        money(yearly)
    );


    /* SUMMARY */

    setText(
        "summaryTotal",
        money(monthly)
    );


    setText(
        "summaryMonthly",
        money(monthly)
    );


    setText(
        "summaryYearly",
        money(yearly)
    );


    const average =
        subscriptions.length > 0
            ? monthly /
            subscriptions.length
            : 0;


    setText(
        "summaryAverage",
        money(
            Math.round(
                average
            )
        )
    );


    /* BUDGET */

    const budget = 5000;


    let percentage =
        (
            monthly /
            budget
        ) * 100;


    percentage =
        Math.min(
            percentage,
            100
        );


    const bar =
        document.getElementById(
            "expenseBar"
        );


    if (bar) {

        bar.style.width =
            percentage + "%";

    }


    setText(
        "budgetText",
        money(monthly) +
        " used from ₹5,000"
    );


    /* ALERT */

    updateAlert(
        upcoming
    );

}


/* =========================================
   UPCOMING ALERT
========================================= */


function updateAlert(upcoming) {

    const alertBox =
        document.getElementById(
            "alert"
        );


    if (!alertBox) {
        return;
    }


    if (
        upcoming.length === 0
    ) {

        alertBox.style.display =
            "none";

        return;

    }


    alertBox.style.display =
        "block";


    upcoming.sort(
        function (a, b) {

            return (
                daysUntil(a.renewal) -
                daysUntil(b.renewal)
            );

        }
    );


    const items =
        upcoming.map(
            function (item) {

                const days =
                    daysUntil(
                        item.renewal
                    );


                let timing;


                if (days === 0) {

                    timing =
                        "Renews today";

                }

                else if (
                    days === 1
                ) {

                    timing =
                        "Renews tomorrow";

                }

                else {

                    timing =
                        "In " +
                        days +
                        " days";

                }


                return `

                    <div class="alert-item">

                        <b>
                            ${escapeHTML(
                    item.name
                )}
                        </b>

                        ·

                        ${timing}

                        ·

                        ${money(
                    item.cost
                )}

                    </div>

                `;

            }
        )
            .join("");


    alertBox.innerHTML = `

        <strong>
            ⚠ Upcoming Renewals
        </strong>

        <div class="alert-items">

            ${items}

        </div>

    `;

}


/* =========================================
   SET TEXT
========================================= */


function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================
   RENDER ALL
========================================= */


function renderAll() {

    renderTable();

    updateDashboard();

}


/* =========================================
   TODAY DATE
========================================= */


function showToday() {

    const today =
        document.getElementById(
            "today"
        );


    if (!today) {
        return;
    }


    today.textContent =
        new Date()
            .toLocaleDateString(
                "en-IN",
                {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

}


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */


document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "formBox"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeForm();

        }

    }
);


/* =========================================
   START APP
========================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        showToday();

        renderAll();

    }
);