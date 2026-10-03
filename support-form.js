// ==================================
// EABD SUPPORT FORM
// ==================================

const supportForm = document.getElementById("supportForm");

if (supportForm) {
    supportForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const formData = new FormData(supportForm);

        const application = {
            full_name: formData.get("fullName"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            age: Number(formData.get("age")),
            disability: formData.get("disability"),
            support_needed: formData.get("supportNeeded"),
            message: formData.get("message"),
            status: "pending"
        };

        const { error } = await eabdSupabase
            .from("applications")
            .insert([application]);

        if (error) {
            console.error("Submission error:", error);
             alert("Error: " + error.message);
            return;
            }

        alert("Your support request has been submitted successfully.");

        supportForm.reset();
    });
}