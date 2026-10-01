// ==================================
// EABD ADMIN DASHBOARD JAVASCRIPT
// ==================================

// ================================
// ADMIN AUTHENTICATION CHECK
// ================================

async function checkAdminAuth() {
    const { data: { user } } = await eabdSupabase.auth.getUser();

    if (!user) {
        window.location.href = "admin-login.html";
        return;
    }

    const { data, error } = await eabdSupabase.rpc("is_admin");

    if (error || !data) {
        await eabdSupabase.auth.signOut();
        window.location.href = "admin-login.html";
        return;
    }
}

checkAdminAuth();

const navLinks = document.querySelectorAll(".admin-nav a");
const applicationsTableBody = document.getElementById("applicationsTableBody");
const applicationSearch = document.getElementById("applicationSearch");
const statusFilter = document.getElementById("statusFilter");

// Navigation
navLinks.forEach((link) => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        navLinks.forEach((item) => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        const section = this.dataset.section;

            if (section === "applications") {
                document.getElementById("applicationsSection").scrollIntoView({
                    behavior: "smooth"
                });
            }

            if (section === "dashboard") {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            if (section === "support") {
            document.getElementById("supportSection").scrollIntoView({
                behavior: "smooth"
            });
        }

            if (section === "settings") {
            document.getElementById("settingsSection").scrollIntoView({
                behavior: "smooth"
            });
        }

            console.log("Admin section selected:", section);
    });

});

