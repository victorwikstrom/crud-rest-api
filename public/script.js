window.addEventListener("load", () => {
  initApp();
});

const initApp = () => {
  populateUI();
};

const container = document.createElement("div");

const populateUI = () => {
  // GET ALL BUTTON
  const getAllButton = document.createElement("button");
  getAllButton.innerText = "Get all golfers";
  getAllButton.addEventListener("click", () => {
    fetchAllGolfers();
  });
  document.body.appendChild(getAllButton);

  // GET SPECIFIC BUTTON
  const getSpecificButton = document.createElement("button");
  getSpecificButton.innerText = "Get specific golfer";
  getSpecificButton.addEventListener("click", () => {
    fetchSpecificGolfer(3);
  });
  document.body.appendChild(getSpecificButton);
  document.body.appendChild(container);
};

const fetchAllGolfers = async () => {
  const golfers = await makeRequest("/api", "GET");
  if (golfers == []) {
    createErrorElement("No golfers are defined on the server");
  } else {
    golfers.map((golfer) => {
      createGolferElements(golfer);
    });
  }
};
const fetchSpecificGolfer = async (id) => {
  const golfer = await makeRequest(`/api/${id}`, "GET");
  if (golfer) {
    createGolferElements(golfer);
  } else {
    createErrorElement("Could not fetch golfer from server on requested ID");
  }
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

const createErrorElement = (errorMsg) => {
  const errorElem = document.createElement("h3");
  errorElem.innerText = errorMsg;
  container.appendChild(errorElem);
};

const clearContainer = () => {
  while (container.lastChild) {
    container.removeChild(container.firstChild);
  }
};
