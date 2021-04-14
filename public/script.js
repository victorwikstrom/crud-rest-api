window.addEventListener("load", () => {
  initApp();
});

const initApp = () => {
  addEventListeners();
};

const outputWrapper = document.createElement("div");

let newGolfer = {
  firstName: "",
  lastName: "",
  age: "",
  mainSponsor: "",
};

let updatedGolfer = {
  firstName: "",
  lastName: "",
  age: "",
  mainSponsor: "",
};

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
    showForm(true, "create-form");

    const firstName = document.getElementById("fname");
    const lastName = document.getElementById("lname");
    const age = document.getElementById("age");
    const sponsor = document.getElementById("sponsor");

    firstName.addEventListener("change", (e) => {
      handleNewGolferInput(e);
    });
    lastName.addEventListener("change", (e) => {
      handleNewGolferInput(e);
    });
    age.addEventListener("change", (e) => {
      handleNewGolferInput(e);
    });
    sponsor.addEventListener("change", (e) => {
      handleNewGolferInput(e);
    });
  });

  function handleNewGolferInput(e) {
    const value = e.target.value;
    newGolfer = {
      ...newGolfer,
      [e.target.name]: value,
    };
  }

  // POST GOLFER TO SERVER BUTTON
  createNewGolferBtn = document.getElementById("postGolfer");
  createNewGolferBtn.addEventListener("click", () => {
    createNewGolfer(newGolfer);
    showForm(false, "create-form");
    newGolfer = {
      firstName: "",
      lastName: "",
      age: "",
      mainSponsor: "",
    };
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

  // DELETE ALL BUTTON
  deleteAllBtn = document.getElementById("deleteAll");
  deleteAllBtn.addEventListener("click", () => {
    deleteAll();
  });

  const rightWrapper = document.getElementById("right-wrapper");
  rightWrapper.appendChild(outputWrapper);
};

//  BUTTON FUNCTIONS ****************

const fetchAllGolfers = async () => {
  const response = await makeRequest("/api", "GET");
  if (!response.length) {
    createResponse(response);
  } else {
    response.map((golfer) => {
      createGolferElements(golfer);
    });
  }
};
const fetchSpecificGolfer = async (id) => {
  const response = await makeRequest(`/api/${id}`, "GET");
  if (response.id) {
    createGolferElements(response);
  } else {
    createResponse(response);
  }
};

const showForm = (show, formToChange) => {
  const form = document.getElementById(formToChange);
  if (show) {
    form.classList.remove("hidden");
    return;
  }
  form.classList.add("hidden");
};

const createNewGolfer = async (newGolfer) => {
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

const deleteAll = async () => {
  await makeRequest(`/api/`, "DELETE");
  createStatusElement(`All golfers has been deleted from server.`);
};

//  REQUEST FUNCTION ****************
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

// HELPER FUNCTIONS ****************

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
