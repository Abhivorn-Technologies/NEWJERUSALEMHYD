<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
    // Page Title
    var titleEl = document.querySelector(".page-title");
    if(titleEl) {
        titleEl.textContent = document.title;
        titleEl.style.color = "#222222";
        titleEl.style.fontSize = "36px";
        titleEl.style.fontWeight = "700";
    }

    // Page URL / Breadcrumb
    var urlEl = document.querySelector(".page-url");
    if(urlEl) {
        var pathArray = window.location.pathname.split("/").filter(function(i){return i});
        var breadcrumb = '<span>Home</span>';

        pathArray.forEach(function(part){
            var text = part.replace(/-/g, " ");
            breadcrumb += '<span>' + text.charAt(0).toUpperCase() + text.slice(1) + '</span>';
        });

        urlEl.innerHTML = breadcrumb;
    }
});
</script>
<!-- end Simple Custom CSS and JS -->
