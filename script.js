document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. HIGHLIGHT ACTIVE NAVIGATION LINK
  // ==========================================
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".top-nav .nav-btn").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // ==========================================
  // 2. FILTER & LIVE SEARCH FOR CARDS
  // ==========================================
  const filterPills = document.querySelectorAll(".filter-pill");
  const infoCards = document.querySelectorAll(".info-card");
  const searchInput = document.getElementById("card-search");
  const emptyMessage = document.getElementById("empty-message");

  let activeCategory = "all";
  let searchQuery = "";

  function updateVisibleCards() {
    let visibleCount = 0;

    infoCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = activeCategory === "all" || cardCategory === activeCategory;
      const matchesSearch = searchQuery === "" || cardText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (emptyMessage) {
      emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      activeCategory = pill.getAttribute("data-filter");
      filterPills.forEach((btn) => btn.classList.remove("active-filter"));
      pill.classList.add("active-filter");
      updateVisibleCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      updateVisibleCards();
    });
  }

  // ==========================================
  // 3. INTERACTIVE POP-UP MODAL FOR CARDS
  // ==========================================
  const detailContent = {
    "Tenderfoot Trail (Eagle Park)": {
      subtitle: "Rexburg, ID • 0.5 Miles • Beginner Green",
      body: "Trailhead starts right near Eagle Park by the Teton River. Expect smooth dirt, zero steep drops, and tight forest turns. Ideal for practicing braking before turns and keeping your eyes looking ahead through corners."
    },
    "Hidden Vista Loop": {
      subtitle: "Rexburg Area • 1.1 Miles • Beginner Green",
      body: "A wide, forgiving loop with gentle elevation changes (+85 ft). Great early-season ride to dial in tire pressure and shifting cadence before heading up into Kelly Canyon."
    },
    "Hawley Gulch Loop": {
      subtitle: "Kelly Canyon Network • 4.7 Miles • Intermediate Blue",
      body: "Climb the ridge road to access shaded aspen singletrack. Watch for loose summer dust on switchbacks and keep your weight centered over small root step-ups in the drainage."
    },
    "Nemo & Hillbender Loop": {
      subtitle: "Caribou-Targhee National Forest • 7.9 Miles • Intermediate Blue",
      body: "Located near Mike Harris Campground. Features fast, flowing singletrack with optional root pops. Ride counter-clockwise for the best descent flow."
    },
    "Grove Creek & Drake Creek": {
      subtitle: "Big Hole Mountains • 7.6 Miles • Advanced Black",
      body: "Long, sustained climb up Grove Creek followed by technical rock gardens and steep switchbacks down Drake Creek. Run slightly lower tire pressure (22–24 PSI) for extra grip on embedded limestone."
    },
    "Moody Swamp to Red Butte": {
      subtitle: "Rexburg Backcountry • 7.4 Miles • Advanced Black",
      body: "Loose shale climbs and exposed ridge sections. Carry extra water, a tubeless plug kit, and offline Trailforks maps since cell signal drops near the summit."
    },
    "Loose Shale & Cornering": {
      subtitle: "Riding Skills Guide • Cornering Control",
      body: "1. Brake in a straight line BEFORE entering the turn.\n2. Drop your outside heel and weight the outside pedal.\n3. Lean the bike underneath you while keeping your torso upright and eyes locked on the exit."
    },
    "Pacing Steep Forest Climbs": {
      subtitle: "Riding Skills Guide • Climbing Efficiency",
      body: "Shift into an easy spinning gear before the pitch steepens, slide forward onto the nose of your saddle, and keep your elbows bent to stop the front wheel from wandering."
    },
    "Backcountry Ride Pack": {
      subtitle: "Essential Gear Checklist • Eastern Idaho",
      body: "• 2L Hydration bladder + electrolytes\n• Tubeless bacon-strip plug kit & CO2 inflator\n• Compact bike multi-tool with chain breaker\n• Bear spray in an accessible hip/frame holster\n• Offline maps downloaded before leaving town"
    },
    "Eastern Idaho Tire & PSI Guide": {
      subtitle: "Gear Review • Tire Pressure Setup",
      body: "• Smooth Dirt (Eagle Park): 25–28 PSI\n• Dusty Singletrack (Kelly Canyon): 23–26 PSI\n• Sharp Rocks (Big Holes / Teton Valley): 22–24 PSI with reinforced EXO/Trail casings"
    },
    "Chest Mount Angle & FOV": {
      subtitle: "TrailCam Setup • POV Framing",
      body: "Mount your camera upside-down on a chest harness tilted upward about 15–20 degrees. When you stand in the attack position on steep descents, the lens levels out and captures both your handlebars and the trail ahead."
    },
    "Eliminating Wind & Chain Slap": {
      subtitle: "TrailCam Setup • Audio & Video Settings",
      body: "• Resolution: 4K at 60fps (16:9 or 8:7)\n• Stabilization: HyperSmooth / RockSteady On (not Boost)\n• Audio: Use a foam windslayer sleeve and turn Wind Noise Reduction to Auto."
    }
  };

  if (infoCards.length > 0) {
    const modal = document.createElement("div");
    modal.id = "info-modal";
    modal.className = "modal-backdrop";
    modal.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" class="modal-close" aria-label="Close popup">&times;</button>
        <h3 id="modal-title"></h3>
        <p id="modal-subtitle" class="meta-row"></p>
        <p id="modal-body" class="modal-text"></p>
      </div>
    `;
    document.body.appendChild(modal);

    const modalTitle = document.getElementById("modal-title");
    const modalSubtitle = document.getElementById("modal-subtitle");
    const modalBody = document.getElementById("modal-body");
    const closeBtn = modal.querySelector(".modal-close");

    document.querySelectorAll(".info-card .btn-link").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".info-card");
        const title = card.querySelector("h3").textContent.trim();
        const fallbackMeta = card.querySelector(".meta-row")?.textContent || "TrailCam Diaries Resource";
        const fallbackDesc = card.querySelector("p:last-of-type")?.textContent || "";

        const info = detailContent[title] || {
          subtitle: fallbackMeta,
          body: fallbackDesc
        };

        modalTitle.textContent = title;
        modalSubtitle.textContent = info.subtitle;
        modalBody.textContent = info.body;
        modal.classList.add("open");
      });
    });

    const closeModal = () => modal.classList.remove("open");

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }
});
