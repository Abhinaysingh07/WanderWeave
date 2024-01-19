import { servicesDetails, packagesData, additionalPackagesData } from "../scripts/data.js"

// Generating ServiceBoxes Dynamically
const serviceBoxesContainer = document.querySelector('.service-Boxes')
let serviceBoxesHtml = "";
servicesDetails.forEach((service) => {
  serviceBoxesHtml += `
           <div class="box service-box">
              <i class="fas fa-times service-box-close"></i>
              <img src="${service.img}" loading="lazy">
              <div class="description">
                <h3>${service.descriptionTitle}</h3>
                <p class="p1">${service.shortDescription}</p>
                <p class="p2">${service.fullDescription}</p>
                <a class="btn service-box-btn">Read More</a>
              </div>
           </div>`;
});
serviceBoxesContainer.innerHTML = serviceBoxesHtml;

// Generating PackageBoxes Dynamically
const packagesSection = document.getElementById('packages');
const popularPackageBoxes = packagesSection.querySelector('.popular-package-boxes');

let packagesHtml = '';
packagesData.forEach((packagee) => {
  packagesHtml += `
    <div class="box package-box">
      <img src="${packagee.image}" loading="lazy">
      <div class="description">
        <h3>${packagee.title}</h3>
        <p>${packagee.description}</p>
        <button class="btn package-box-btn" data-code = "${packagee.code}"
        >Explore now</button>
      </div>
    </div>`;
});
popularPackageBoxes.innerHTML = packagesHtml;

// Generating Additional Packages section Dynamically
const additionalBoxContainer = document.querySelector('.additional-package-boxes');

let additionalPackagesHtml = '';
additionalPackagesData.forEach((packagee) => {
  additionalPackagesHtml += `
    <div class="box package-box">
      <img src="${packagee.image}" loading="lazy">
      <div class="description">
        <h3>${packagee.title}</h3>
        <p>${packagee.description}</p>
        <button class="btn package-box-btn" data-code = "${packagee.code}"
        >Explore now</button>
      </div>
    </div>`;
});
additionalBoxContainer.innerHTML = additionalPackagesHtml + '<a class="btn" id="gohome2" href="#">Back to homepage</a>'




