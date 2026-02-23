
function getCars() {
    return JSON.parse(localStorage.getItem("cars")) || [];
}

function saveCars(cars) {
    localStorage.setItem("cars", JSON.stringify(cars));
}

if (document.getElementById("carForm")) {

    const form = document.getElementById("carForm");
    const params = new URLSearchParams(window.location.search);
    const editIndex = params.get("edit");

    let cars = getCars();

    if (editIndex !== null) {
        const car = cars[editIndex];
        document.getElementById("name").value = car.name;
        document.getElementById("model").value = car.model;
        document.getElementById("color").value = car.color;
        document.getElementById("image").value = car.image;
        document.getElementById("rating").value = car.rating;
        document.getElementById("price").value = car.price;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const carData = {
            name: document.getElementById("name").value,
            model: document.getElementById("model").value,
            color: document.getElementById("color").value,
            image: document.getElementById("image").value,
            rating: document.getElementById("rating").value,
            price: document.getElementById("price").value
        };

        if (editIndex !== null) {
            cars[editIndex] = carData;
        } else {
            cars.push(carData);
        }

        saveCars(cars);
        window.location.href = "index.html";
    });
}


if (document.getElementById("carContainer")) {

    const container = document.getElementById("carContainer");
    const searchInput = document.getElementById("search");

    function displayCars(filter = "") {
        const cars = getCars();
        container.innerHTML = "";

        cars.forEach((car, index) => {

            if (car.name.toLowerCase().includes(filter.toLowerCase())) {

                container.innerHTML += `
                    <div class="card">
                        <img src="${car.image}" />
                        <h3>${car.name}</h3>
                        <p>Model: ${car.model}</p>
                        <p>Color: ${car.color}</p>
                        <p>Rating: ⭐ ${car.rating}</p>
                        <p>Price: ₹ ${car.price}</p>
                        <button onclick="editCar(${index})">Edit</button>
                        <button onclick="deleteCar(${index})">Delete</button>
                    </div>
                `;
            }
        });
    }

    window.editCar = function(index) {
        window.location.href = `add.html?edit=${index}`;
    }

    window.deleteCar = function(index) {
        let cars = getCars();
        cars.splice(index, 1);
        saveCars(cars);
        displayCars(searchInput.value);
    }

    searchInput.addEventListener("input", function () {
        displayCars(this.value);
    });

    displayCars();
}