// Load applications
async function loadApplications() {

    const { data, error } = await eabdSupabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading applications:", error);
        alert("Admin Error: " + error.message);
        return;
    }

    if (!data || data.length === 0) {
        applicationsTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-message">
                    No applications yet.
                </td>
            </tr>
        `;
        return;
    }

    // Get current search and status filter values
    const searchValue = applicationSearch.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    // Filter applications
    const filteredApplications = data.filter((application) => {

        const matchesSearch =
            application.full_name.toLowerCase().includes(searchValue) ||
            application.email.toLowerCase().includes(searchValue) ||
            application.phone.toLowerCase().includes(searchValue);


        const matchesStatus =
            selectedStatus === "all" ||
            application.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // No matching applications
    if (filteredApplications.length === 0) {

        applicationsTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-message">
                    No matching applications found.
                </td>
            </tr>
        `;

        return;
    }

    applicationsTableBody.innerHTML = "";

    filteredApplications.forEach((application) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${application.full_name}</td>
            <td>${application.email}</td>
            <td>${application.phone}</td>
            <td>${application.age}</td>
            <td>${application.disability}</td>
            <td>${application.support_needed}</td>
            <td>${application.message}</td>
            <td>${application.status}</td>
            <td>${new Date(application.created_at).toLocaleDateString()}</td>

            <td>

                <button class="view-btn" onclick="viewApplication(${application.id})">
                    View Details
                </button>

                ${
                    application.status === "pending"
                    ? `
                        <button class="approve-btn" onclick="updateApplicationStatus(${application.id}, 'approved')">
                            Approve
                        </button>

                        <button class="reject-btn" onclick="updateApplicationStatus(${application.id}, 'rejected')">
                            Reject
                        </button>
                    `
                    : application.status === "approved"
                    ? `<span class="status-approved">Approved</span>`
                    : `<span class="status-rejected">Rejected</span>`
                }

            </td>
        `;

        applicationsTableBody.appendChild(row);
    });
}

        // Load dashboard statistics
        async function loadStatistics() {

            const { data, error } = await eabdSupabase
                .from("applications")
                .select("status");

            if (error) {
                console.error("Error loading statistics:", error);
                return;
            }

            const total = data.length;

            const pending = data.filter(
                (application) => application.status === "pending"
            ).length;

            const approved = data.filter(
                (application) => application.status === "approved"
            ).length;

            const rejected = data.filter(
                (application) => application.status === "rejected"
            ).length;

            const { count: supportRequests, error: supportError } = await eabdSupabase
                .from("support_requests")
                .select("*", { count: "exact", head: true });

            if (supportError) {
                console.error("Error loading support request statistics:", supportError);
                return;
            }

            document.getElementById("totalApplications").textContent = total;
            document.getElementById("pendingApplications").textContent = pending;
            document.getElementById("approvedApplications").textContent = approved;
            document.getElementById("rejectedApplications").textContent = rejected;
            document.getElementById("supportRequests").textContent = supportRequests;
        }

        // View application details
        async function viewApplication(applicationId) {

            const { data: application, error } = await eabdSupabase
                .from("applications")
                .select("*")
                .eq("id", applicationId)
                .single();

            if (error) {
                console.error("Error loading application details:", error);
                alert("Error: " + error.message);
                return;
            }

            const detailsCard = document.getElementById("applicationDetailsCard");

            detailsCard.innerHTML = `
                <div class="detail-item">
                    <strong>Full Name</strong>
                    <span>${application.full_name}</span>
                </div>

                <div class="detail-item">
                    <strong>Email</strong>
                    <span>${application.email}</span>
                </div>

                <div class="detail-item">
                    <strong>Phone</strong>
                    <span>${application.phone}</span>
                </div>

                <div class="detail-item">
                    <strong>Age</strong>
                    <span>${application.age}</span>
                </div>

                <div class="detail-item">
                    <strong>Disability</strong>
                    <span>${application.disability}</span>
                </div>

                <div class="detail-item">
                    <strong>Support Needed</strong>
                    <span>${application.support_needed}</span>
                </div>

                <div class="detail-item">
                    <strong>Message</strong>
                    <span>${application.message}</span>
                </div>

                <div class="detail-item">
                    <strong>Status</strong>
                    <span>${application.status}</span>
                </div>

                <div class="detail-item">
                    <strong>Date Submitted</strong>
                    <span>${new Date(application.created_at).toLocaleString()}</span>
                </div>

                <div class="detail-actions">

                    ${
                        application.status === "pending"
                        ? `
                            <button class="approve-btn" onclick="updateApplicationStatus(${application.id}, 'approved')">
                                Approve
                            </button>

                            <button class="reject-btn" onclick="updateApplicationStatus(${application.id}, 'rejected')">
                                Reject
                            </button>
                        `
                        : application.status === "approved"
                        ? `<span class="status-approved">Approved</span>`
                        : `<span class="status-rejected">Rejected</span>`
                    }

                </div>
            `;

            document.getElementById("applicationDetailsSection").scrollIntoView({
                behavior: "smooth"
            });
        }

        // Update application status
        async function updateApplicationStatus(applicationId, newStatus) {

            const { error } = await eabdSupabase
                .from("applications")
                .update({ status: newStatus })
                .eq("id", applicationId);

            if (error) {
                console.error("Error updating application:", error);
                alert("Error: " + error.message);
                return;
            }

            alert("Application status updated successfully.");

            // Reload applications and statistics
            loadApplications();
            loadStatistics();
            loadRecentApplications();
            loadRecentSupportRequests();
            viewApplication(applicationId);
        }

        

loadApplications();
loadStatistics();

// Load recent applications for dashboard
async function loadRecentApplications() {

    const recentApplications =
        document.getElementById("recentApplications");

    const { data, error } = await eabdSupabase
        .from("applications")
        .select("id, full_name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {

        console.error("Error loading recent applications:", error);

        recentApplications.innerHTML = `
            <p class="activity-empty">
                Error loading recent applications.
            </p>
        `;

        return;
    }

    if (!data || data.length === 0) {

        recentApplications.innerHTML = `
            <p class="activity-empty">
                No recent applications.
            </p>
        `;

        return;
    }

    recentApplications.innerHTML = "";

    data.forEach((application) => {

        const item = document.createElement("div");

        item.className = "activity-item";

        item.innerHTML = `
            <strong>${application.full_name}</strong>

            <span>
                ${application.status} ·
                ${new Date(application.created_at).toLocaleDateString()}
            </span>
        `;

        item.style.cursor = "pointer";

        item.addEventListener("click", () => {

            viewApplication(application.id);

        });

        recentApplications.appendChild(item);

    });
}

loadRecentApplications();

// Load recent support requests for dashboard
async function loadRecentSupportRequests() {

    const recentSupportRequests =
        document.getElementById("recentSupportRequests");

    const { data, error } = await eabdSupabase
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {

        console.error("Error loading recent support requests:", error);

        recentSupportRequests.innerHTML = `
            <p class="activity-empty">
                Error loading recent support requests.
            </p>
        `;

        return;
    }

    if (!data || data.length === 0) {

        recentSupportRequests.innerHTML = `
            <p class="activity-empty">
                No recent support requests.
            </p>
        `;

        return;
    }

    recentSupportRequests.innerHTML = "";

    data.forEach((request) => {

        const item = document.createElement("div");

        item.className = "activity-item";

        item.innerHTML = `
            <strong>${request.full_name}</strong>

            <span>
                ${request.subject || "No subject"} ·
                ${request.status} ·
                ${new Date(request.created_at).toLocaleDateString()}
            </span>
        `;

        item.style.cursor = "pointer";

        item.addEventListener("click", () => {

            viewSupportRequest(request.id);

        });

        recentSupportRequests.appendChild(item);

    });
}

loadRecentSupportRequests();


// Admin logout
const logoutBtns = document.querySelectorAll(".logout-btn");

logoutBtns.forEach((button) => {

    button.addEventListener("click", async () => {

        const { error } = await eabdSupabase.auth.signOut();

        if (error) {
            alert("Logout error: " + error.message);
            return;
        }

        window.location.href = "admin-login.html";
    });

});

// ================================
// APPLICATION SEARCH
// ================================

applicationSearch.addEventListener("input", function () {

    const searchTerm = this.value.toLowerCase().trim();

    const rows = applicationsTableBody.querySelectorAll("tr:not(#noSearchResults)");

    let matchFound = false;

    rows.forEach((row) => {

        const rowText = row.textContent.toLowerCase();

        if (rowText.includes(searchTerm)) {
            row.style.display = "";
            matchFound = true;
        } else {
            row.style.display = "none";
        }

    });

    // Show message when no application matches
    let noResultsRow = document.getElementById("noSearchResults");

    if (!matchFound && searchTerm !== "") {

        if (!noResultsRow) {

            noResultsRow = document.createElement("tr");

            noResultsRow.id = "noSearchResults";

            noResultsRow.innerHTML = `
                <td colspan="10" class="empty-message">
                    No matching applications found.
                </td>
            `;

            applicationsTableBody.appendChild(noResultsRow);
        }

    } else if (noResultsRow) {

        noResultsRow.remove();

    }

});

// ================================
// STATUS FILTER
// ================================

statusFilter.addEventListener("change", function () {

    loadApplications();

});

// ================================
// SUPPORT REQUESTS
// ================================

async function loadSupportRequests() {

    const supportRequestsTableBody =
        document.getElementById("supportRequestsTableBody");

    const { data, error } = await eabdSupabase
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error("Error loading support requests:", error);

        supportRequestsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    Error loading support requests.
                </td>
            </tr>
        `;

        return;
    }

    if (!data || data.length === 0) {

        supportRequestsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    No support requests yet.
                </td>
            </tr>
        `;

        return;
    }

    supportRequestsTableBody.innerHTML = "";

    data.forEach((request) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${request.full_name}</td>
            <td>${request.email}</td>
            <td>${request.phone || ""}</td>
            <td>${request.subject || ""}</td>
            <td>${request.message || ""}</td>
            <td>${request.status}</td>
            <td>${new Date(request.created_at).toLocaleDateString()}</td>

            <td>
                <button class="view-btn" onclick="viewSupportRequest('${request.id}')">
                    View
                </button>

                ${
                    request.status === "pending"
                    ? `
                        <button class="approve-btn" onclick="updateSupportRequestStatus('${request.id}', 'resolved')">
                            Resolve
                        </button>
                    `
                    : `
                        <span class="status-approved">Resolved</span>
                    `
                }
            </td>
        `;

        supportRequestsTableBody.appendChild(row);
    });
}

