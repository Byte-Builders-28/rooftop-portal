document.addEventListener("DOMContentLoaded", () => {
	const spinner = document.getElementById("spinnerOverlay");
	const stateSelect = document.getElementById("state");
	const citySelect = document.getElementById("city");

	const states = [
		"Andhra Pradesh",
		"Arunachal Pradesh",
		"Assam",
		"Bihar",
		"Chhattisgarh",
		"Goa",
		"Gujarat",
		"Haryana",
		"Himachal Pradesh",
		"Jharkhand",
		"Karnataka",
		"Kerala",
		"Madhya Pradesh",
		"Maharashtra",
		"Manipur",
		"Meghalaya",
		"Mizoram",
		"Nagaland",
		"Odisha",
		"Punjab",
		"Rajasthan",
		"Sikkim",
		"Tamil Nadu",
		"Telangana",
		"Tripura",
		"Uttar Pradesh",
		"Uttarakhand",
		"West Bengal",
		"Delhi",
		"Jammu and Kashmir",
		"Ladakh",
	];

	states.forEach((state) => {
		const option = document.createElement("option");
		option.value = state;
		option.textContent = state;
		stateSelect.appendChild(option);
	});

	async function fetchCities(state) {
		try {
			spinner.style.display = "flex";
			const cached = localStorage.getItem(`cities_${state}`);
			if (cached) {
				console.log(`Loading cities for ${state} from cache`);
				spinner.style.display = "none";
				return JSON.parse(cached);
			}
			console.log(`Fetching cities for ${state}...`);
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 30000); // 10 sec timeout
			const res = await fetch(
				"https://countriesnow.space/api/v0.1/countries/state/cities",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ country: "India", state }),
					signal: controller.signal,
				}
			);
			clearTimeout(timeout);
			const data = await res.json();
			if (!data.data) throw new Error("Invalid cities data");
			localStorage.setItem(`cities_${state}`, JSON.stringify(data.data));
			spinner.style.display = "none";
			console.log(`Fetched ${data.data.length} cities for ${state}`);
			return data.data;
		} catch (err) {
			console.error(`Failed to fetch cities for ${state}:`, err);
			spinner.style.display = "none";
			alert(`Failed to load cities for ${state}`);
			return [];
		}
	}

	stateSelect.addEventListener("change", async function () {
		const state = this.value;
		citySelect.innerHTML = '<option value="">Select City</option>';
		if (!state) return;
		const cities = await fetchCities(state);
		cities.forEach((city) => {
			const option = document.createElement("option");
			option.value = city;
			option.textContent = city;
			citySelect.appendChild(option);
		});
	});

	const form = document.getElementById("feasibilityForm");
	form.addEventListener("submit", function (e) {
		e.preventDefault();
		const formData = new FormData(this);
		const state = formData.get("state");
		const city = formData.get("city");
		const roof = formData.get("roof");
		const roofArea = formData.get("roofArea");
		const openSpace = formData.get("openSpace");
		const dwellers = formData.get("dwellers");
		const budget = formData.get("budget");

		document.getElementById("result").innerHTML = `
      <div class="alert alert-success">
        Submitted! <br>
        <strong>State:</strong> ${state} <br>
        <strong>City:</strong> ${city} <br>
        <strong>Roof:</strong> ${roof} <br>
        <strong>Roof Area:</strong> ${roofArea} m² <br>
        <strong>Open Space:</strong> ${openSpace} m² <br>
        <strong>Dwellers:</strong> ${dwellers} <br>
        <strong>Budget:</strong> ${budget ? "₹" + budget : "N/A"}
      </div>
    `;
	});
});
