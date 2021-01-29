const tableBody = document.querySelector("tbody");

if (tableBody) {
    tableBody.addEventListener("click", e => {
        e.preventDefault();

        if (e.target.className.indexOf("delete-btn") >= 0) {

            const answer = confirm("Are you sure you want to delete?");

            if (answer) {
                const tagId = e.target.dataset.tagId;

                // delete tag
                fetch(`/tags/${tagId}`, { method: "DELETE" });

                // remove row from the table
                const tableRow = e.target.closest("tr");
                tableBody.removeChild(tableRow);
            }
        }
    });
}