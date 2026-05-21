<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
  let header = document.querySelector(".smart-sticky-header");
  let lastScrollTop = 0;
  let scrollThreshold = 20; // small buffer to prevent flicker

  window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Always show at the top
    if (currentScroll <= 0) {
      header.classList.remove("hide");
      return;
    }

    // Scrolling down — hide header
    if (currentScroll > lastScrollTop + scrollThreshold) {
      header.classList.add("hide");
    }

    // Scrolling up — show header
    else if (currentScroll < lastScrollTop - scrollThreshold) {
      header.classList.remove("hide");
    }

    lastScrollTop = currentScroll;
  });
});
</script>
<!-- end Simple Custom CSS and JS -->
