// ==================================
// EABD SUPPORT REQUEST
// ==================================

const supportRequestForm = document.getElementById("supportRequestForm");

if (supportRequestForm) {

    supportRequestForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const formData = new FormData(supportRequestForm);

        const supportRequest = {

            full_name: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            status: "pending"

        };


        const { error } = await eabdSupabase
            .from("support_requests")
            .insert([supportRequest]);


        if (error) {

            console.error("Support request error:", error);

            alert("Error: " + error.message);

            return;
        }


        alert("Your support request has been submitted successfully.");

        supportRequestForm.reset();

    });

}