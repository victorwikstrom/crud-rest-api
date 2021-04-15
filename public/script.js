const outputWrapper = document.createElement("div");

let newGolferValues = {
  firstName: "",
  lastName: "",
  age: "",
  mainSponsor: "",
};

window.addEventListener("load", () => {
  initApp();
});

const initApp = () => {
  addEventListeners();
  fetchAll();
};

const addEventListeners = () => {
  // FIND ALL
  fetchAllBtn = document.getElementById("fetchAll");
  fetchAllBtn.addEventListener("click", () => {
    fetchAll();
  });

  // OPEN FIND SPECIFIC
  const fetchSpecificBtn = document.getElementById("fetchSpecific");
  fetchSpecificBtn.addEventListener("click", () => {
    const findForm = document.getElementById("find-form");
    findForm.classList.toggle("hidden");
  });

  // FIND SPECIFIC
  const findInput = document.getElementById("find-id");
  let idToFind = 0;
  findInput.addEventListener("change", (e) => {
    idToFind = e.target.value;
  });
  const findGolferButton = document.getElementById("findGolfer");
  findGolferButton.addEventListener("click", () => {
    fetchSpecificGolfer(idToFind);
    const findForm = document.getElementById("find-form");
    findForm.classList.toggle("hidden");
  });

  // OPEN CREATE GOLFER
  const createBtn = document.getElementById("create");
  createBtn.addEventListener("click", () => {
    const form = document.getElementById("create-form");
    form.classList.toggle("hidden");

    let inputElems = document.getElementsByClassName("create-input");
    inputElems = Array.from(inputElems);

    inputElems.map((input) => {
      input.addEventListener("change", (e) => {
        handleInputFieldChange(e);
      });
    });
  });

  // POST GOLFER TO SERVER
  const createNewGolferBtn = document.getElementById("postGolfer");
  createNewGolferBtn.addEventListener("click", () => {
    createNewGolfer(newGolferValues);
    const form = document.getElementById("create-form");
    form.classList.toggle("hidden");
  });

  // DELETE ALL BUTTON
  const deleteAllBtn = document.getElementById("deleteAll");
  deleteAllBtn.addEventListener("click", () => {
    deleteAll();
  });

  const rightWrapper = document.getElementById("right-wrapper");
  rightWrapper.appendChild(outputWrapper);
};

//  FETCH FUNCTIONS ****************

const fetchAll = async () => {
  clearOutput();
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

const createNewGolfer = async (newGolfer) => {
  const response = await makeRequest("/api/", "POST", newGolfer);
  createResponse(response);
};

const updateGolfer = async (id) => {
  const response = await makeRequest(`/api/${id}`, "PUT", newGolferValues);
  createResponse(response);
};

const deleteGolfer = async (id) => {
  const response = await makeRequest(`/api/${id}`, "DELETE");
  createResponse(response);
};

const deleteAll = async () => {
  const response = await makeRequest(`/api/`, "DELETE");
  createResponse(response);
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

  return response.json();
};

// HELPER FUNCTIONS ****************

const createGolferElements = (golfer) => {
  const golferWrapper = document.createElement("div");
  golferWrapper.style.marginBottom = "1rem";

  for (const [key, value] of Object.entries(golfer)) {
    const rowElem = document.createElement("div");
    const keyElem = document.createElement("h5");
    const valueElem = document.createElement("h5");
    rowElem.style.marginBottom = "5px";
    keyElem.style.fontWeight = "bold";
    keyElem.style.marginRight = "5px";
    rowElem.style.display = "flex";
    keyElem.innerText = key + ":";
    valueElem.innerText = value;
    rowElem.appendChild(keyElem);
    rowElem.appendChild(valueElem);
    golferWrapper.appendChild(rowElem);
  }

  const buttonsWrapper = document.createElement("div");

  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  editButton.classList.add("smallButton");
  deleteButton.classList.add("smallButton", "delete");

  editButton.innerText = "EDIT";
  deleteButton.innerText = "DELETE";

  deleteButton.addEventListener("click", () => {
    deleteGolfer(golfer.id);
  });

  editButton.addEventListener("click", () => {
    createUpdateGolfer(golfer, golferWrapper);
  });

  buttonsWrapper.appendChild(editButton);
  buttonsWrapper.appendChild(deleteButton);
  golferWrapper.appendChild(buttonsWrapper);
  outputWrapper.appendChild(golferWrapper);
};

const createUpdateGolfer = (golfer, wrapper) => {
  while (wrapper.lastChild) {
    wrapper.removeChild(wrapper.lastChild);
  }

  for (const [key, value] of Object.entries(golfer)) {
    if (key === "id") continue;

    const rowElem = document.createElement("div");
    rowElem.style.marginBottom = "5px";
    const keyElem = document.createElement("h5");
    const inputElem = document.createElement("input");
    inputElem.value = value;
    inputElem.name = key;
    keyElem.style.fontWeight = "bold";
    keyElem.style.marginRight = "5px";
    rowElem.style.display = "flex";
    keyElem.innerText = key + ":";

    inputElem.addEventListener("change", (e) => {
      handleInputFieldChange(e);
    });

    rowElem.appendChild(keyElem);
    rowElem.appendChild(inputElem);
    wrapper.appendChild(rowElem);
  }

  const buttonsWrapper = document.createElement("div");

  const updateButton = document.createElement("button");
  const cancelButton = document.createElement("button");

  updateButton.classList.add("smallButton");
  cancelButton.classList.add("smallButton");

  updateButton.innerText = "SAVE CHANGES";
  cancelButton.innerText = "CANCEL";

  cancelButton.addEventListener("click", () => {
    fetchAll();
  });

  updateButton.addEventListener("click", () => {
    updateGolfer(golfer.id);
  });

  buttonsWrapper.appendChild(updateButton);
  buttonsWrapper.appendChild(cancelButton);
  wrapper.appendChild(buttonsWrapper);
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
    createGotItBtn();
  } else {
    createStatusElement(response, "black");
    createGotItBtn();
  }
};

const clearOutput = () => {
  while (outputWrapper.lastChild) {
    outputWrapper.removeChild(outputWrapper.lastChild);
  }
};

const createGotItBtn = () => {
  const btn = document.createElement("button");
  btn.classList.add("largeButton");
  btn.innerText = "Got it!";
  btn.addEventListener("click", () => {
    fetchAll();
  });
  outputWrapper.appendChild(btn);
};

function handleInputFieldChange(e) {
  const value = e.target.value;
  newGolferValues = {
    ...newGolferValues,
    [e.target.name]: value,
  };
}
