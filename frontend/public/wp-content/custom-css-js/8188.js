<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
    var container = document.querySelector(".page-only-container");
    if(!container) return;

    // Get body classes
    var bodyClasses = document.body.className;

    // Show container only on Pages, hide on Home & Blog
    if(bodyClasses.includes("page") && !bodyClasses.includes("home") && !bodyClasses.includes("blog")) {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
});
</script>
<!-- end Simple Custom CSS and JS -->
