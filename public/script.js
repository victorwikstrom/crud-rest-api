window.addEventListener("load", () => {
  initApp();
});

const initApp = () => {
  addEventListeners();
};

const outputWrapper = document.createElement("div");

const addEventListeners = () => {
  // GET ALL BUTTON
  const fetchAllBtn = document.getElementById("fetchAll");
  fetchAllBtn.addEventListener("click", () => {
    fetchAllGolfers();
  });

  // GET SPECIFIC BUTTON
  fetchSpecificBtn = document.getElementById("fetchSpecific");
  fetchSpecificBtn.addEventListener("click", () => {
    fetchSpecificGolfer(3);
  });

  // CREATE GOLFER BUTTON
  createBtn = document.getElementById("create");
  createBtn.addEventListener("click", () => {
    createNewGolfer();
  });

  // UPDATE GOLFER BUTTON
  updateBtn = document.getElementById("update");
  updateBtn.addEventListener("click", () => {
    updateGolfer(2);
  });

  // DELETE GOLFER BUTTON
  deleteBtn = document.getElementById("deleteSpecific");
  deleteBtn.addEventListener("click", () => {
    deleteGolfer(2);
  });

  const rightWrapper = document.getElementById("right-wrapper");
  rightWrapper.appendChild(outputWrapper);
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
  clearOutput();

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  const result = await response.json();
  return result;
};

const createGolferElements = (golfer) => {
  const { id, firstName, lastName, age, mainSponsor } = golfer;
  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "1rem";

  const idElem = document.createElement("h5");
  const nameElem = document.createElement("h5");
  const ageElem = document.createElement("h5");
  const sponsorElem = document.createElement("h5");
  idElem.innerText = "ID: " + id;
  nameElem.innerText = "Name: " + firstName + " " + lastName;
  ageElem.innerText = "Age: " + age;
  sponsorElem.innerText = "Main sponsor: " + mainSponsor;
  wrapper.appendChild(idElem);
  wrapper.appendChild(nameElem);
  wrapper.appendChild(ageElem);
  wrapper.appendChild(sponsorElem);
  outputWrapper.appendChild(wrapper);
};

const createStatusElement = (errorMsg, color) => {
  const errorElem = document.createElement("h4");
  errorElem.style.color = color;
  errorElem.innerText = errorMsg;
  outputWrapper.appendChild(errorElem);
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

const clearOutput = () => {
  while (outputWrapper.lastChild) {
    outputWrapper.removeChild(outputWrapper.lastChild);
  }
};
