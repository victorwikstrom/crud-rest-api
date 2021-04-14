window.addEventListener("load", () => {
  initApp();
});

const initApp = () => {
  console.log("init");
  addEventListeners();
  fetchAll();
};

const outputWrapper = document.createElement("div");

let newGolferValues = {
  firstName: "",
  lastName: "",
  age: "",
  mainSponsor: "",
};

const addEventListeners = () => {
  // GET SPECIFIC BUTTON
  fetchSpecificBtn = document.getElementById("fetchSpecific");
  fetchSpecificBtn.addEventListener("click", () => {
    const findForm = document.getElementById("find-form");
    findForm.classList.toggle("hidden");
  });

  // FIND GOLFER
  const findInput = document.getElementById("find-id");
  let idToFind = 0;
  findInput.addEventListener("change", (e) => {
    idToFind = e.target.value;
  });
  const findGolferButton = document.getElementById("findGolfer");
  findGolferButton.addEventListener("click", () => {
    fetchSpecificGolfer(idToFind);
  });

  // CREATE GOLFER BUTTON
  createBtn = document.getElementById("create");
  createBtn.addEventListener("click", () => {
    const form = document.getElementById("create-form");
    form.classList.toggle("hidden");

    let inputElems = document.getElementsByClassName("create-input");
    inputElems = Array.from(inputElems);

    inputElems.map((input) => {
      input.addEventListener("change", (e) => {
        handleInputFieldChange(e);
        console.log(newGolferValues);
      });
    });
  });

  // POST GOLFER TO SERVER BUTTON
  createNewGolferBtn = document.getElementById("postGolfer");
  createNewGolferBtn.addEventListener("click", () => {
    createNewGolfer(newGolferValues);
    const form = document.getElementById("create-form");
    form.classList.toggle("hidden");
  });

  // UPDATE GOLFER BUTTON SHOW FORM
  updateBtn = document.getElementById("update");
  updateBtn.addEventListener("click", () => {
    fetchAll();
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

const fetchAll = async () => {
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
    console.log(response);
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
  deleteButton.classList.add("smallButton");

  editButton.innerText = "EDIT";
  deleteButton.innerText = "DELETE";

  deleteButton.addEventListener("click", () => {
    deleteGolfer(golfer.id);
  });

  editButton.addEventListener("click", () => {
    makeGolferUpdateable(golfer, golferWrapper);
  });

  buttonsWrapper.appendChild(editButton);
  buttonsWrapper.appendChild(deleteButton);
  golferWrapper.appendChild(buttonsWrapper);
  outputWrapper.appendChild(golferWrapper);
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
  const wrapper = document.getElementById("right-wrapper");
  btn.addEventListener("click", () => {
    fetchAll();
    wrapper.removeChild(btn);
  });
  wrapper.appendChild(btn);
};

function handleInputFieldChange(e) {
  const value = e.target.value;
  newGolferValues = {
    ...newGolferValues,
    [e.target.name]: value,
  };
}

const makeGolferUpdateable = (golfer, wrapper) => {
  console.log(golfer);
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
      console.log(newGolferValues);
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
