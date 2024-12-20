document.addEventListener("DOMContentLoaded", () => {
    // Hàm mở popup
    window.openPopup = function (popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.remove("hidden");
            popup.style.display = "block";
        } else {
            console.error(`Không tìm thấy popup với ID "${popupId}".`);
        }
    };

    // Hàm đóng popup
    window.closePopup = function (popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.add("hidden");
            popup.style.display = "none";
        } else {
            console.error(`Không tìm thấy popup với ID "${popupId}".`);
        }
    };

    // Hàm thêm group đã tham gia
    window.addJoinedGroup = (event) => {
        event.preventDefault();
        const groupID = document.getElementById("joinGroupID").value.trim();
        if (groupID) {
            const joinedGroupList = document.getElementById("joinedGroupList");
            const newGroup = document.createElement("li");
            newGroup.textContent = groupID;
            joinedGroupList.appendChild(newGroup);
            closePopup("joinGroupPopup"); // Đóng popup
            document.getElementById("joinGroupID").value = ""; // Reset trường input
        }
    };

    // Hàm thêm group đã tạo
    window.addCreatedGroup = (event) => {
        event.preventDefault();
        const groupName = document.getElementById("createGroupName").value.trim();
        if (groupName) {
            const createdGroupList = document.getElementById("createdGroupList");
            const newGroup = document.createElement("li");
            newGroup.textContent = groupName;
            newGroup.onclick = () => loadGroupDetails(groupName, true);
            createdGroupList.appendChild(newGroup);
            closePopup("createGroupPopup"); // Đóng popup
            document.getElementById("createGroupName").value = ""; // Reset trường input
        }
    };

    // Hàm tải chi tiết nhóm (tham gia hoặc đã tạo)
    window.loadGroupDetails = function (groupName, canManageMembers) {
        document.querySelector(".content-column h3").textContent = `Group: ${groupName}`;
        const manageMembersSection = document.getElementById("manageMembersSection");
        if (canManageMembers) {
            manageMembersSection.style.display = "block";
        } else {
            manageMembersSection.style.display = "none";
        }

        const groupMemberList = document.getElementById("groupMemberList");
        groupMemberList.innerHTML = ""; // Xóa các thành viên cũ

        // Thêm thành viên mẫu cho nhóm đã chọn
        for (let i = 1; i <= 5; i++) {
            const member = document.createElement("li");
            member.textContent = `${groupName} Member ${i}`;
            groupMemberList.appendChild(member);
        }
    };

    // Hàm thêm thành viên
    window.addMember = (event) => {
        event.preventDefault();
        const memberName = document.getElementById("newMemberName").value.trim();
        if (memberName) {
            const groupMemberList = document.getElementById("groupMemberList");
            const newMember = document.createElement("li");
            newMember.textContent = memberName;
            newMember.classList.add("removable");
            newMember.addEventListener("click", () => {
                // Cho phép chọn để xóa thành viên
                newMember.classList.toggle("selected-to-remove");
            });
            groupMemberList.appendChild(newMember);
            closePopup("addMemberPopup"); // Đóng popup
            document.getElementById("newMemberName").value = ""; // Reset trường input
        }
    };

    // Hàm mở popup xóa thành viên
    window.openRemoveMemberPopup = () => {
        const removeMemberList = document.getElementById("removeMemberList");
        removeMemberList.innerHTML = ""; // Xóa danh sách cũ

        // Lấy danh sách thành viên từ danh sách hiện tại
        const members = document.getElementById("groupMemberList").children;
        Array.from(members).forEach((member) => {
            const memberItem = document.createElement("li");
            memberItem.textContent = member.textContent;
            memberItem.classList.add("removable");

            // Thêm sự kiện click để chọn thành viên cần xóa
            memberItem.addEventListener("click", () => {
                memberItem.classList.toggle("selected-to-remove");
            });

            removeMemberList.appendChild(memberItem);
        });

        openPopup("removeMemberPopup");
    };

    // Hàm xóa thành viên đã chọn
    window.removeSelectedMember = () => {
        const selectedMembers = document.querySelectorAll(".selected-to-remove");
        selectedMembers.forEach((member) => {
            const memberName = member.textContent;

            // Xóa khỏi danh sách popup
            member.remove();

            // Tìm và xóa khỏi danh sách chính
            const groupMemberList = document.getElementById("groupMemberList");
            Array.from(groupMemberList.children).forEach((groupMember) => {
                if (groupMember.textContent === memberName) {
                    groupMember.remove();
                }
            });
        });

        closePopup("removeMemberPopup"); // Đóng popup sau khi xóa
    };

    // Khởi tạo Chart.js
    const ctx = document.getElementById("memberChart");
    if (ctx) {
        const chartInstance = new Chart(ctx.getContext("2d"), {
            type: "bar",
            data: {
                labels: ["Member 1", "Member 2", "Member 3", "Member 4"],
                datasets: [
                    {
                        label: "Activity Score",
                        data: [120, 95, 80, 60],
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
});
