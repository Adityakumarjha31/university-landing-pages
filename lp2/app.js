// CONFIG
const PIPEDREAM_ENDPOINT = "https://eo50hmfjp7e1bre.m.pipedream.net";
const API_BASE = "http://localhost:4000"; // local API

document.addEventListener('DOMContentLoaded', () => {
  const feesBtn = document.getElementById('feesBtn');
  const feeModal = document.getElementById('feeModal');
  const closeModal = document.getElementById('closeModal');
  const feesContent = document.getElementById('feesContent');
  const coursesList = document.getElementById('coursesList');
  const leadForm = document.getElementById('leadForm');
  const formMsg = document.getElementById('formMsg');
  const downloadBrochure = document.getElementById('downloadBrochure');
  const applyNow = document.getElementById('applyNow');

  // Static data for course list (fallback)
  const university = {
    id: "kirantech",
    name: "Kiran Institute of Technology",
    courses: [
      { code: "btech-me", name: "B.Tech (ME)", feeRange: "₹2.0 - 3.5 LPA" },
      { code: "mtech-rob", name: "M.Tech (Robotics)", feeRange: "₹1.5 - 2.8 LPA" },
      { code: "bba", name: "BBA", feeRange: "₹0.9 - 1.6 LPA" }
    ]
  };

  // populate static course list on the page
  university.courses.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.name} — Fee: ${c.feeRange}`;
    coursesList.appendChild(li);
  });

  // DYNAMIC FEES MODAL (from API)
  feesBtn.addEventListener('click', async () => {
    feeModal.setAttribute('aria-hidden', 'false');
    feesContent.textContent = "Loading...";
    try {
      const res = await fetch(`${API_BASE}/api/universities/${university.id}`);
      if (!res.ok) throw new Error("API failed");
      const u = await res.json();

      const html = u.courses.map(c => {
        const min = c.fees?.min ?? null;
        const max = c.fees?.max ?? null;
        let feeText = c.feeRange || "N/A";

        if (min !== null && max !== null) {
          const minTxt = `₹${(min/100000).toFixed(1)} L`;
          const maxTxt = `₹${(max/100000).toFixed(1)} L`;
          feeText = `${minTxt} - ${maxTxt}`;
        }

        return `<div><strong>${c.name}</strong><div>${feeText}</div></div>`;
      }).join("<hr/>");

      feesContent.innerHTML = html;
    } catch (err) {
      console.error(err);
      feesContent.textContent = "Failed to load fees from API.";
    }
  });

  // close modal
  closeModal.addEventListener('click', () => feeModal.setAttribute('aria-hidden', 'true'));
  feeModal.addEventListener('click', (e) => { if (e.target === feeModal) feeModal.setAttribute('aria-hidden','true'); });

  // brochure button
  downloadBrochure.addEventListener('click', (e) => {
    e.preventDefault();
    window.open("https://example.com/brochure-kiran.pdf", "_blank");
  });

  // scroll to form
  applyNow.addEventListener('click', () => {
    document.getElementById("name").scrollIntoView({ behavior: "smooth" });
  });

  // HANDLE LEAD FORM SUBMIT
  leadForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    formMsg.textContent = "";

    const data = {
      name: leadForm.name.value.trim(),
      email: leadForm.email.value.trim(),
      phone: leadForm.phone.value.trim(),
      state: leadForm.state.value.trim(),
      course: leadForm.course.value,
      intake: leadForm.intake.value,
      consent: leadForm.consent.checked,
      university: university.id,
      submittedAt: new Date().toISOString()
    };

    if (!/^[0-9]{10}$/.test(data.phone)) {
      formMsg.style.color = "red";
      formMsg.textContent = "Enter a valid 10-digit phone number.";
      return;
    }

    // POST to Pipedream
    try {
      const resp = await fetch(PIPEDREAM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (resp.ok) {
        formMsg.style.color = "green";
        formMsg.textContent = "Thanks! Your request has been submitted.";
        leadForm.reset();
      } else {
        formMsg.style.color = "red";
        formMsg.textContent = "Submission failed. Try again later.";
      }
    } catch (err) {
      console.error(err);
      formMsg.style.color = "red";
      formMsg.textContent = "Network error. Could not submit.";
    }
  });
});