loadSupportRequests();

// View support request details
async function viewSupportRequest(requestId) {

    const { data: request, error } = await eabdSupabase
        .from("support_requests")
        .select("*")
        .eq("id", requestId)
        .single();

    if (error) {
        console.error("Error loading support request:", error);
        alert("Error: " + error.message);
        return;
    }

    const detailsCard =
        document.getElementById("supportRequestDetailsCard");

    detailsCard.innerHTML = `
        <div class="detail-item">
            <strong>Full Name</strong>
            <span>${request.full_name}</span>
        </div>

        <div class="detail-item">
            <strong>Email</strong>
            <span>${request.email}</span>
        </div>

        <div class="detail-item">
            <strong>Phone</strong>
            <span>${request.phone || "N/A"}</span>
        </div>

        <div class="detail-item">
            <strong>Subject</strong>
            <span>${request.subject || "N/A"}</span>
        </div>

        <div class="detail-item">
            <strong>Message</strong>
            <span>${request.message || "N/A"}</span>
        </div>

        <div class="detail-item">
            <strong>Status</strong>
            <span>${request.status}</span>
        </div>

        <div class="detail-item">
            <strong>Date Submitted</strong>
            <span>${new Date(request.created_at).toLocaleString()}</span>
        </div>
    `;

    document
        .getElementById("supportRequestDetailsSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}

// Update support request status
async function updateSupportRequestStatus(requestId, newStatus) {
    const { error } = await eabdSupabase
        .from("support_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

    if (error) {
        console.error("Error updating support request:", error);
        alert("Error: " + error.message);
        return;
    }

    // Reload support requests and dashboard data
    await loadSupportRequests();
    await loadStatistics();
    await loadRecentSupportRequests();

    // Refresh the details if this request is currently being viewed
    const detailsCard =
        document.getElementById("supportRequestDetailsCard");

    if (detailsCard && detailsCard.innerHTML.trim() !== "") {
        viewSupportRequest(requestId);
    }

    alert("Support request marked as resolved.");
}
// ================================
// REFRESH DASHBOARD
// ================================

const refreshDashboardBtn =
    document.getElementById("refreshDashboardBtn");

refreshDashboardBtn.addEventListener("click", async function () {

    refreshDashboardBtn.textContent = "⟳ Refreshing...";
    refreshDashboardBtn.disabled = true;

    await loadApplications();
    await loadStatistics();
    await loadRecentApplications();
    await loadRecentSupportRequests();
    await loadSupportRequests();

    refreshDashboardBtn.textContent = "Refresh Dashboard";
    refreshDashboardBtn.disabled = false;

});