// Import necessary data
import { servicesDetails, packagesData, additionalPackagesData } from "../scripts/data.js";

// ALl code related to search Section
const srch = document.getElementById("srch");
const search_form = document.getElementById("search-form");
const close = document.getElementById("close");
const searchBtn = document.getElementById("search-btn");
const searchResult = document.getElementsByClassName("search-result")[0];

srch.addEventListener("click", () => {
  search_form.classList.toggle("search_toggle");
  document.documentElement.style.overflow = "hidden"; // Disable scrolling on html element
});
close.addEventListener("click", () => {
  searchBox.value = "";
  searchResult.innerHTML = "";
  document.documentElement.style.overflow = "auto"; // Disable scrolling on html element
  search_form.classList.toggle("search_toggle");
});

//searching an item 
const searchBox = document.getElementById("search-box");
searchBox.addEventListener("input", () => {
  const searchBoxValue = searchBox.value.toLowerCase();
  let html = '';

  additionalPackagesData.forEach((packagee) => {
    let packageName = packagee.title.toLowerCase();

    if (packageName.includes(searchBoxValue)) {
      html +=
        `<div class="box package-box">
        <img src="${packagee.image}" loading="lazy">
        <div class="description">
            <h3>${packagee.title}</h3>
            <button class="btn package-box-btn" data-code="${packagee.code}">Explore now</button>
        </div>
    </div>`;
    }
  });
  searchResult.innerHTML = html;

  switchToPackageDetails();
  const packageBoxes = document.querySelectorAll('.package-box');
  packageBoxes.forEach((btn) => {
    btn.addEventListener('click', () => {
      searchBox.value = "";
      searchResult.innerHTML = "";
      document.documentElement.style.overflow = "auto"; // Disable scrolling on html element
      search_form.classList.toggle("search_toggle");
    })
  })
});

// creating service pop-up box
const serviceBoxes = document.querySelectorAll('.service-box');
const serviceBoxBtns = document.querySelectorAll('.service-box-btn');
const serviceCloseBtns = document.querySelectorAll('.service-box-close');
let index;
serviceBoxBtns.forEach((button, i) => {
  button.addEventListener('click', () => {
    document.documentElement.style.overflow = "hidden";
    serviceBoxes[i].classList.add('overlap');
    serviceBoxes[i].classList.remove('box');
    serviceBoxes[i].querySelector(".description .p1").style = "display : none";
    serviceBoxes[i].querySelector(".description .p2").style = "display : block";
    index = i;
  });
});
serviceCloseBtns.forEach((closeButton) => {// logic for closing the service box here
  closeButton.addEventListener('click', () => {
    document.documentElement.style.overflow = "auto";
    serviceBoxes[index].classList.add('box');
    serviceBoxes[index].classList.remove('overlap');
    serviceBoxes[index].querySelector(".description .p1").style = "display : block";
    serviceBoxes[index].querySelector(".description .p2").style = "display : none";
  });
});

//Containers Exchanging
const packageDetailsContainer = document.querySelector(".packageDetailsContainer");
const allPackagesContainer = document.querySelector(".allPackagesContainer");
const homeContainer = document.querySelector(".homeContainer");

function switchContainers(valueA, valueB, valueC, style = "../style/index.css") {
  document.querySelector("#stylesheet").href = `${style}`;
  homeContainer.style = `display: ${valueA}`;
  allPackagesContainer.style = `display: ${valueB}`;
  packageDetailsContainer.style = `display: ${valueC}`;
}
function switchToPackageDetails() {
  let packageBoxBtns = document.querySelectorAll('.package-box-btn');
  packageBoxBtns.forEach((button) => {// switch to packageDetailsContainer
    button.addEventListener('click', () => {
      switchContainers("none", "none", "block", "../style/try.css");
      setTimeout(() => {
        document.querySelector('.package-details-header').scrollIntoView({ behavior: 'smooth' });
      }, 2)
      let imageSrc = button.parentNode.parentNode.querySelector('img').src;
      let title = button.parentNode.querySelector('h3');
      let packageCode = button.dataset.code;
      document.getElementById('packageDetailImage').src = imageSrc;
      packageDetailsContainer.querySelector('h1').innerText = title.innerText;

      const packageBookBtn = document.querySelector('#packageBookBtn');
      packageBookBtn.addEventListener('click', () => {
        switchContainers("block", "none", "none");
        setTimeout(() => {
          const book = document.querySelector('.book');
          book.scrollIntoView();
          document.getElementById('whereTo').value = packageCode;
          document.getElementById('guests').focus();
        }, 2);
      });

      const gohome = document.querySelector('#gohome');
      gohome.addEventListener('click', () => {
        switchContainers("block", "none", "none");
      });

      const explore = document.querySelector('#explore');
      explore.addEventListener('click', () => {
        switchContainers("none", "block", "none");
      });
    })
  })
}
switchToPackageDetails();
const exploreAll = document.getElementById('exploreAll');
exploreAll.addEventListener('click', () => {// switch to allpackagesContainer
  switchContainers("none", "block", "none");
});
const gohomeFromExplore = document.getElementById('gohome2');
gohomeFromExplore.addEventListener('click', () => {// switch to homeContainer
  switchContainers("block", "none", "none");
});

// form submit
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', function () {
  // Get form data
  const location = document.getElementById('whereTo').value;
  const guests = document.getElementById('guests').value;
  const arrivals = document.getElementById('arrivals').value;
  const leaving = document.getElementById('leaving').value;

  // Prepare data object
  const formData = {
    location,
    guests,
    arrivals,
    leaving,
  };

  // Send data to the server
  fetch('http://localhost:5500/submitPackage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

