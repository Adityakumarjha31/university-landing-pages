
const PIPEDREAM_ENDPOINT = "https://eoob92tdcfokgpj.m.pipedream.net";
const courses = [
  { name: "B.Tech (CSE)", fee: "₹2.2 - 3.5 L" },
  { name: "MBA", fee: "₹1.8 - 2.8 L" },
  { name: " B.Com", fee: "₹1.0 - 2.0 L" }
];
document.addEventListener("DOMContentLoaded", function() {
  const feesBtn = document.getElementById("feesBtn");
  const feeModal = document.getElementById("feeModal");
  const closeModal = document.getElementById("closeModal");
  const feesContent = document.getElementById("feesContent");
  const coursesList = document.getElementById("coursesList");
  const leadForm = document.getElementById("leadForm");
  const formMsg = document.getElementById("formMsg");
  const brochure = document.getElementById("downloadBrochure");
  const applyNow = document.getElementById("applyNow");

  if (coursesList) {
    let courseHTML = "";
    for (let i = 0; i < courses.length; i++) {
      courseHTML += `<li>${courses[i].name} — ${courses[i].fee}</li>`;
    }
    coursesList.innerHTML = courseHTML;
  }
  if (feesBtn && feeModal && feesContent) {
    
    feesBtn.addEventListener("click", () => {
      feesContent.innerHTML = courses.map(c => 
        `<p><strong>${c.name}</strong><br>${c.fee}</p>`
      ).join("");
      feeModal.style.display = "block";
    });if (closeModal) {
      closeModal.addEventListener("click", () => {
        feeModal.style.display = "none";
      });
    }
    feeModal.addEventListener("click", e => { 
      if (e.target === feeModal) {
        feeModal.style.display = "none";
      }
    });
  }
if (applyNow) {
    applyNow.addEventListener("click", () => {
      document.getElementById("name")?.scrollIntoView({ behavior: "smooth" });
    });
  }
  if (leadForm) {
    leadForm.addEventListener("submit", handleFormSubmit);
  }

}); 
async function handleFormSubmit(e) {
  e.preventDefault(); 
  const form = e.target;
  const formMsg = document.getElementById("formMsg");
  formMsg.textContent = ""; 
  const phoneVal = form.phone.value.trim();
  if (phoneVal.length !== 10) {
    formMsg.style.color = "red"; 
    formMsg.textContent = "Enter a valid 10-digit phone.";
    return;
  }
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: phoneVal,
    course: form.course.value,
    intake: form.intake.value,
    consent: form.consent.checked, 
    university: "PARUL", 
    time: new Date().toISOString()
  };

  try {
    const res = await fetch(PIPEDREAM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      formMsg.style.color = "green"; 
      formMsg.textContent = "Thanks — submitted!";
      form.reset();
    } else {
      
      formMsg.textContent = "Submission failed. Please try again.";
      console.log("Submission error", res);
    }
  } catch (err) {
    formMsg.style.color = "red"; 
    formMsg.textContent = "Network error. Check connection.";
    console.error("Fetch error:", err); 
  }
}