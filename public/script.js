window.addEventListener("load", () => {
  initApp();
});

const initApp = () => {
  populateUI();
};

const container = document.createElement("div");

const populateUI = () => {
  // GET ALL
  const getAllButton = document.createElement("button");
  getAllButton.innerText = "Get all golfers";
  getAllButton.addEventListener("click", () => {
    getAll();
  });
  document.body.appendChild(getAllButton);

  // GET SPECIFIC
  const getSpecificButton = document.createElement("button");
  getSpecificButton.innerText = "Get specific golfer";
  getSpecificButton.addEventListener("click", () => {
    getSpecific(2);
  });
  document.body.appendChild(getSpecificButton);
  document.body.appendChild(container);
};

const getAll = async () => {
  const golfers = await makeRequest("/api", "GET");
  golfers.map((golfer) => {
    createGolferElements(golfer);
  });
};
const getSpecific = async (id) => {
  const golfer = await makeRequest(`/api/${id}`, "GET");
  createGolferElements(golfer);
};

const makeRequest = async (url, method, body) => {
  clearContainer();

  const response = await fetch(url, {
    method: method,
    body: body,
    header: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

const createGolferElements = (golfer) => {
  const { firstName, lastName, age, mainSponsor } = golfer;
  const nameElem = document.createElement("h3");
  const ageElem = document.createElement("h3");
  const sponsorElem = document.createElement("h3");
  nameElem.innerText = "Name: " + firstName + " " + lastName;
  ageElem.innerText = "Age: " + age;
  sponsorElem.innerText = "Main sponsor: " + mainSponsor;
  container.appendChild(nameElem);
  container.appendChild(ageElem);
  container.appendChild(sponsorElem);
};

const clearContainer = () => {
  while (container.lastChild) {
    container.removeChild(container.firstChild);
  }
};
