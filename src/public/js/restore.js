const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const formObject = Object.fromEntries(formData.entries())
	const obj = JSON.stringify(formObject)

	try {
		await fetch("/api/sessions/restore", {
			method: "PUT",
			body: JSON.stringify(obj),
			header: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
			if (res.status === 200) {
				window.location.href = "/";
			} else {
				const error = new Error(res.error);
				throw error;
			}
		});
	} catch (error) {
		console.error(error);
		showAlert("Unable to restore password", "error");
	}
});