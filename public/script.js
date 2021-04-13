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

  // CREATE GOLFER BUTTON
  const createGolferButton = document.createElement("button");
  createGolferButton.innerText = "Create new golfer";
  createGolferButton.addEventListener("click", () => {
    createNewGolfer();
  });
  document.body.appendChild(createGolferButton);

  // UPDATE GOLFER BUTTON
  const updateGolferButton = document.createElement("button");
  updateGolferButton.innerText = "Update golfer";
  updateGolferButton.addEventListener("click", () => {
    updateGolfer(3);
  });
  document.body.appendChild(updateGolferButton);

  // DELETE GOLFER BUTTON
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete golfer";
  deleteButton.addEventListener("click", () => {
    deleteGolfer(2);
  });
  document.body.appendChild(deleteButton);

  document.body.appendChild(container);
};

const fetchAllGolfers = async () => {
  const response = await makeRequest("/api", "GET");
  if (response == []) {
    createStatusElement("No golfers are defined on the server");
  } else {
    response.map((golfer) => {
      createGolferElements(golfer);
    });
  }
};
const fetchSpecificGolfer = async (id) => {
  const golfer = await makeRequest(`/api/${id}`, "GET");
  if (golfer.id) {
    createGolferElements(golfer);
  } else {
    createStatusElement(`No golfer was found on id: ${id}.`);
  }
};

const createNewGolfer = async () => {
  const newGolfer = {
    firstName: "Victor",
    lastName: "Wikström",
    age: "28",
    mainSponsor: "Mum and Dad",
  };

  const response = await makeRequest("/api/", "POST", newGolfer);
  createResponse(response);
};

const updateGolfer = async (id) => {
  const newSponsor = { mainSponsor: "Cobra" };
  const response = await makeRequest(
    `http://localhost:5000/api/${id}`,
    "PUT",
    newSponsor
  );
  createResponse(response);
};

const deleteGolfer = async (id) => {
  const response = await makeRequest(`/api/${id}`, "DELETE");
  createResponse(response);
};

const makeRequest = async (url, method, reqBody) => {
  clearContainer();

  const response = await fetch(url, {
    method: method,
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  const result = await response.json();
  return result;
};

const createGolferElements = (golfer) => {
  const { id, firstName, lastName, age, mainSponsor } = golfer;

  const idElem = document.createElement("h4");
  const nameElem = document.createElement("h4");
  const ageElem = document.createElement("h4");
  const sponsorElem = document.createElement("h4");
  idElem.innerText = "ID: " + id;
  nameElem.innerText = "Name: " + firstName + " " + lastName;
  ageElem.innerText = "Age: " + age;
  sponsorElem.innerText = "Main sponsor: " + mainSponsor;
  container.appendChild(idElem);
  container.appendChild(nameElem);
  container.appendChild(ageElem);
  container.appendChild(sponsorElem);
};

const createStatusElement = (errorMsg, color) => {
  const errorElem = document.createElement("h4");
  errorElem.style.color = color;
  errorElem.innerText = errorMsg;
  container.appendChild(errorElem);
};

const createResponse = (response) => {
  if (response instanceof Object) {
    createStatusElement(
      response.errorCode + " error. " + response.message,
      "red"
    );
  } else {
    createStatusElement(response, "black");
  }
};

const clearContainer = () => {
  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }
};
