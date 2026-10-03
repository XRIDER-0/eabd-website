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

    initializeDashboard();
}

checkAdminAuth();


// ================================
// ELEMENTS
// ================================

const navLinks = document.querySelectorAll(".admin-nav a");

const supportDiscoveryTableBody =
    document.getElementById("supportRequestsTableBody");

const applicationSearch =
    document.getElementById("applicationSearch");

const statusFilter =
    document.getElementById("statusFilter");


// ================================
// NAVIGATION
// ================================

navLinks.forEach((link) => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        navLinks.forEach((item) => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        const section = this.dataset.section;

        if (section === "dashboard") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        if (section === "applications") {
            const sectionElement =
                document.getElementById("applicationsSection");

            if (sectionElement) {
                sectionElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }

        if (section === "support") {
            const sectionElement =
                document.getElementById("supportSection");

            if (sectionElement) {
                sectionElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }

        if (section === "settings") {
            const sectionElement =
                document.getElementById("settingsSection");

            if (sectionElement) {
                sectionElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});


// ================================
// INITIALIZE DASHBOARD
// ================================

async function initializeDashboard() {

    await loadSupportDiscovery();
    await loadStatistics();
    await loadRecentSupportRequests();

    setupSearch();
    setupStatusFilter();
}


// ================================
// LOAD SUPPORT & DISCOVERY
// ================================

async function loadSupportDiscovery() {

    const tableBody =
        document.getElementById("applicationsTableBody") ||
        document.getElementById("supportRequestsTableBody");

    if (!tableBody) {
        return;
    }

    const { data, error } = await eabdSupabase
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(
            "Error loading Support & Discovery submissions:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-message">
                    Error loading submissions.
                </td>
            </tr>
        `;

        return;
    }

    if (!data || data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-message">
                    No Support & Discovery submissions yet.
                </td>
            </tr>
        `;

        return;
    }

    const searchValue =
        applicationSearch?.value.toLowerCase().trim() || "";

    const selectedStatus =
        statusFilter?.value || "all";

    const filteredData = data.filter((request) => {

        const searchableText = [
            request.full_name,
            request.email,
            request.phone,
            request.location,
            request.preferred_pathway,
            request.opportunity,
            request.interests,
            request.goals
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            searchableText.includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            request.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredData.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-message">
                    No matching submissions found.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = "";

    filteredData.forEach((request) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(request.full_name)}</td>

            <td>${request.age || "N/A"}</td>

            <td>${escapeHTML(request.location || "N/A")}</td>

            <td>
                ${escapeHTML(
                    request.preferred_pathway || "Not selected"
                )}
            </td>

            <td>
                ${escapeHTML(
                    request.opportunity || "Not specified"
                )}
            </td>

            <td>
                <span class="status-${request.status || "pending"}">
                    ${formatStatus(request.status)}
                </span>
            </td>

            <td>
                ${formatDate(request.created_at)}
            </td>

            <td>

                <button
                    class="view-btn"
                    onclick="viewSupportRequest('${request.id}')"
                >
                    View Details
                </button>

                ${
                    request.status === "pending"
                        ? `
                            <button
                                class="approve-btn"
                                onclick="updateSupportRequestStatus(
                                    '${request.id}',
                                    'reviewed'
                                )"
                            >
                                Mark Reviewed
                            </button>
                        `
                        : request.status === "reviewed"
                        ? `
                            <button
                                class="approve-btn"
                                onclick="updateSupportRequestStatus(
                                    '${request.id}',
                                    'contacted'
                                )"
                            >
                                Mark Contacted
                            </button>
                        `
                        : `
                            <span class="status-approved">
                                ${formatStatus(request.status)}
                            </span>
                        `
                }

            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ================================
// LOAD STATISTICS
// ================================

async function loadStatistics() {

    const { data, error } = await eabdSupabase
        .from("support_requests")
        .select("status");

    if (error) {

        console.error(
            "Error loading dashboard statistics:",
            error
        );

        return;
    }

    const submissions = data || [];

    const total =
        submissions.length;

    const pending =
        submissions.filter(
            (item) => item.status === "pending"
        ).length;

    const reviewed =
        submissions.filter(
            (item) => item.status === "reviewed"
        ).length;

    const contacted =
        submissions.filter(
            (item) => item.status === "contacted"
        ).length;

    const totalElement =
        document.getElementById("totalApplications");

    const pendingElement =
        document.getElementById("pendingApplications");

    const approvedElement =
        document.getElementById("approvedApplications");

    const rejectedElement =
        document.getElementById("rejectedApplications");

    const supportElement =
        document.getElementById("supportRequests");

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (pendingElement) {
        pendingElement.textContent = pending;
    }

    if (approvedElement) {
        approvedElement.textContent = reviewed;
    }

    if (rejectedElement) {
        rejectedElement.textContent = contacted;
    }

    if (supportElement) {
        supportElement.textContent = total;
    }
}


// ================================
// VIEW SUPPORT & DISCOVERY DETAILS
// ================================

async function viewSupportRequest(requestId) {

    const { data: request, error } =
        await eabdSupabase
            .from("support_requests")
            .select("*")
            .eq("id", requestId)
            .single();

    if (error) {

        console.error(
            "Error loading submission details:",
            error
        );

        alert("Error: " + error.message);

        return;
    }

    const detailsCard =
        document.getElementById(
            "applicationDetailsCard"
        ) ||
        document.getElementById(
            "supportRequestDetailsCard"
        );

    if (!detailsCard) {
        return;
    }

    detailsCard.innerHTML = `

        <div class="detail-item">
            <strong>Full Name</strong>
            <span>${escapeHTML(request.full_name)}</span>
        </div>

        <div class="detail-item">
            <strong>Age</strong>
            <span>${request.age || "N/A"}</span>
        </div>

        <div class="detail-item">
            <strong>Location</strong>
            <span>${escapeHTML(request.location || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Email</strong>
            <span>${escapeHTML(request.email)}</span>
        </div>

        <div class="detail-item">
            <strong>Phone</strong>
            <span>${escapeHTML(request.phone || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Interests</strong>
            <span>${escapeHTML(request.interests || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Abilities</strong>
            <span>${escapeHTML(request.abilities || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Current Skills / Experience</strong>
            <span>${escapeHTML(request.current_skills || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Goals</strong>
            <span>${escapeHTML(request.goals || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Desired Opportunity</strong>
            <span>${escapeHTML(request.opportunity || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Preferred Pathway</strong>
            <span>${escapeHTML(request.preferred_pathway || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Why This Pathway?</strong>
            <span>${escapeHTML(request.pathway_reason || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Support Needs</strong>
            <span>${escapeHTML(request.support_needs || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Accessibility / Participation Needs</strong>
            <span>${escapeHTML(request.accessibility_needs || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Barriers</strong>
            <span>${escapeHTML(request.barriers || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Requested EABD Support</strong>
            <span>${escapeHTML(request.requested_support || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Additional Information</strong>
            <span>${escapeHTML(request.additional_information || "N/A")}</span>
        </div>

        <div class="detail-item">
            <strong>Status</strong>
            <span>${formatStatus(request.status)}</span>
        </div>

        <div class="detail-item">
            <strong>Date Submitted</strong>
            <span>${formatDateTime(request.created_at)}</span>
        </div>

        <div class="detail-actions">

            ${
                request.status === "pending"
                    ? `
                        <button
                            class="approve-btn"
                            onclick="updateSupportRequestStatus(
                                '${request.id}',
                                'reviewed'
                            )"
                        >
                            Mark Reviewed
                        </button>
                    `
                    : ""
            }

            ${
                request.status === "reviewed"
                    ? `
                        <button
                            class="approve-btn"
                            onclick="updateSupportRequestStatus(
                                '${request.id}',
                                'contacted'
                            )"
                        >
                            Mark Contacted
                        </button>
                    `
                    : ""
            }

        </div>
    `;

    const detailsSection =
        document.getElementById(
            "applicationDetailsSection"
        ) ||
        document.getElementById(
            "supportRequestDetailsSection"
        );

    if (detailsSection) {
        detailsSection.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ================================
// UPDATE SUPPORT REQUEST STATUS
// ================================

async function updateSupportRequestStatus(
    requestId,
    newStatus
) {

    const { error } =
        await eabdSupabase
            .from("support_requests")
            .update({
                status: newStatus
            })
            .eq("id", requestId);

    if (error) {

        console.error(
            "Error updating submission:",
            error
        );

        alert("Error: " + error.message);

        return;
    }

    await loadSupportDiscovery();
    await loadStatistics();
    await loadRecentSupportRequests();

    await viewSupportRequest(requestId);

    alert(
        `Submission marked as ${formatStatus(newStatus)}.`
    );
}


// ================================
// RECENT SUPPORT & DISCOVERY
// ================================

async function loadRecentSupportRequests() {

    const container =
        document.getElementById(
            "recentSupportRequests"
        );

    if (!container) {
        return;
    }

    const { data, error } =
        await eabdSupabase
            .from("support_requests")
            .select(
                "id, full_name, preferred_pathway, status, created_at"
            )
            .order("created_at", {
                ascending: false
            })
            .limit(5);

    if (error) {

        console.error(
            "Error loading recent submissions:",
            error
        );

        container.innerHTML = `
            <p class="activity-empty">
                Error loading recent submissions.
            </p>
        `;

        return;
    }

    if (!data || data.length === 0) {

        container.innerHTML = `
            <p class="activity-empty">
                No recent submissions.
            </p>
        `;

        return;
    }

    container.innerHTML = "";

    data.forEach((request) => {

        const item =
            document.createElement("div");

        item.className = "activity-item";

        item.innerHTML = `
            <strong>
                ${escapeHTML(request.full_name)}
            </strong>

            <span>
                ${
                    escapeHTML(
                        request.preferred_pathway ||
                        "No pathway selected"
                    )
                }
                ·
                ${formatStatus(request.status)}
                ·
                ${formatDate(request.created_at)}
            </span>
        `;

        item.style.cursor = "pointer";

        item.addEventListener("click", () => {
            viewSupportRequest(request.id);
        });

        container.appendChild(item);
    });
}


// ================================
// SEARCH
// ================================

function setupSearch() {

    if (!applicationSearch) {
        return;
    }

    applicationSearch.addEventListener(
        "input",
        () => {
            loadSupportDiscovery();
        }
    );
}


// ================================
// STATUS FILTER
// ================================

function setupStatusFilter() {

    if (!statusFilter) {
        return;
    }

    statusFilter.addEventListener(
        "change",
        () => {
            loadSupportDiscovery();
        }
    );
}


// ================================
// LOGOUT
// ================================

const logoutBtns =
    document.querySelectorAll(".logout-btn");

logoutBtns.forEach((button) => {

    button.addEventListener(
        "click",
        async () => {

            const { error } =
                await eabdSupabase.auth.signOut();

            if (error) {

                alert(
                    "Logout error: " +
                    error.message
                );

                return;
            }

            window.location.href =
                "admin-login.html";
        }
    );
});


// ================================
// REFRESH DASHBOARD
// ================================

const refreshDashboardBtn =
    document.getElementById(
        "refreshDashboardBtn"
    );

if (refreshDashboardBtn) {

    refreshDashboardBtn.addEventListener(
        "click",
        async function () {

            refreshDashboardBtn.textContent =
                "Refreshing...";

            refreshDashboardBtn.disabled =
                true;

            await loadSupportDiscovery();
            await loadStatistics();
            await loadRecentSupportRequests();

            refreshDashboardBtn.textContent =
                "Refresh Dashboard";

            refreshDashboardBtn.disabled =
                false;
        }
    );
}


// ================================
// HELPERS
// ================================

function formatStatus(status) {

    if (!status) {
        return "Pending";
    }

    const statusMap = {
        pending: "Pending",
        reviewed: "Reviewed",
        contacted: "Contacted",
        resolved: "Resolved",
        rejected: "Rejected"
    };

    return (
        statusMap[status] ||
        status.charAt(0).toUpperCase() +
        status.slice(1)
    );
}


function formatDate(date) {

    if (!date) {
        return "N/A";
    }

    return new Date(date).toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


function formatDateTime(date) {

    if (!date) {
        return "N/A";
    }

    return new Date(date).toLocaleString(
        "en-NG",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ================================
// GLOBAL FUNCTIONS
// ================================

window.viewSupportRequest =
    viewSupportRequest;

window.updateSupportRequestStatus =
    updateSupportRequestStatus;