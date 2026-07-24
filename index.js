document.addEventListener("DOMContentLoaded", () => {
    const tabs = [
        ...document.querySelectorAll(".dna-report-tab")
    ];

    const previewButton = document.getElementById(
        "dna-report-preview"
    );

    const previewImage = document.getElementById(
        "dna-report-image"
    );

    const previewCaption = document.getElementById(
        "dna-report-caption"
    );

    const modal = document.getElementById(
        "dna-report-modal"
    );

    const modalImage = document.getElementById(
        "dna-report-modal-image"
    );

    const modalTitle = document.getElementById(
        "dna-modal-title"
    );

    const modalCloseButtons = document.querySelectorAll(
        "[data-close-report-modal]"
    );

    if (
        tabs.length === 0 ||
        !previewButton ||
        !previewImage ||
        !previewCaption ||
        !modal ||
        !modalImage ||
        !modalTitle
    ) {
        return;
    }

    let activeReport = {
        image: previewImage.src,
        alt: previewImage.alt,
        caption: previewCaption.textContent.trim()
    };

    function selectReport(tab) {
        const report = {
            image: tab.dataset.image,
            alt: tab.dataset.alt,
            caption: tab.dataset.caption
        };

        if (
            !report.image ||
            !report.alt ||
            !report.caption
        ) {
            return;
        }

        tabs.forEach((item) => {
            const isActive = item === tab;

            item.classList.toggle(
                "active",
                isActive
            );

            item.setAttribute(
                "aria-selected",
                String(isActive)
            );
        });

        previewButton.classList.add(
            "is-changing"
        );

        const loader = new Image();

        loader.onload = () => {
            previewImage.src = report.image;
            previewImage.alt = report.alt;

            previewCaption.textContent =
                report.caption;

            previewButton.setAttribute(
                "aria-label",
                `Open a larger preview of the ${report.caption}`
            );

            activeReport = report;

            previewButton.classList.remove(
                "is-changing"
            );
        };

        loader.onerror = () => {
            previewButton.classList.remove(
                "is-changing"
            );

            console.error(
                `Unable to load report image: ${report.image}`
            );
        };

        loader.src = report.image;
    }

    function openModal() {
        modalImage.src = activeReport.image;

        modalImage.alt =
            `Enlarged ${activeReport.alt}`;

        modalTitle.textContent =
            activeReport.caption;

        modal.hidden = false;

        document.body.classList.add(
            "dna-modal-open"
        );

        const closeButton = modal.querySelector(
            ".dna-report-modal-close"
        );

        if (closeButton) {
            closeButton.focus();
        }
    }

    function closeModal() {
        if (modal.hidden) {
            return;
        }

        modal.hidden = true;

        document.body.classList.remove(
            "dna-modal-open"
        );

        previewButton.focus();
    }

    tabs.forEach((tab) => {
        tab.addEventListener(
            "click",
            () => selectReport(tab)
        );
    });

    previewButton.addEventListener(
        "click",
        openModal
    );

    modalCloseButtons.forEach((button) => {
        button.addEventListener(
            "click",
            closeModal
        );
    });

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        }
    );
});